import { allOrdersLoaded } from './../order.actions';

import { IOrder } from './../../models/order';
import { IONECGood } from './../../models/onec.good';
import { IWEBGood } from './../../models/web.good';
import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer,
  createReducer,
  Action,
  on
} from '@ngrx/store';

import { environment } from '../../../environments/environment';
import { EntityState, createEntityAdapter, Dictionary } from '@ngrx/entity';
import { OrderActions } from '../order.action.types';

export const ordersFeatureKey = 'orders';

export interface OrdersState extends EntityState<IOrder> {
  allOrdersLoaded:boolean
}


export const OrderAdapter = createEntityAdapter<IOrder>();
/// allOrdersLoaded - сразу ставим в истина ресолвер пропустит без обращения а первые изменения мы должы
/// получить в подписке на изменения
export const initialStateOrders = OrderAdapter.getInitialState({allOrdersLoaded:true});
export const OrderReducer = createReducer(
  initialStateOrders,
  on(OrderActions.OrdersUpdated, (state,action)=> OrderAdapter.upsertMany(action.orders,state)),
  on(OrderActions.OrdersDeleted, (state,action)=> OrderAdapter.removeMany(action.orders,state)),
  on(OrderActions.allOrdersLoaded, (state,action)=> OrderAdapter.addAll(action.orders,{...state, allOrdersLoaded:true})),
);

export function orderreducer(state: OrdersState | undefined, action: Action) {
  return OrderReducer(state, action);
}

export const {selectAll, selectEntities} = OrderAdapter.getSelectors();



export const metaReducers: MetaReducer<OrdersState>[] = !environment.production ? [] : [];
