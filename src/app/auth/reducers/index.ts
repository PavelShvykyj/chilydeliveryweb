import { state } from '@angular/animations';
import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer,
  Action,
  on,
  createReducer,
  createAction,
  props
} from '@ngrx/store';
import { environment } from '../../../environments/environment';

export const authFeatureKey = 'auth';

export interface AuthState {
  isLoggedin: boolean,
  id:string,
  email:string,
  avatar:string
}

export const initialAuthState : AuthState = {
  isLoggedin:false,
  id:"",
  email:"",
  avatar:""
}

export const AuthStausChanged = createAction("[AUTH SERVISE change user satus]",props<{user: firebase.User|undefined}>())

function ChangeUserStatus(state,action) {
  if(action.user == undefined) {
    return { isLoggedin:false,
      id:"",
      email:"",
      avatar:""}
  } 
  return {
    isLoggedin:true,
    id:action.user.uid,
    email:action.user.email,
    avatar:action.user.photoURL
   }
}



export const AuthReducer = createReducer(initialAuthState,
  on(AuthStausChanged, (state,action) => ChangeUserStatus(state,action) ));
  

export function reducer(state: AuthState | undefined, action: Action) {
  return AuthReducer(state, action);
}


export const metaReducers: MetaReducer<AuthState>[] = !environment.production ? [] : [];
