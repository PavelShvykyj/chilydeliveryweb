import { state } from '@angular/animations';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { StreetsState } from './reducers';
import * as fromStreets from './reducers/index';

export const selectStreetsState = createFeatureSelector<StreetsState>(fromStreets.streetsFeatureKey);

export const selectAllStreets = createSelector(
    selectStreetsState,
    fromStreets.selectAll 
)

export const areAllStreetsLoaded = createSelector(
    selectStreetsState,
    state => state.AllStreetsLoaded);

export const selectByName = createSelector(
    selectAllStreets,
    (state,props) => state.filter(el => el.name.toUpperCase().search(props.filter)!=-1) 
);
    
