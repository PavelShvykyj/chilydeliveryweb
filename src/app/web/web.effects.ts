import { IONECGood } from './../models/onec.good';
import { Store } from '@ngrx/store';
import { WebGoodsDatasourseService } from './web.goods.datasourse.service';

import { allWebGoodsLoaded, onecSelectedUploaded, webgoodUpdated, webgoodChained, webgoodDeleted, allChoiceGoodsLoaded } from './web.actions';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { WebActions } from './wtb.action.types';
import { concatMap, map, tap } from 'rxjs/operators';
import { AppState } from '../reducers';

import { Update } from '@ngrx/entity';
import { LocalDBService } from '../idb/local-db.service';
import { of, from } from 'rxjs';
import { ChoiceService } from './choiceservise.service';

@Injectable()
export class WebEffects {

    loadOnecGoods$ = createEffect(() =>
        this.actions$.pipe(
            ofType(WebActions.loadAllWebGoods),
            concatMap(action => {
                return from(this.idb.GetAllGoodsByIndex())
            }),

            concatMap(data => {

                if(data.goods.length==0 && data.dirtygoods.length==0) {
                    return this.WebServise.GetAllGoods();
                } else {
                    console.log('idb');
                    return of(data);
                }
                  }),
            tap(allgoods=> this.chservise.OdrdersChangesStart()),
            map(allgoods =>allWebGoodsLoaded({ ...allgoods })),

        )
    );


    loadChoiceGoods$ = createEffect(() =>
    this.actions$.pipe(
        ofType(WebActions.loadAllChoiceGoods),

        concatMap(() => {
                return this.ChoiceServise.GetAllGoods();
              }),
        map(allgoods =>allChoiceGoodsLoaded({dirtygoods: allgoods }))
    )
);


    upsertWebGood$ = createEffect(() => this.actions$.pipe(
        ofType(WebActions.updateWebgood),
        concatMap(action => this.WebServise.UpsertWebGood(action.good)),
        map(good => webgoodUpdated({good})))
    );

    chainWebGood$ = createEffect(() => this.actions$.pipe(
        ofType(WebActions.chainWebgood),
        concatMap(action => this.WebServise.UpsertWebGood(action.good)),
        map(good => webgoodChained({good})))
    );

    deleteWebGood$ = createEffect(() =>  this.actions$.pipe(
        ofType(WebActions.deleteWebgood),
        concatMap(action => this.WebServise.DeleteWebGood(action.id)),
        map(id => webgoodDeleted({id})))
    );

    constructor(private actions$: Actions,
                private WebServise: WebGoodsDatasourseService,
                private ChoiceServise: ChoiceService,
                private idb: LocalDBService,
                private store : Store<AppState>,
                private chservise: ChoiceService
                ) {
    }
}
