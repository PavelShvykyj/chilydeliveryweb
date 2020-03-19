import { IONECGood } from './../../models/onec.good';
import { IWEBGood } from './../../models/web.good';
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
import { environment } from '../../../environments/environment';
import { EntityState, createEntityAdapter, Dictionary } from '@ngrx/entity';
import { WebActions } from '../wtb.action.types';
import { allWebGoodsLoaded, webgoodDeleted } from '../web.actions';
import { state } from '@angular/animations';


export const webFeatureKey = 'web';

export interface DirtyWebGoods extends EntityState<IONECGood> {}
export interface WebGoods extends EntityState<IWEBGood> {}
export interface WebState  {
  allGoodsLoaded: boolean
  webGoods:WebGoods,
  dirtywebGoods:DirtyWebGoods,
}

export const WebAdapter = createEntityAdapter<IWEBGood>();
export const DirtyWebAdapter = createEntityAdapter<IONECGood>();

export const initialStateWeb = WebAdapter.getInitialState();
export const initialStateDirtyWeb = DirtyWebAdapter.getInitialState();

export const initialState = { 
  allGoodsLoaded: false,
  webGoods:initialStateWeb,
  dirtywebGoods:initialStateDirtyWeb
}

 function LoadAllGoods(state:WebState, action) : WebState {
  return  {
    ...state,
    webGoods: WebAdapter.addAll(action.goods,state.webGoods),
    dirtywebGoods: DirtyWebAdapter.addAll(action.dirtygoods,state.dirtywebGoods),
    allGoodsLoaded:true
  } ;

}

 function StatusWebSelectedGanged(state:WebState,action) : WebState {
  return {
    ...state,
    webGoods: WebAdapter.updateOne(action.update ,state.webGoods)
  }

}

function StatusDirtyWebSelectedGanged(state,action)  : WebState {
  return {
    ...state,
    dirtywebGoods: DirtyWebAdapter.updateOne(action.update ,state.dirtywebGoods)
  }

}


function OneCGoodUploded(state:WebState,action) : WebState {
  return {
    ...state,
    dirtywebGoods: DirtyWebAdapter.upsertOne(action.newgood ,state.dirtywebGoods)
  }

}

function WebGoodUploded(state,action)  : WebState {
  return {
    ...state,
    webGoods: WebAdapter.upsertOne(action.good ,state.webGoods)
  }
}

function DirtyWebGoodUploded(state,action)  : WebState {
  return {
    ...state,
    dirtywebGoods: DirtyWebAdapter.upsertOne(action.good ,state.dirtywebGoods)
  }
}

function WebgoodDeleted(state,action) : WebState {
  return {
    ...state,
    webGoods: WebAdapter.removeOne(action.id ,state.webGoods)
  }
}

export const WebReducer = createReducer(
  initialState,
  on(WebActions.allWebGoodsLoaded ,(state,action)=> LoadAllGoods(state,action)),
  on(WebActions.statusWebSelectedGanged,  (state,action)=> StatusWebSelectedGanged(state,action)),
  on(WebActions.statusDirtyWebSelectedGanged,  (state,action)=> StatusDirtyWebSelectedGanged(state,action)),
  on(WebActions.onecSelectedUploaded,  (state,action)=> OneCGoodUploded(state,action)),
  on(WebActions.webgoodUpdated,  (state,action)=> WebGoodUploded(state,action)),
  on(WebActions.updateWebgoodByExternalData,  (state,action)=> WebGoodUploded(state,action)),
  on(WebActions.updateDirtyWebgoodByExternalData ,  (state,action)=> DirtyWebGoodUploded(state,action)),
  on(WebActions.webgoodDeleted, (state,action)=> WebgoodDeleted(state,action) ),
  on(WebActions.webgoodChained,  (state,action)=> WebGoodUploded(state,action))
  )

export const {selectAll, selectEntities} = WebAdapter.getSelectors();
export const selectDirtyAll = DirtyWebAdapter.getSelectors().selectAll;
export const selectDirtyAllEntities = DirtyWebAdapter.getSelectors().selectEntities;;

export function reducer(state: WebState | undefined, action: Action) {
  return WebReducer(state, action);
}

export const metaReducers: MetaReducer<WebState>[] = !environment.production ? [] : [];
