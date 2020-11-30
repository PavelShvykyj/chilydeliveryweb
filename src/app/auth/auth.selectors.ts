import { state } from '@angular/animations';
import { IONECGood } from './../models/onec.good';
import * as fromAuth from './reducers/index';
import { AuthState, authFeatureKey } from './reducers/index';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export const selectAuthState = createFeatureSelector<AuthState>(authFeatureKey);

export const selectIsLoggedIn = createSelector(
    selectAuthState,
    state => state.isLoggedin
);

export const selectLoggedEmail = createSelector(
    selectAuthState,
    state => state.email
);


export const selectUserData = createSelector(
    selectAuthState,
    state => state
);
