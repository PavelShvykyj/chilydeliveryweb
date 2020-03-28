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
  filial:"luxor",
  desk:"",
  comment:"",
  goods: EditOrderGoodsAdapter.getInitialState()
}

function UpsertOrderRecord(state: EditOrderState ,action) {
  let record : IOrderGoodsRecord = action.record;
  if ((state.goods.ids as string[]).indexOf(record.id)  == -1) {
    return {...state,goods: EditOrderGoodsAdapter.upsertOne(action.record,state.goods) }  
  } else {

    const findedrecord   = state.goods.entities[record.id];
    if (findedrecord.quantity+record.quantity > 0) {
      record.quantity = findedrecord.quantity+record.quantity;
      return {...state,goods: EditOrderGoodsAdapter.upsertOne(record,state.goods) }  
      
    } else {
      return {...state,goods: EditOrderGoodsAdapter.removeOne(action.record,state.goods) }  

    }


  }

  
}

export const EditOrderReducer = createReducer(
  EditOrderInitialState,
  on(EditOrderActions.OrderCreated, (state,action)=> EditOrderInitialState),
  on(EditOrderActions.UpdateOrderHeader, (state,action)=> {return {...state, ...action.header}}),
  on(EditOrderActions.UpdateOrderfilial, (state,action)=> {return {...state, filial: action.filial}}),
  on(EditOrderActions.UpsertOrderRecord, (state,action)=> UpsertOrderRecord(state,action)),
  on(EditOrderActions.DeleteOrderRecord, (state,action)=> {return {...state,goods: EditOrderGoodsAdapter.removeOne(action.recordid,state.goods) } }),



);

export function editorderreducer(state: EditOrderState | undefined, action: Action) {
  return EditOrderReducer(state, action);
}

export const {selectAll, selectEntities} = EditOrderGoodsAdapter.getSelectors();

export const metaReducers: MetaReducer<EditOrderState>[] = !environment.production ? [] : [];
