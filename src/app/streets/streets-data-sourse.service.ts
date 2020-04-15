import { IStreet } from './../models/street';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/database';
import { AngularFireDatabase } from '@angular/fire/database';
import { Store } from '@ngrx/store';
import { AppState } from '../reducers';
import { Observable, from } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { LocalDBService } from '../idb/local-db.service';

@Injectable({
  providedIn: 'root'
})
export class StreetsDataSourseService {

  constructor(private db: AngularFireDatabase,
    private store: Store<AppState>,
    private idb : LocalDBService) { }

    GetAllStreetss(): Observable<IStreet[]> {
      
      console.log('streets from server');
      return from(this.db.database.ref('streets').once('value'))
        .pipe(map(streetssnap => {
          const streets: IStreet[] = [];
  
          streetssnap.forEach(childSnapshot => {
            streets.push({ ...childSnapshot.val(), id: childSnapshot.key })
          });
          return streets;
        }), 
        tap(streets => { this.idb.UpdateAllStreets(streets); return streets }),
        take(1));
    }

   
}
