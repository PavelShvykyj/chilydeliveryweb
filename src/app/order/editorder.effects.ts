import { CreateOrder, OrderCreated, OrderCreatedErr } from './editorder.actions';
import { Injectable } from '@angular/core';

import { IONECGood } from '../models/onec.good';
import { WebGoodsDatasourseService } from '../web/web.goods.datasourse.service';
import { LocalDBService } from '../idb/local-db.service';

import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AppState } from '../reducers';
import { Update } from '@ngrx/entity';

import { concatMap, map, tap, catchError, first } from 'rxjs/operators';
import { of,  throwError, Observable } from 'rxjs';
import { OrdersDatasourseService } from '../orders/orders.datasourse.service';
import { TelegramService } from './telegram.service';
import { MatDialog, MatDialogConfig, MatDialogRef, MatSnackBar } from '@angular/material';
import { YndialogComponent } from '../baseelements/yndialog/yndialog.component';

@Injectable()
export class EditOrderEffects {

    CreateOrders$ = createEffect(() => this.actions$.pipe(
        ofType(CreateOrder),
        concatMap(action => this.OrdersServise.AddOrder(action.order).pipe(
            tap(neworder => {
                this.snackBar.open("ЗАКАЗ СОЗДАН", "OK",{duration: 2000,panelClass: ['snack-info'] } )
                this.telegram.SendMessage(neworder.filial, this.GetTformatedMessage(neworder))
            }),
            map(() => OrderCreated()),
            catchError(err => { this.OnOrderError(err); return of(OrderCreatedErr())}   )
        )),
    ));


    constructor(private actions$: Actions,
        private OrdersServise: OrdersDatasourseService,
        public dialog: MatDialog,
        private telegram: TelegramService,
        private snackBar: MatSnackBar,
        private store: Store<AppState>) {
    }

    GetTformatedMessage(order): string {
        const shortid : string = (order.externalid as string).split("-")[1];
        let message: string = `<b>ЗАКАЗ : ${shortid}</b> <i>Адрес: </i> ${order.addres} <i>Тел. : </i> ${order.phone} <b>Филиал : </b> ${order.filial} <i>Коммент : </i> ${order.comment}`;
        // <i>ТОВАРЫ : </i>
        // `;

        // order.entities.forEach(element => {
        //   message = message + `${element.good.name} :  ${element.quantity}
        //   `
        // });


        return message;
    };

    OnOrderError(err)  {

        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.minHeight = "25wh"
        dialogConfig.minWidth = "25wv"

        dialogConfig.data = { title: "Ошибки при создании заказа. Повторить попытку?", content: err.comment }

        const DialogRef: MatDialogRef<YndialogComponent> = this.dialog.open(
            YndialogComponent,
            dialogConfig);


        return DialogRef.afterClosed().pipe(first()).subscribe(
             res => {
                
                if (res.answer) {
                    console.log('err',err);
                    this.store.dispatch(CreateOrder({order:err}))
                }
             }
        )
    }

}