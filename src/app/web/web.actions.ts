import { IONECGood } from './../models/onec.good';
import { IWEBGood, IWEBGoodWithFilials } from './../models/web.good';
import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

export const loadAllWebGoods = createAction("[EXCHANGE GOODS RESOLVER] Load web goods");
export const allWebGoodsLoaded = createAction("[LOAD WEB GOODS EFFECT] Web goods loaded",props<{goods: IWEBGood[], dirtygoods:IONECGood[]}>());
export const statusWebSelectedGanged = createAction("[WEB GOODS LIST COMPONENT]  Status selected changed",props<{update: Update<IWEBGood>}>());
export const statusDirtyWebSelectedGanged = createAction("[WEB DIRTY GOODS LIST COMPONENT]  Status selected changed",props<{update: Update<IONECGood>}>());
export const onecSelectedUploaded = createAction("[UPLOAD ONEC GOODS EFFECT]  selected onec goods uploaded",props<{newgood: IONECGood}>());
export const uploadOnecSelected = createAction("[ONEC GOODS LIST COMPONENT] Upload selected goods",props<{good: IONECGood}>());
export const updateWebgood  = createAction("[WEB GOOD EDIT COMPONENT] add or edit web good",props<{good: IWEBGood}>());
export const webgoodUpdated = createAction("[UPDATE WEB GOOD EFFECT web good added or updated]",props<{good:IWEBGood}>());
export const chainWebgood  = createAction("[WEB GOOD LIST COMPONENT] add or edit web good",props<{good: IWEBGood}>());
export const webgoodChained = createAction("[CHAIN WEB GOOD EFFECT web good added or updated]",props<{good:IWEBGood}>());