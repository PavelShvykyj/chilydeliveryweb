import { state } from '@angular/animations';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { MobileState } from './reducers';
import * as fromMObiles from './reducers/index';

export const selectMobileState = createFeatureSelector<MobileState>(fromMObiles.mobileFeatureKey);

export const selectMObileDataUpdated = createSelector(
    selectMobileState,
    st => {return st.MobileDataUpdated} 
)