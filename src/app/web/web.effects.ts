import { IONECGood } from './../models/onec.good';
import { Store } from '@ngrx/store';
import { WebGoodsDatasourseService } from './web.goods.datasourse.service';

import { allWebGoodsLoaded, onecSelectedUploaded, webgoodUpdated } from './web.actions';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { WebActions } from './wtb.action.types';
import { concatMap, map } from 'rxjs/operators';
import { AppState } from '../reducers';

import { Update } from '@ngrx/entity';

@Injectable()
export class WebEffects {

    loadOnecGoods$ = createEffect(() =>
        this.actions$.pipe(
            ofType(WebActions.loadAllWebGoods),
            concatMap(action => { return this.WebServise.GetAllGoods();  }),
            map(allgoods => allWebGoodsLoaded({ ...allgoods }))
        )
    );

    uploadOnecGoods$ = createEffect(() => this.actions$.pipe(
        ofType(WebActions.uploadOnecSelected),
        concatMap(action => this.WebServise.UpdateByONEC(action.good)),
        map(newgood => onecSelectedUploaded({newgood})))
    );

    upsertWebGood$ = createEffect(() => this.actions$.pipe(
        ofType(WebActions.updateWebgood),
        concatMap(action => this.WebServise.UpsertWebGood(action.good)),
        map(good => webgoodUpdated({good})))
    );
    

    constructor(private actions$: Actions, private WebServise: WebGoodsDatasourseService, private store : Store<AppState>) {
    }
}