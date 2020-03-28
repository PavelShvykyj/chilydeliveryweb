import { Injectable } from '@angular/core';

import { IONECGood } from './../models/onec.good';
import { WebGoodsDatasourseService } from '../web/web.goods.datasourse.service';
import { LocalDBService } from '../idb/local-db.service';

import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AppState } from '../reducers';
import { Update } from '@ngrx/entity';

import { concatMap, map } from 'rxjs/operators';
import { of, from } from 'rxjs';
import { OrderActions } from './order.action.types';
import { allOrdersLoaded } from './order.actions';
import { OrdersDatasourseService } from './orders.datasourse.service';




@Injectable()
export class OrderEffects {

    loadOrders$ = createEffect(() => this.actions$.pipe(
        ofType(OrderActions.loadAllOrders),
        concatMap(action =>   this.OrdersServise.GetOrders()),
        map(orders => allOrdersLoaded({orders}))
    ) );
        


    constructor(private actions$: Actions, 
        private OrdersServise: OrdersDatasourseService,
        private idb: LocalDBService,
        private store : Store<AppState>) {
}

}