import { IONECGood } from './../models/onec.good';
import * as fromOnec from './reducers/index';
import { OnecState } from './reducers/index';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export const selectOnecState = createFeatureSelector<OnecState>(fromOnec.FeatureKey);

export const selectAllGoods = createSelector(
    selectOnecState,
    fromOnec.selectAll // встроеный в адаптер селектор мы его експортировали в файле reducers/index 
)

export const selectGoodsByParent = createSelector(
    selectAllGoods,
    (goods,props) => goods.filter(element => element.parentid == props.parentid)
)

export const selectGoodById = createSelector(
    selectAllGoods,
    (goods,props) => goods.filter(element => element.id == props.id)
)

export const selectGoodBySelection = createSelector(
    selectAllGoods,
    goods => goods.filter(element => element.isSelected)
)

function GetExternalParentId(parentGoods:IONECGood[],parentid:string) : string {
   const parents:IONECGood[] = parentGoods.filter(parentel=> parentel.id==parentid);
   if(parents.length==0) {
       return ""
   } else {
       return parents[0].externalid 
   }
}
 
export const selectGoodBySelectionForUpload = createSelector(
    selectAllGoods,
    goods => goods.filter(element => element.isSelected)
    .map(element=> {return {...element, parentid: GetExternalParentId(goods,element.parentid)}})
)


export const selectNotInWeb = createSelector(
    selectAllGoods,
    goods => goods.filter(element => {return ( element.externalid=="" || element.externalid==undefined)})
)

export const selectGoodByName = createSelector(
    selectAllGoods,
    (goods:IONECGood[],props:string) => goods.filter(element =>{
     
    return !element.isFolder && element.name.search(props)!=-1})  
)


export const areAllGoodsLoaded = createSelector(
    selectOnecState,
    state => state.allGoodsLoaded 
)




