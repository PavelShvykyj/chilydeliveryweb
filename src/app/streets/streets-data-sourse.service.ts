import { IStreet } from './../models/street';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/database';
import { AngularFireDatabase } from '@angular/fire/database';
import { Store } from '@ngrx/store';
import { AppState } from '../reducers';
import { Observable, from, of } from 'rxjs';
import { map, take, tap, concatMap, filter } from 'rxjs/operators';
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

   UpsertByName(name:string) : Observable<IStreet[]>  {
    /// проверили есть ли в облаке такая урица
    return from(this.db.database.ref('streets').orderByChild('name').equalTo(name).limitToFirst(1).once('value'))
    .pipe(
      map(streetssnap => {
        console.log('fdb streets snap by name ', streetssnap);
        const streets: IStreet[] = [];
        streetssnap.forEach(childSnapshot => {
        streets.push({ ...childSnapshot.val(), id: childSnapshot.key })
      });
      return streets
      }),
      //// если в облаке такая есть просто добавим в кешь
      tap(streets => {
        console.log('fdb streets lenf ', streets.length);
        if(streets.length != 0) {
          let street =  streets[0];
          this.idb.AddElement(street,'Streets');
        }
      }),

      ////  дальше идем только  если в облаке такой нет
      filter(streets => streets.length == 0),
      ////  получаем новый индеск по порядку
      concatMap(streets => {

        return  from(this.db.database.ref('streets')
            .orderByKey()
            .limitToLast(1)
            .once('value')
            ).pipe(map(idSnap=> {
              // console.log('id snap val',idSnap.val(), idSnap, idSnap[0]);
              let newId = "";
              idSnap.forEach(el => {newId = (parseInt(el.key)+1).toString()});

              console.log("new id", newId);
              streets.push({id:newId, name:name})
              console.log('fdb new id ', streets);
              return streets
            }))
        }
      ),
      // добавляем в облако
      tap(streets => {
         let street =  streets[0];
         console.log('fdb update ', street);
         this.db.database.ref('streets/'+street.id+'/name').set(street.name);
      }),
      // добавляем в кешь
      tap(streets => {
        let street =  streets[0];
        console.log('idb update ', street);
        this.idb.AddElement(street,'Streets');
      })
   )}

}
