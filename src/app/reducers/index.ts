
import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer,
  createReducer
} from '@ngrx/store';
import { environment } from '../../environments/environment';
import { routerReducer, RouterReducerState } from '@ngrx/router-store';
import * as fromOption from '../option.reducer';
import { reducer } from '../option.reducer';

export interface AppState {
  router:RouterReducerState,
  [fromOption.optionFeatureKey]: fromOption.OptionState;
}

export const reducers: ActionReducerMap<AppState> = {
  option: reducer,
  router: routerReducer

};


export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [] : [];
