import { IStreet } from './../models/street';
import { createAction,props } from '@ngrx/store';


 export const loadAllStreets = createAction("[STREETS RESOLVER] Load streets");
 export const allStreetsLoaded = createAction("[LOAD STREETS EFFECT] Streets loaded",props<{streets: IStreet[]}>());
 export const saveStreet = createAction("[ORDER HEADER ADRESS INPUT] Save street", props<{streetName: string}>());
 export const savedStreet = createAction("[SAVE STREET EFFECT]  street is saved", props<{streets: IStreet[]}>());
