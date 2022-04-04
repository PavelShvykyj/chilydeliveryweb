import { initialState } from './../../option.reducer';
import { IOrder, IOrderGoodsRecord, IOrderCommentRecord, IOrderCutlery } from './../../models/order';
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

export function GetInitCutleryString() : string {
  let cutlery : IOrderCutlery[] = [];
  cutlery.push( {id: "1" , name : 'Без приборів' , quantity : 0 });
  cutlery.push( {id: "2" , name : 'Виделка' , quantity : 0 });
  cutlery.push( {id: "3" , name : 'Ложка' , quantity : 0 });
  cutlery.push( {id: "4" , name : 'Ніж' , quantity : 0 });
  cutlery.push( {id: "5" , name : 'Палочки' , quantity : 0 });
  cutlery.push( {id: "6" , name : 'Соєвий соус' , quantity : 0 });



  return JSON.stringify(cutlery);
}

export interface OrderGoodssState extends EntityState<IOrderGoodsRecord> {

}

export interface EditOrderState {
  id?:string,
  addres:string,
  phone:string,
  creation:Date,
  filial:string,
  paytype:string,
  desk:string,
  comment:string,
  testMode:boolean,
  goods: OrderGoodssState,
  cutlery?:string
}

export const EditOrderGoodsAdapter = createEntityAdapter<IOrderGoodsRecord>();

export const EditOrderInitialState = {
  id:"",
  addres:"",
  phone:"",
  creation: new Date(),
  testMode:false,
  filial:"",
  paytype:"",
  desk:"",
  comment:"",
  cutlery:GetInitCutleryString(),
  goods: EditOrderGoodsAdapter.getInitialState()
}

function OnOrderSelected(state: EditOrderState,action) {
  const selectedOrder : IOrder = action.order;
  let newState : EditOrderState = {...state};
  newState.id = selectedOrder.id;
  newState.addres = selectedOrder.addres;
  newState.phone = selectedOrder.phone;
  newState.creation = selectedOrder.creation;
  newState.filial  = selectedOrder.filial;
  newState.paytype = selectedOrder.paytype;
  newState.cutlery = selectedOrder.cutlery
  newState.desk = selectedOrder.desk;
  newState.comment = selectedOrder.comment;
  newState.goods = EditOrderGoodsAdapter.getInitialState();
  newState.goods = EditOrderGoodsAdapter.addMany(selectedOrder.goods,newState.goods);
  newState.testMode = true

  return newState;

}

function UpsertOrderRecord(state: EditOrderState ,action) {
  let record : IOrderGoodsRecord = action.record;
  if ((state.goods.ids as string[]).indexOf(record.id)  == -1) {
    return {...state,goods: EditOrderGoodsAdapter.upsertOne(action.record,state.goods) }
  }
  else {
    const findedrecord   = state.goods.entities[record.id];
    if (findedrecord.quantity+record.quantity > 0) {
      record.quantity = findedrecord.quantity+record.quantity;
      return {...state,goods: EditOrderGoodsAdapter.upsertOne(record,state.goods) }
    }
    else {
      return {...state,goods: EditOrderGoodsAdapter.removeOne(action.record,state.goods) }
    }
  }
}

function OnOrderCreatedErr(state,action) {
  console.log("REDUCER OnOrderCreatedErr")
  return state;
}

export const EditOrderReducer = createReducer(
  EditOrderInitialState,
  on(EditOrderActions.OrderCreated, (state,action)=> EditOrderInitialState),
  on(EditOrderActions.UpdateOrderHeader, (state,action)=> {return {...state, ...action.header}}),
  on(EditOrderActions.UpdateOrderfilial, (state,action)=> {return {...state, filial: action.filial}}),
  on(EditOrderActions.UpdateOrderpaytype,(state,action)=> {return {...state, paytype: action.paytype}}),
  on(EditOrderActions.UpdateOrdercutlery,(state,action)=> {return {...state, cutlery: action.cutlery}}),
  on(EditOrderActions.UpsertOrderRecord, (state,action)=> UpsertOrderRecord(state,action)),
  on(EditOrderActions.UpsertOrderRecordForse, (state,action)=> {return {...state,goods: EditOrderGoodsAdapter.upsertOne(action.record,state.goods) } }),
  on(EditOrderActions.DeleteOrderRecord, (state,action)=> {return {...state,goods: EditOrderGoodsAdapter.removeOne(action.recordid,state.goods) } }),
  on(EditOrderActions.OrderCreatedErr, (state,action)=> OnOrderCreatedErr(state,action)),
  on(EditOrderActions.SelectOrder,(state,action)=> OnOrderSelected(state,action)),


);

export function editorderreducer(state: EditOrderState | undefined, action: Action) {
  return EditOrderReducer(state, action);
}

export const {selectAll, selectEntities} = EditOrderGoodsAdapter.getSelectors();

export const metaReducers: MetaReducer<EditOrderState>[] = !environment.production ? [] : [];
