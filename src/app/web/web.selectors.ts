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


export const areAllChoiceGoodsLoaded  = createSelector(
  selectWebState,
  state => state.choiceGoodsLoaded);

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

export const selectWebGoodByID = createSelector(
    selectAllWebEntities,
    (WebEntities: Dictionary<IWEBGood>,id:string) => {
        //console.log('selectWebGoodByID', id, WebEntities[id])
        return WebEntities[id]})

export const selectAllDirtyWebEntities = createSelector(
    DirtyGoodsState,
    fromWeb.selectDirtyAllEntities // встроеный в адаптер селектор мы его експортировали в файле reducers/index
)

export const selectAllDirtyWebGoods = createSelector(
    DirtyGoodsState,
    fromWeb.selectDirtyAll // встроеный в адаптер селектор мы его експортировали в файле reducers/index
)



/////////////// ФУНКЦИИ


function GetByname(dirtygoods:Dictionary<IONECGood>,goods:IWEBGood[],props:{onlyfolders:boolean,filter:string}) : IWEBGoodWithFilials[] {
    if (props.onlyfolders) {
        goods = goods.filter(el=>el.isFolder)
    }

    goods = goods.filter(element => {return ((!element.isFolder || props.onlyfolders) && element.name.toUpperCase().search(props.filter)!=-1)})
    return GoodsWithFilials(goods,dirtygoods);
}

function DirtyGoodsWithOwner(goods,webgoods) : IONECGoodWithOwner[] {
   return goods.map(elgood => {
        const owner : IWEBGood[] = webgoods.filter(elwebgood => elwebgood.filials.indexOf(elgood.id)!=-1);
        return {...elgood, owner}
        })
}

function GoodsWithFilials(goods , dirtygoods) : IWEBGoodWithFilials[] {
    return goods.map(el  => {return {...el,
        filialNames:el.filials.map(felement => {let dEl = dirtygoods[felement] ; return dEl == undefined ? 'неизвестно' : dEl.filial}),
        filialElements:el.filials.map(felement => {let dEl = dirtygoods[felement] ; return dEl == undefined ? {name : 'неизвестно'} : dEl })}
       })
}

/// ФИЛЬТРЫ
export const selectWebGoodsByCategoty = createSelector(
    selectAllWebGoods,
    (goods:IWEBGood[],  props) =>
    {

        const catgoods : IWEBGood[] = goods.filter(el => {return (el.mCategory == props.mCategory) && !el.isFolder})
                                         .sort((el1,el2)=>{
                                            if (el1.mNumber>el2.mNumber) {
                                                return -1
                                            }

                                            if (el1.mNumber==el2.mNumber) {
                                                return 0
                                            }

                                            if (el1.mNumber<el2.mNumber) {
                                                return 1
                                            }
                                        });

        return catgoods

    }
);

export const selectMaxNumbersByCategoty = createSelector(
    selectWebGoodsByCategoty,
    (goods:IWEBGood[]) =>
    {
        if (goods.length == 0) {
            return 0
        } else {
            return goods[0].mNumber = undefined? 0 : goods[0].mNumber;
        }
    }
);



export const selectGoodsByParent = createSelector(
    selectAllWebGoods,
    selectAllDirtyWebEntities,
    (goods:IWEBGood[] , dirtygoods:Dictionary<IONECGood>,  props) =>
    {
        if (props.onlyfolders) {
            goods = goods.filter(el=> el.isFolder)
        }

        goods = goods.filter(element => (element.parentid == props.parentid) || (props.parentid == undefined && element.parentid == ""));

        return GoodsWithFilials(goods,dirtygoods);

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

export const selectDirtyGoodsByIDS = createSelector(
    selectAllWebGoods,
    ( webgoods:IWEBGood[] ,props) =>
        {
          let fgoods : Array<Partial<IONECGoodWithOwner>> = [];
          props.ids.forEach(did => {
            webgoods.forEach(wg => {
              if (wg.filials.indexOf(did) != -1) {
                fgoods.push({id:did, owner:[wg]})
              }
            })
          });
          return fgoods;
        }
)

export const selectGoodsByIDS = createSelector(

  selectAllWebGoods,
  ( webgoods:IWEBGood[] ,props) =>
      {

        let goods = webgoods.filter(element =>
          {let finde = false
            element.filials.forEach(fid => {
              finde = finde || (props.ids.indexOf(element.id) != -1);
            })
            return finde;
          }
          );
         return goods;
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
        goods = goods.filter(element => { return (element.filial==props.filialname && !element.isFolder && element.name.toUpperCase().search(props.name)!=-1)});
        return DirtyGoodsWithOwner(goods,webgoods)
    }

)

export const selectGoodBySelection = createSelector(
    selectAllWebGoods,
    selectAllDirtyWebEntities,
    (goods:IWEBGood[] , dirtygoods:Dictionary<IONECGood>) => {
        goods = goods.filter(element => element.isSelected);
        return GoodsWithFilials(goods,dirtygoods);
    }
)

export const selectDirtyGoodBySelection = createSelector(
    selectAllDirtyWebGoods,
    selectAllWebGoods,
    (goods:IONECGood[], webgoods:IWEBGood[] ,props) => {
        goods = goods.filter(element => element.isSelected && element.filial==props.filialname);
        return DirtyGoodsWithOwner(goods,webgoods);
    }
)

export const selectAllBySelection = createSelector(
    selectAllDirtyWebGoods,
    selectAllWebGoods,
    selectAllDirtyWebEntities,
    (goods:IONECGood[], webgoods:IWEBGood[], goodsentyties ) => {
        let sdirtygoods = goods.filter(element => element.isSelected);
        let swebgoods = webgoods.filter(element => element.isSelected);
        return {
            dirty:DirtyGoodsWithOwner(sdirtygoods,webgoods),
            web:GoodsWithFilials(swebgoods,goodsentyties)
        }
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
