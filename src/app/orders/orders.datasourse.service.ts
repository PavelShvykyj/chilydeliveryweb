import { IOrder, IOrderChanges } from './../models/order';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { Observable, BehaviorSubject, combineLatest, from, of } from 'rxjs';
import { map, filter, concatMap, first, tap, catchError } from 'rxjs/operators';

import { select, Store } from '@ngrx/store';
import { AppState } from '../reducers';
import { Update } from '@ngrx/entity';

import { environment } from 'src/environments/environment';

import * as firebase from 'firebase/app';
import 'firebase/firestore';


@Injectable({
  providedIn: 'root'
})
export class OrdersDatasourseService {

  constructor(private db: AngularFirestore,
    private store: Store<AppState>) { }

    get timestamp() {
      return firebase.firestore.FieldValue.serverTimestamp();
    }

  GetOrdersChanges() :Observable<IOrderChanges[]> {
    return this.db.collection('orders',ref=>ref.orderBy('creation'))
    .stateChanges()
    .pipe(map(res => {
      return res.map(element => {
        const eldata = element.payload.doc.data() as any;
        const order: IOrder = {
          ...eldata,
          creation:eldata.creation.toDate(),
          isSelected:false,
          id: element.payload.doc.id
        };
        return {
          order,
          type: element.type
        }

      }) as IOrderChanges[];
    }))
  }  
}
