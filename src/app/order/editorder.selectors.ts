import { IONECGood, IONECGoodWithOwner } from '../models/onec.good';
import { IWEBGood, IWEBGoodWithFilials } from '../models/web.good';
import { EditOrderState } from './reducers/index';
import * as fromEditOrder from './reducers/index';
import { createFeatureSelector, createSelector, props } from '@ngrx/store';
import { Dictionary } from '@ngrx/entity';
import { selectOptionState } from '../option.selectors';
import { state } from '@angular/animations';
import { selectAllWebEntities } from '../web/web.selectors';


/// ОБЩИЕ 

export const selectEditOrderState = createFeatureSelector<EditOrderState>(fromEditOrder.editorderFeatureKey);



export const GoodsState = createSelector(
    selectEditOrderState,
    state => state.goods
);

export const selectAllOrderGoods = createSelector(
    GoodsState,
    fromEditOrder.selectAll // встроеный в адаптер селектор мы его експортировали в файле reducers/index 
)

export const selectAllOrderGoodsWithEntity = createSelector(
    selectAllOrderGoods,
    selectAllWebEntities,
    (records,entities) => records.map(record => {return {...record, good:entities[record.id]}})
)



export const selectOrderHeader = createSelector(
    selectEditOrderState,
    state => {
        return {
            addres: state.addres,
            phone: state.phone,
            comment: state.comment
        }
    }
)

export const selectOrderOnecData = createSelector(
    selectEditOrderState,
    state => {
        return {
            creation: state.creation,
            desk: state.desk,
        }
    }
)


export const selectOrderFilial = createSelector(
    selectEditOrderState,
    state => state.filial
)

export const EditingOrder = createSelector(
    selectEditOrderState,
    selectAllOrderGoods,
    selectAllOrderGoodsWithEntity,
    (state,goods,entities) => {return  {...state, goods:goods, entities:entities}}
);



