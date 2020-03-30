import { TelegramService } from './../telegram.service';
import { tap, map, first, filter, concatMap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/reducers';
import { EditingOrder } from '../editorder.selectors';
import { CreateOrder } from '../editorder.actions';
import { IOrder } from 'src/app/models/order';

@Component({
  selector: 'order-toolbar',
  templateUrl: './order-toolbar.component.html',
  styleUrls: ['./order-toolbar.component.scss']
})
export class OrderToolbarComponent implements OnInit {

  

  constructor(private snackBar: MatSnackBar, 
              private store: Store<AppState>,
              private telegram:TelegramService
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

  GetTformatedMessage(order) : string {
    let message : string =  `<b>НОВЫЙ ЗАКАЗ :</b>
    <i>Адрес: </i> ${order.addres} ,
    <i>Тел. : </i> ${order.phone} ,
    <i>Комент : </i> ${order.comment} ,
    <i>ТОВАРЫ : </i>
    `;

    order.entities.forEach(element => {
      message = message + `${element.good.name} :  ${element.quantity}
      `
    });
    console.log(message);

    return message;
    };






  CreateOrder() {
    let tfilifal : string;
    let tmessage : string;

    this.store.pipe(
      
      select(EditingOrder),
      first(),
      filter(EditingOrder=> this.OrderValid(EditingOrder)==true),
      
      
      map(order =>{
        tfilifal = order.filial;
        tmessage = this.GetTformatedMessage(order);  
        this.store.dispatch(CreateOrder({order: {...order,id:"",externalid:"",isSelected:false}}))
      } ),
     
      ).subscribe(
        res=>{this.telegram.SendMessage(tfilifal,tmessage);
              this.snackBar.open("ЗАКАЗ СОЗДАН", "OK",{duration: 2000}); },
        err=>{this.snackBar.open("ЧТО ТО ПОШЛО НЕ ТАК", "OK",{duration: 2000}); }


      );
  }

  //this.snackBar.open("Login successful", "OK",{duration: 2000}); 
}
