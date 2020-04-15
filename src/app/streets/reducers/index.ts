import { state } from '@angular/animations';
import { allStreetsLoaded } from './../streets.actions';

import { environment } from './../../../environments/environment';
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
import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { IStreet } from 'src/app/models/street';


export const streetsFeatureKey = 'streets';

export interface StreetsState extends EntityState<IStreet> {
  AllStreetsLoaded:boolean
}

export const StreetAdapter = createEntityAdapter<IStreet>();
export const initialState = StreetAdapter.getInitialState({AllStreetsLoaded:false});

function LoadAllStreets(state:StreetsState,action):StreetsState  {
   return StreetAdapter.addAll(action.streets,{...state,AllStreetsLoaded:true})
}

export const StreetReducer = createReducer(
  initialState,
  on(allStreetsLoaded,(state,action)=> LoadAllStreets(state,action)),
  );


  export function streetreducer(state: StreetsState | undefined, action: Action) {
    return StreetReducer(state, action);
  }
  
  export const {selectAll, selectEntities} = StreetAdapter.getSelectors();


export const metaReducers: MetaReducer<StreetsState>[] = !environment.production ? [] : [];
