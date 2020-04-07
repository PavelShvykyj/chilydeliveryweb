import { IOrderGoodsRecordWithDirty, IOrderGoodsRecord } from './../../models/order';
import { TelegramService } from './../telegram.service';
import { tap, map, first, filter, concatMap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/reducers';
import { EditingOrder } from '../editorder.selectors';
import { CreateOrder } from '../editorder.actions';
import { IOrder } from 'src/app/models/order';
import { YndialogComponent } from 'src/app/baseelements/yndialog/yndialog.component';

@Component({
  selector: 'order-toolbar',
  templateUrl: './order-toolbar.component.html',
  styleUrls: ['./order-toolbar.component.scss']
})
export class OrderToolbarComponent implements OnInit {

  

  constructor(private snackBar: MatSnackBar, 
              private store: Store<AppState>,
              public dialog: MatDialog
    ) { }

  ngOnInit() {
  }

  OrderValid(EditingOrder ) {
    
   
    if (EditingOrder.addres.length>1 && EditingOrder.phone.length>1 && EditingOrder.goods.length>0)  {
      
      return true
    } else {
      this.snackBar.open("НЕКОРРЕКТНЫЙ ЗАКАЗ", "OK",{duration: 2000});
      return false;
    }

  }


  CreateOrder() {

    this.store.pipe(
      
      select(EditingOrder),
      first(),
      filter(EditingOrder=> this.OrderValid(EditingOrder)==true),
      
      
      map(order =>{
         
        this.store.dispatch(CreateOrder({order: {...order, goods: order.entities.map(el => {return {...el, dirtyid:el.good.filials }}),  id:"",externalid:"",isSelected:false}}))
      } ),
     
      ).subscribe(
        res=> {},
        err=>{
          this.snackBar.open("Что то  пошло не так","OK")
          
         }


      );
  }

  //this.snackBar.open("Login successful", "OK",{duration: 2000}); 
}
