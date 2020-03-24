
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
import { state } from '@angular/animations';
import { OrdersUpdated } from '../order.actions';
import { OrderActions } from '../order.action.types';

export const ordersFeatureKey = 'orders';

export interface OrdersState extends EntityState<IOrder> {
 
}


export const OrderAdapter = createEntityAdapter<IOrder>();
export const initialStateOrders = OrderAdapter.getInitialState();
export const OrderReducer = createReducer(
  initialStateOrders,
  on(OrderActions.OrdersUpdated, (state,action)=> OrderAdapter.upsertMany(action.orders,state)),
  on(OrderActions.OrdersDeleted, (state,action)=> OrderAdapter.removeMany(action.orders,state)),
);

export function orderreducer(state: OrdersState | undefined, action: Action) {
  return OrderReducer(state, action);
}

export const {selectAll, selectEntities} = OrderAdapter.getSelectors();



export const metaReducers: MetaReducer<OrdersState>[] = !environment.production ? [] : [];
