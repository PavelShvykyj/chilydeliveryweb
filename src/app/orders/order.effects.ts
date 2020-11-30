import { Injectable } from '@angular/core';

import { IONECGood } from './../models/onec.good';
import { WebGoodsDatasourseService } from '../web/web.goods.datasourse.service';
import { LocalDBService } from '../idb/local-db.service';

import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AppState } from '../reducers';
import { Update } from '@ngrx/entity';

import { catchError, concatMap, map, tap } from 'rxjs/operators';
import { of, from } from 'rxjs';
import { OrderActions } from './order.action.types';
import { allOrdersLoaded, OrderBlockErr, ReleaseOrder } from './order.actions';
import { OrdersDatasourseService } from './orders.datasourse.service';
import { SelectOrder } from '../order/editorder.actions';
import { MatSnackBar } from '@angular/material';




@Injectable()
export class OrderEffects {

    loadOrders$ = createEffect(() => this.actions$.pipe(
        ofType(OrderActions.loadAllOrders, OrderActions.loadAllOrdersOnAppInit),
        concatMap(action => this.OrdersServise.GetOrders()),

        map(orders => allOrdersLoaded({ orders }))
    ));

    BlockOrder$ = createEffect(() => this.actions$.pipe(
        ofType(OrderActions.BlockOrder),
        concatMap(action => this.OrdersServise.BlockOrder(action.order.id).pipe(map(email => { return { ...action.order, externalid: email } }))),
        map(order => SelectOrder({ order }),
        catchError(err => { this.OnOrderBlockError(err); return of(OrderBlockErr())}
        )
    )));

    ReleaseOrder$ = createEffect(() => this.actions$.pipe(
        ofType(OrderActions.ReleaseOrder),
        concatMap(action => this.OrdersServise.ReleaseOrder(action.id)),
        catchError(err => { this.OnOrderBlockError(err); return of(OrderBlockErr())}),

    ), { dispatch: false });

    constructor(private actions$: Actions,
        private OrdersServise: OrdersDatasourseService,
        private snackBar: MatSnackBar,
        private idb: LocalDBService,
        private store: Store<AppState>) {
    }

    OnOrderBlockError(err) {
        console.log('block order error',err);
        this.snackBar.open("ЗАКАЗ НЕ ВЫБРАН", "ОШИБКА БЛОКИРОВКИ",{duration: 2000,panelClass: ['snack-err']});
    }
}