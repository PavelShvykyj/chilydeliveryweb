import { IOrder, IOrderChanges, IOrderWithDirty } from './../models/order';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

import { Observable, BehaviorSubject, combineLatest, from, of, throwError } from 'rxjs';
import { map, filter, concatMap, first, tap, catchError, take } from 'rxjs/operators';


import { select, Store, props } from '@ngrx/store';
import { AppState } from '../reducers';
import { Update } from '@ngrx/entity';

import { environment } from 'src/environments/environment';

import * as firebase from 'firebase/app';
import 'firebase/database';
import { OrderActions } from './order.action.types';
import { Itparams } from '../models/telegram';




@Injectable({
  providedIn: 'root'
})
export class OrdersDatasourseService {

  constructor(private db: AngularFireDatabase,
    private store: Store<AppState>) { }

  get timestamp() {
    return firebase.database.ServerValue.TIMESTAMP;
  }


  async GetTelegramParams() {
    const snapparams = await this.db.database.ref('telegram').once('value');
    let tparams : Itparams = {};
    
    snapparams.forEach(snap => { tparams[snap.key]=snap.val()}  );
    return tparams

  }

  GetOrders(): Observable<IOrder[]> {
    return from(this.db.database.ref('orders').once('value'))
      .pipe(map(orderssnap => {
        const orders: IOrder[] = [];
        console.clear();
        console.log('GetOrders',orderssnap);
        orderssnap.forEach(childSnapshot => {
          console.log('Order',{ ...childSnapshot.val(), id: childSnapshot.key });
          orders.push({ ...childSnapshot.val(), id: childSnapshot.key })
        });
        return orders;
      }), take(1));
  }

  CreateOrder(neworder) {
    
    
    return from(this.db.database.ref('orders').push({...neworder, creation: this.timestamp}))
    .pipe(
      
      catchError(err => {
      neworder.comment = JSON.stringify(err);
      return throwError(neworder)}
      ),
    map(()=>neworder)
    );
  }






  /// наращиаем счетчик в тарнзакции на выходе имеем новый счетчик 
  /// инжектируем в данные заказа и пробуем создать его
  AddOrder(data : IOrderWithDirty) : Observable<any> {
    //return throwError(data);

    if (data.externalid.length != 0) {
      /// повторная попытка после неудачи данные уже заполнен
      return this.CreateOrder(data);
    } else {
      
      const neworder = {
        externalid:data.externalid,
        addres:data.addres,
        phone:data.phone,
        creation:"",
        filial:data.filial,
        desk:data.desk,
        comment:data.comment,  
        goods:data.goods.map(good=> {return {id:good.id,dirtyid:good.dirtyid , comment:good.comment,quantity: good.quantity }})
        };


      
      return from(this.db.database.ref('orderscounter').transaction(
        function(currentData) {
        
        
        /// currentData = "202042-1" => "202042-2" 
        /// счетчик обнуляется каждый день
        const spliter = "-";
        const today = new Date();
        const prefix : string =  today.getFullYear().toString()+
                                 (today.getMonth()+1).toString()+
                                 today.getDate().toString();
        
        


        if (currentData==null) {
          return prefix+spliter+"1";
        }
        
        
        
        const conter : string = currentData as string;
        const counterparts : string[] =  conter.split(spliter);
        
        



        let newcount : number = +counterparts[1]
        if (prefix == counterparts[0]) {
          newcount = newcount + 1;
          return prefix+spliter+newcount.toString();

        } else {
          return prefix+spliter+"1"
        }                                 


      }))
      .pipe(
        catchError(err => {
          neworder.comment = JSON.stringify(err);
          return throwError(neworder)}),
          
        concatMap(res => {
          neworder.externalid=res.snapshot.val();
          return this.CreateOrder(neworder);

      }))
      

    }
    
  }

  async RemoveOrder(id:string) : Promise<void> {
    return this.db.database.ref('orders/'+id).remove();
  }

  OnOrdersChanged(data: firebase.database.DataSnapshot) {
    this.store.dispatch(OrderActions.OrdersUpdated({ orders: [{ ...data.val(), id: data.key }] }));
  }

  OnOrdersRemoved(data: firebase.database.DataSnapshot) {
    this.store.dispatch(OrderActions.OrdersDeleted({ orders: [data.key] }))
  }

  OdrdersChangesStart() {
    this.db.database.ref('orders').on('child_removed', this.OnOrdersRemoved.bind(this));
    this.db.database.ref('orders').on('child_changed', this.OnOrdersChanged.bind(this));
    this.db.database.ref('orders').on('child_added', this.OnOrdersChanged.bind(this));
  }

  OdrdersChangesStop() {
    this.db.database.ref('orders').off('child_removed');
    this.db.database.ref('orders').off('child_changed');
    this.db.database.ref('orders').off('child_added');
  }


}
