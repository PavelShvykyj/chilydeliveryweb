import { IOrder, IOrderChanges } from './../models/order';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

import { Observable, BehaviorSubject, combineLatest, from, of } from 'rxjs';
import { map, filter, concatMap, first, tap, catchError, take } from 'rxjs/operators';

import { select, Store, props } from '@ngrx/store';
import { AppState } from '../reducers';
import { Update } from '@ngrx/entity';

import { environment } from 'src/environments/environment';

import * as firebase from 'firebase/app';
import 'firebase/database';
import { OrderActions } from './order.action.types';




@Injectable({
  providedIn: 'root'
})
export class OrdersDatasourseService {

  constructor(private db: AngularFireDatabase,
    private store: Store<AppState>) { }

  get timestamp() {
    return firebase.database.ServerValue.TIMESTAMP;
  }




  GetOrders(): Observable<IOrder[]> {
    return from(this.db.database.ref('orders').once('value'))
      .pipe(map(orderssnap => {
        const orders: IOrder[] = [];

        orderssnap.forEach(childSnapshot => {
          orders.push({ ...childSnapshot.val(), id: childSnapshot.key })
        });
        return orders;
      }), take(1));
  }

  AddOrder(data : IOrder) : Observable<firebase.database.Reference> {
    const neworser = {
      externalid:"",
      addres:data.addres,
      phone:data.phone,
      creation:"",
      filial:data.filial,
      desk:data.desk,
      comment:data.comment,  
      goods:data.goods.map(good=> {return {id:good.id, comment:good.comment,quantity: good.quantity }})
      };

    const res = from(this.db.database.ref('orders').push({...neworser, creation: this.timestamp}));
    return res;
    //return from( this.db.list('orders').push({...data, creation: this.timestamp}))
    
  }

  async RemoveOrder(id:string) : Promise<void> {
    return this.db.database.ref('orders/'+id).remove();
  }

  

  OnOrdersChanged(data: firebase.database.DataSnapshot) {
    console.log('OnOrdersChanged', data.val());
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
