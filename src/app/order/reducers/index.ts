import { initialState } from './../../option.reducer';
import { IOrder, IOrderGoodsRecord, IOrderCommentRecord } from './../../models/order';
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
import { EditOrderActions } from '../editorder.action.types';


export const editorderFeatureKey = 'editorder';


export interface OrderGoodssState extends EntityState<IOrderGoodsRecord> {
 
}

export interface EditOrderState {
  addres:string,
  phone:string,
  creation:Date,
  filial:string,
  desk:string,
  comment:string,
  goods: OrderGoodssState
}

export const EditOrderGoodsAdapter = createEntityAdapter<IOrderGoodsRecord>();

export const EditOrderInitialState = {
  addres:"",
  phone:"",
  creation: new Date(),
  filial:"",
  desk:"",
  comment:"",
  goods: EditOrderGoodsAdapter.getInitialState()
}

export const EditOrderReducer = createReducer(
  EditOrderInitialState,
  on(EditOrderActions.OrderCreated, (state,action)=> EditOrderInitialState),
  on(EditOrderActions.UpdateOrderHeader, (state,action)=> {return {...state, ...action.header}}),
  on(EditOrderActions.UpsertOrderRecord, (state,action)=> {return {...state,goods: EditOrderGoodsAdapter.upsertOne(action.record,state.goods) } }),
  on(EditOrderActions.DeleteOrderRecord, (state,action)=> {return {...state,goods: EditOrderGoodsAdapter.removeOne(action.recordid,state.goods) } }),



);

export function editorderreducer(state: EditOrderState | undefined, action: Action) {
  return EditOrderReducer(state, action);
}

export const {selectAll, selectEntities} = EditOrderGoodsAdapter.getSelectors();

export const metaReducers: MetaReducer<EditOrderState>[] = !environment.production ? [] : [];
