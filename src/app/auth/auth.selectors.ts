import { state } from '@angular/animations';
import { IONECGood } from './../models/onec.good';
import * as fromAuth from './reducers/index';
import { AuthState, authFeatureKey } from './reducers/index';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export const selectOnecState = createFeatureSelector<AuthState>(authFeatureKey);

export const selectIsLoggedIn = createSelector(
    selectOnecState,
    state => state.isLoggedin
);

export const selectUserData = createSelector(
    selectOnecState,
    state => state
);
