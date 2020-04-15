import { IStreet } from './../models/street';
import { createAction,props } from '@ngrx/store';

 
 export const loadAllStreets = createAction("[STREETS RESOLVER] Load streets");
 export const allStreetsLoaded = createAction("[LOAD STREETS EFFECT] Streets loaded",props<{streets: IStreet[]}>());
 
 
 