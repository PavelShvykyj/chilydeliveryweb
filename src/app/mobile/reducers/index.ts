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
import { mobileNotUpdated, mobileUpdated, webDataCanges } from '../mobile.actions';
import { environment } from './../../../environments/environment';

export const mobileFeatureKey = 'mobile';

export interface MobileState {
  MobileDataUpdated: boolean
}

export const initialState = {MobileDataUpdated: true}

export const MobileReducer = createReducer(
  initialState,
  on(webDataCanges,(state,action)=> {return {...state, MobileDataUpdated: false}}),
  on(mobileUpdated,(state,action)=> {return {...state, MobileDataUpdated: true}}),
  on(mobileNotUpdated,(state,action)=> {return {...state, MobileDataUpdated: false}})
  );

export function mobilereducer(state: MobileState | undefined, action: Action) {
  return MobileReducer(state, action);
}

export const metaReducers: MetaReducer<MobileState>[] = !environment.production ? [] : [];
