import { IOrder, IOrderGoodsRecord, IOrderHeader } from '../models/order';
import { IONECGood } from '../models/onec.good';
import { IWEBGood, IWEBGoodWithFilials } from '../models/web.good';
import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

export const UpdateOrderHeader    = createAction("[EDIT ORDER COMPONENT] Update order in memoty",props<{header:IOrderHeader}>());
export const UpdateOrderfilial    = createAction("[EDIT ORDER COMPONENT] Update order filial in memoty",props<{filial:string}>());
export const UpsertOrderRecord    = createAction("[EDIT ORDER COMPONENT] Update order goods in memoty",props<{record:IOrderGoodsRecord}>());
export const DeleteOrderRecord    = createAction("[EDIT ORDER COMPONENT] Delete order goods record in memoty",props<{recordid: string}>());
export const CreateOrder    = createAction("[EDIT ORDER COMPONENT] Create new orders",props<{order: IOrder}>());
export const OrderCreated   = createAction("[EDIT ORDER EFFECT] Order are created");
