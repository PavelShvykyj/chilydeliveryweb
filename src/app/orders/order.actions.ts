import { IOrder } from './../models/order';
import { IONECGood } from './../models/onec.good';
import { IWEBGood, IWEBGoodWithFilials } from './../models/web.good';
import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

export const loadAllOrders = createAction("[EXCHANGE ORDERS RESOLVER] Load orders");
export const loadAllOrdersOnAppInit = createAction("[APP COMPONENT] Load orders on app init");
export const allOrdersLoaded = createAction("[LOAD ORDERS EFFECT] Orders loaded",props<{orders: IOrder[]}>());
export const OrdersUpdated = createAction("[APP COMPONENT] Orders Updated",props<{orders: IOrder[]}>());
export const OrdersDeleted  = createAction("[APP COMPONENT] Orders deleted",props<{orders: string[]}>());
export const BlockOrder = createAction("[MOBILE QUEUE COMPONENT] block order",props<{order: IOrder}>());
export const ReleaseOrder = createAction("[ORDER LIST COMPONENT] release order",props<{id: string}>());
export const OrderBlockErr = createAction("[BLOCK ORDER EFFECT] fail block order");