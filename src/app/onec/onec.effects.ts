import { IONECGood } from './../models/onec.good';
import { Update } from '@ngrx/entity';
import { Injectable } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { OnecActions } from './onec.actions.types';
import { OnecGoodsDatasourseService } from './onec.goods.datasourse.service';
import { concatMap, map } from 'rxjs/operators';
import { allGoodsLoaded, updateAfterUpload } from './onec.actions';
import { WebActions } from '../web/wtb.action.types';


@Injectable()
export class OnecEffects {

    loadOnecGoods$ = createEffect(() =>
        this.actions$.pipe(
            ofType(OnecActions.loadAllGoods),
            concatMap(action => { this.OnecServise.GetList(undefined); return this.OnecServise.dataSourse$ }),
            map(goods => allGoodsLoaded({ goods }))
        )
    );

    updateAfterUpload$ = createEffect(() =>
    this.actions$.pipe(
        ofType(WebActions.onecSelectedUploaded),
        concatMap(action => {  return this.OnecServise.UpdateExternalId(action.newgood.externalid,action.newgood.id) }),
        map(good => {const UploadUpdate : Update<IONECGood> = {id:good.id, changes:{externalid:good.externalid, isSelected:false}  }; return updateAfterUpload({UploadUpdate})})
    )
);

    constructor(private actions$: Actions, private OnecServise: OnecGoodsDatasourseService) {
    }
}