import { IONECGood } from './../models/onec.good';
import { Store } from '@ngrx/store';
import { WebGoodsDatasourseService } from './web.goods.datasourse.service';

import { allWebGoodsLoaded, onecSelectedUploaded } from './web.actions';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { WebActions } from './wtb.action.types';
import { concatMap, map } from 'rxjs/operators';
import { AppState } from '../reducers';
import { selectGoodBySelection } from '../onec/onec.selectors';
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


    constructor(private actions$: Actions, private WebServise: WebGoodsDatasourseService, private store : Store<AppState>) {
    }
}