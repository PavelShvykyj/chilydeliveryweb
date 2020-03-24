import { IOrder } from './../models/order';
import { IONECGood } from './../models/onec.good';
import { IWEBGood, IWEBGoodWithFilials } from './../models/web.good';
import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

export const loadAllOrders = createAction("[EXCHANGE ORDERS RESOLVER] Load orders");
export const allOrdersLoaded = createAction("[LOAD ORDERS EFFECT] Orders loaded",props<{orders: IOrder[]}>());
export const OrdersUpdated = createAction("[APP COMPONENT] Orders loaded",props<{orders: IOrder[]}>());
export const OrdersDeleted  = createAction("[APP COMPONENT] Orders deleted",props<{orders: string[]}>());