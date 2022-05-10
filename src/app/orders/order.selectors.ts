import { IOrder, IOrderWithGoods } from './../models/order';
import { state } from '@angular/animations';
import { IONECGood, IONECGoodWithOwner } from './../models/onec.good';
import { IWEBGood, IWEBGoodWithFilials } from './../models/web.good';
import { OrdersState } from './reducers/index';
import * as fromOrder from './reducers/index';
import { createFeatureSelector, createSelector, props } from '@ngrx/store';
import { Dictionary } from '@ngrx/entity';
import { selectOptionState } from '../option.selectors';
import { selectAllWebGoods, selectAllWebEntities } from '../web/web.selectors';
import { wtfLeave } from '@angular/core';

function SortByCreation(el1:IOrder,el2:IOrder) {
    if (el1.creation>el2.creation) {
        return 1;
    }

    if (el1.creation==el2.creation) {
        return 0;
    }

    if (el1.creation<el2.creation) {
        return -1;
    }


}

/// ОБЩИЕ

export const selectOrderState = createFeatureSelector<OrdersState>(fromOrder.ordersFeatureKey);



export const selectAllOrders = createSelector(
    selectOrderState,
    fromOrder.selectAll // встроеный в адаптер селектор мы его експортировали в файле reducers/index
)

export const selectAllOrdersWithEntities = createSelector(
    selectAllOrders,
    selectAllWebEntities,
    (orders,goods) => {
        const orderswithgoods  = orders.map(order => {return {...order, goods: order.goods.map(el =>{return {...el,good:goods[el.id]}})}})
        return orderswithgoods
    }
)

export const selectMobileOrders = createSelector(
    selectAllOrdersWithEntities,
    orders => orders.filter(el=> el.externalid=="").sort((el1,el2)=>SortByCreation(el1,el2) ));

export const selectAllOrdersEntities = createSelector(
    selectOrderState,
    fromOrder.selectEntities // встроеный в адаптер селектор мы его експортировали в файле reducers/index
)

export const AreOrdesLoaded = createSelector(selectOrderState,
    state => state.allOrdersLoaded)


