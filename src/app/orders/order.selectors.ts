import { IONECGood, IONECGoodWithOwner } from './../models/onec.good';
import { IWEBGood, IWEBGoodWithFilials } from './../models/web.good';
import { OrdersState } from './reducers/index';
import * as fromOrder from './reducers/index';
import { createFeatureSelector, createSelector, props } from '@ngrx/store';
import { Dictionary } from '@ngrx/entity';
import { selectOptionState } from '../option.selectors';


/// ОБЩИЕ 

export const selectOrderState = createFeatureSelector<OrdersState>(fromOrder.ordersFeatureKey);



export const selectAllOrders = createSelector(
    selectOrderState,
    fromOrder.selectAll // встроеный в адаптер селектор мы его експортировали в файле reducers/index 
)

export const selectAllOrdersEntities = createSelector(
    selectOrderState,
    fromOrder.selectEntities // встроеный в адаптер селектор мы его експортировали в файле reducers/index 
)



