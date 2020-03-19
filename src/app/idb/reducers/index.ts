import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer,
  createReducer,
  Action
} from '@ngrx/store';
import { environment } from '../../../environments/environment';

export const idbFeatureKey = 'idb';

export interface idbState {

}

export const initialState = { 

}

export const idbReducer = createReducer(
  initialState
  )

  export function reducer(state: idbState | undefined, action: Action) {
    return idbReducer(state, action);
  }

export const metaReducers: MetaReducer<idbState>[] = !environment.production ? [] : [];
