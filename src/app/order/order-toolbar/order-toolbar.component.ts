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
    private store: Store<AppState>
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
      
      /// тут фильтр на проверку запонения
      map(order => this.store.dispatch(CreateOrder({order: {...order,id:"",externalid:"",isSelected:false}}))),
     
      ).subscribe(
        res=>{this.snackBar.open("ЗАКАЗ СОЗДАН", "OK",{duration: 2000}); },
        err=>{this.snackBar.open("ЧТО ТО ПОШЛО НЕ ТАК", "OK",{duration: 2000}); }


      );
  }

  //this.snackBar.open("Login successful", "OK",{duration: 2000}); 
}
