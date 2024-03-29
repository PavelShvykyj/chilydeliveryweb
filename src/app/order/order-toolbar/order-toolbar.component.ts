import { IOrderGoodsRecordWithDirty, IOrderGoodsRecord, IOrderCutlery } from './../../models/order';
import { TelegramService } from './../telegram.service';
import { tap, map, first, filter, concatMap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/reducers';
import { EditingOrder } from '../editorder.selectors';
import { CreateOrder } from '../editorder.actions';
import { IOrder } from 'src/app/models/order';
import { DialogstringinputComponent } from 'src/app/baseelements/dialogstringinput/dialogstringinput.component';
import { ChoiceService } from 'src/app/web/choiceservise.service';

@Component({
  selector: 'order-toolbar',
  templateUrl: './order-toolbar.component.html',
  styleUrls: ['./order-toolbar.component.scss']
})
export class OrderToolbarComponent implements OnInit {



  constructor(private snackBar: MatSnackBar,
              private store: Store<AppState>,
              public dialog: MatDialog,
              private chServise: ChoiceService
    ) { }

  ngOnInit() {
  }

  GetCutleryTotal(cutleryStr : string) : number {
    if (cutleryStr == undefined) {
      return 0
    }

    if (cutleryStr.length == 0) {
      return 0
    }

    let cutlery : IOrderCutlery[] = JSON.parse(cutleryStr);
    let total = 0;
    cutlery.forEach(element => {
      total = total + element.quantity;
    });

    return total;
  }

  OrderValid(EditingOrder ) {

    console.log("On OrderValid ",EditingOrder);


    if (EditingOrder.addres.length>1
       && EditingOrder.phone.length==10
       && EditingOrder.goods.length>0
       && EditingOrder.filial.length>0
       && this.GetCutleryTotal(EditingOrder.cutlery)>0


       )  {

      return true
    } else {
      this.snackBar.open("НЕКОРРЕКТНЫЙ ЗАКАЗ", "OK",{duration: 2000, panelClass: ['snack-err']});
      return false;
    }

  }


  CreateOrder() {

    this.store.pipe(

      select(EditingOrder),
      first(),
      filter(EditingOrder=> this.OrderValid(EditingOrder)==true),


      map(order =>{

        this.store.dispatch(CreateOrder({order: {...order, paytype : order.paytype , cutlery: order.cutlery, testMode:order.testMode , goods: order.entities.map(el => {return {...el, dirtyid:el.good.filials }}), id:order.id ,externalid:"",isSelected:false}}))
      } ),

      ).subscribe(
        res=> {},
        // err=>{

        //   this.snackBar.open("Что то  пошло не так","OK",{duration: 2000, panelClass: ['snack-err']})

        //  }


      );
  }

  AskForChoiseID() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.minHeight = "25wh"
    dialogConfig.minWidth = "25wv"

    dialogConfig.data = { title: "Введити номер заказа Choice", answer: "" }

    const DialogRef: MatDialogRef<DialogstringinputComponent> = this.dialog.open(
      DialogstringinputComponent,
      dialogConfig);
    DialogRef.afterClosed().pipe(first()).subscribe(res => {
      if(res.answer.lenth != 0 ) {
         this.FillSelectedOrderByChoiceID(res.answer);
      }
    });
  }

  FillSelectedOrderByChoiceID(id:string) {
    this.chServise.GetOrderByID(id).pipe(first()).subscribe(orderData=>{

    }) ;
  }

  //this.snackBar.open("Login successful", "OK",{duration: 2000});
}
