import { IONECGood, IONECGoodWithOwner } from './../models/onec.good';
import { IWEBGood, IWEBGoodWithFilials } from './../models/web.good';
import { WebState } from './reducers/index';
import * as fromWeb from './reducers/index';
import { createFeatureSelector, createSelector, props } from '@ngrx/store';
import { Dictionary } from '@ngrx/entity';
import { selectOptionState } from '../option.selectors';

/// ОБЩИЕ 

export const selectWebState = createFeatureSelector<WebState>(fromWeb.webFeatureKey);

export const areAllWebGoodsLoaded = createSelector(
    selectWebState,
    state => state.allGoodsLoaded);

export const GoodsState = createSelector(
    selectWebState,
    state => state.webGoods
);

export const DirtyGoodsState = createSelector(
    selectWebState,
    state => state.dirtywebGoods
);


export const selectAllWebGoods = createSelector(
    GoodsState,
    fromWeb.selectAll // встроеный в адаптер селектор мы его експортировали в файле reducers/index 
)

export const selectAllWebEntities = createSelector(
    GoodsState,
    fromWeb.selectEntities // встроеный в адаптер селектор мы его експортировали в файле reducers/index 
)

export const selectAllDirtyWebEntities = createSelector(
    DirtyGoodsState,
    fromWeb.selectDirtyAllEntities // встроеный в адаптер селектор мы его експортировали в файле reducers/index 
)

export const selectAllDirtyWebGoods = createSelector(
    DirtyGoodsState,
    fromWeb.selectDirtyAll // встроеный в адаптер селектор мы его експортировали в файле reducers/index 
)

/////////////// ФУНКЦИИ
function GetNotInOnC(dirtygoods:Dictionary<IONECGood>,goods:IWEBGood[],props:string) : IWEBGoodWithFilials[] {
    return goods
    .map(el  => {return {...el,
         filialNames:el.filials.map(felement => {return dirtygoods[felement].filial}),
         filialElements:el.filials.map(felement => {return dirtygoods[felement]})}   
        })
    .filter(element => {return (!element.isFolder && element.filialNames.indexOf(props)==-1)})
}

function GetByname(dirtygoods:Dictionary<IONECGood>,goods:IWEBGood[],props:{onlyfolders:boolean,filter:string}) : IWEBGoodWithFilials[] {
    if (props.onlyfolders) {
        goods = goods.filter(el=>el.isFolder)  
    }    
    
    return goods
    .map(el  => {return {...el,
        filialNames:el.filials.map(felement => {return dirtygoods[felement].filial}),
        filialElements:el.filials.map(felement => {return dirtygoods[felement]})}   
       })
   .filter(element => {return ((!element.isFolder || props.onlyfolders) && element.name.search(props.filter)!=-1)})
}

function DirtyGoodsWithOwner(goods,webgoods) : IONECGoodWithOwner[] {
   return goods.map(elgood => {
        const owner : IWEBGood[] = webgoods.filter(elwebgood => elwebgood.filials.indexOf(elgood.id)!=-1);
        return {...elgood, owner}
        })
}

/// ФИЛЬТРы

export const selectGoodsByParent = createSelector(
    selectAllWebGoods,
    selectAllDirtyWebEntities,
    (goods:IWEBGood[] , dirtygoods:Dictionary<IONECGood>,  props) =>
    {
        if (props.onlyfolders) {
            goods = goods.filter(el=> el.isFolder)
        }
        return  goods
        .filter(element => (element.parentid == props.parentid) || (props.parentid == undefined && element.parentid == ""))
        .map(el  => {return {...el,
            filialNames:el.filials.map(felement => {return dirtygoods[felement].filial}),
            filialElements:el.filials.map(felement => {return dirtygoods[felement]})}   
           })
    }
);

export const selectDirtyGoodsByParent = createSelector(
    selectAllDirtyWebGoods,
    selectAllWebGoods,
    (goods:IONECGood[], webgoods:IWEBGood[] ,props) => 
        {
           goods = goods.filter(element => 
            (element.filial == props.filialname) && 
            ((element.parentid == props.parentid) || 
            (props.parentid == undefined && element.parentid == "")));
           return DirtyGoodsWithOwner(goods,webgoods); 
        }
    )


export const selectGoodByName = createSelector(
    selectAllDirtyWebEntities,
    selectAllWebGoods,
    (dirtygoods,goods,props) => GetByname(dirtygoods,goods,props)
)

export const selectDirtyGoodByName = createSelector(
    selectAllDirtyWebGoods,
    selectAllWebGoods,
    (goods:IONECGood[], webgoods:IWEBGood[] ,props)=> {
        goods = goods.filter(element => { return (element.filial==props.filialname && !element.isFolder && element.name.search(props.name)!=-1)});
        return DirtyGoodsWithOwner(goods,webgoods)
    }

)

export const selectGoodBySelection = createSelector(
    selectAllWebGoods,
    goods => goods.filter(element => element.isSelected)
)

export const selectDirtyGoodBySelection = createSelector(
    selectAllDirtyWebGoods,
    selectAllWebGoods,
    (goods:IONECGood[], webgoods:IWEBGood[] ,props) => {
        goods = goods.filter(element => element.isSelected && element.filial==props.filialname);
        return DirtyGoodsWithOwner(goods,webgoods);
    } 
)





export const selectDirtyGoodFilialById = createSelector(
    selectAllDirtyWebGoods,
    (goods, props) => goods.filter(element => element.id == props).map(element=> element.filial)
)

export const selectUnattached = createSelector(
    selectAllDirtyWebGoods,
    selectAllWebGoods,
    (goods:IONECGood[], webgoods:IWEBGood[] ,props) => 
        {
           goods = goods.filter(element => 
            (element.filial == props.filialname) && 
            !element.isFolder);
            let goodswithfilial =  DirtyGoodsWithOwner(goods,webgoods); 
            return goodswithfilial.filter(element => !element.isFolder && (element.owner==undefined || element.owner.length==0))
        }
)

export const selectGoodById = createSelector(
    selectAllWebGoods,
    (goods, props) => goods.filter(element => element.id == props.id)
)