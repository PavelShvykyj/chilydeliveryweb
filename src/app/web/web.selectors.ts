import { IONECGood } from './../models/onec.good';
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


/// ФИЛЬТРы

export const selectGoodsByParent = createSelector(
    selectAllWebGoods,
    selectAllDirtyWebEntities,
    (goods:IWEBGood[] , dirtygoods:Dictionary<IONECGood>,  props) => goods
    .filter(element => (element.parentid == props.parentid) || (props.parentid == undefined && element.parentid == ""))
    .map(el  => {return {...el, filialNames:el.filials.map(felement => {return dirtygoods[felement].filial})}})

)

export const selectDirtyGoodsByParent = createSelector(
    selectAllDirtyWebGoods,
    (goods:IONECGood[], props) => goods.filter(element => (element.filial == props.filialname) && ((element.parentid == props.parentid) || (props.parentid == undefined && element.parentid == "")))
)


export const selectGoodById = createSelector(
    selectAllWebGoods,
    (goods, props) => goods.filter(element => element.id == props.id)
)

export const selectDirtyGoodFilialById = createSelector(
    selectAllDirtyWebGoods,
    (goods, props) => goods.filter(element => element.id == props).map(element=> element.filial)
)

function GetNotInOnC(dirtygoods:Dictionary<IONECGood>,goods:IWEBGood[],props:string) : IWEBGoodWithFilials[] {
    return goods
    .map(el  => {return {...el, filialNames:el.filials.map(felement => {return dirtygoods[felement].filial})}})
    .filter(element => {return (!element.isFolder && element.filialNames.indexOf(props)==-1)})
}

function GetByname(dirtygoods:Dictionary<IONECGood>,goods:IWEBGood[],props:string) : IWEBGoodWithFilials[] {
    return goods
    .map(el  => {return {...el, filialNames:el.filials.map(felement => {return dirtygoods[felement].filial})}})
    .filter(element => {return (!element.isFolder && element.name.search(props)!=-1)})
}


export const selectNotInONEC = createSelector(
    selectAllDirtyWebEntities,
    selectAllWebGoods,
    selectOptionState,
    (dirtygoods,goods,props) => GetNotInOnC(dirtygoods,goods,props.filialname)

)

export const selectGoodByName = createSelector(
    selectAllDirtyWebEntities,
    selectAllWebGoods,
    (dirtygoods,goods,props) => GetByname(dirtygoods,goods,props)
)

export const selectDirtyGoodByName = createSelector(
    selectAllDirtyWebGoods,
    (goods,props)=>goods.filter(element => { return (element.filial==props.filialname && !element.isFolder && element.name.search(props.name)!=-1)})

)

export const selectDirtyGoodBySelection = createSelector(
    selectAllDirtyWebGoods,
    (goods,props) => goods.filter(element => element.isSelected && element.filial==props.filialname)
)

export const selectGoodBySelection = createSelector(
    selectAllWebGoods,
    goods => goods.filter(element => element.isSelected)
)

