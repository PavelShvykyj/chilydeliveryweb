import { IONECGood } from './../models/onec.good';
import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

export const loadAllGoods = createAction("[EXCHANGE GOODS RESOLVER] Load onec goods");
export const allGoodsLoaded = createAction("[LOAD ONEC GOODS EFFECT] Onec goods loaded",props<{goods: IONECGood[]}>());
export const statusSelectedGanged = createAction("[ONEC GOODS LIST COMPONENT]  Status selected changed",props<{update: Update<IONECGood>}>());
export const updateAfterUpload = createAction("[LOAD ONEC GOODS EFFECT] Onec good updated after upload",props<{UploadUpdate: Update<IONECGood>}>());