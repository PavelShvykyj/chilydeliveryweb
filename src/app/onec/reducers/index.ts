import { allGoodsLoaded } from './../onec.actions';

import {
  ActionReducer,
 
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer,
  createReducer,
  createAction,
  on,
  Action,
  State
} from '@ngrx/store';

import { createEntityAdapter, EntityState } from '@ngrx/entity';

import { environment } from '../../../environments/environment';
import { IONECGood } from 'src/app/models/onec.good';
import { OnecActions } from '../onec.actions.types';


export const FeatureKey = 'onec';

export interface OnecState extends EntityState<IONECGood>  {
  allGoodsLoaded : boolean
}

export const OnecAdapter = createEntityAdapter<IONECGood>();

export const initialState = OnecAdapter.getInitialState({allGoodsLoaded:false});

export const OnecReducer  = createReducer(
  initialState,
  on(OnecActions.allGoodsLoaded ,(state,action)=>OnecAdapter.addAll(action.goods,{...state, allGoodsLoaded: true})),
  on(OnecActions.statusSelectedGanged,  (state,action)=>OnecAdapter.updateOne(action.update ,state)),
  on(OnecActions.updateAfterUpload,  (state,action)=>OnecAdapter.updateOne(action.UploadUpdate ,state))
); 

export const { selectAll } = OnecAdapter.getSelectors();

export function reducer(state: OnecState | undefined, action: Action) {
  return OnecReducer(state, action);
}



