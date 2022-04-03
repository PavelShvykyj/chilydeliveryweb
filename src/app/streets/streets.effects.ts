import { loadAllStreets, allStreetsLoaded, saveStreet, savedStreet } from './streets.actions';
import { createEffect, ofType, Actions } from '@ngrx/effects';
import { concatMap, map, tap } from 'rxjs/operators';
import { from, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { LocalDBService } from '../idb/local-db.service';
import { Store } from '@ngrx/store';
import { AppState } from '../reducers';
import { StreetsDataSourseService } from './streets-data-sourse.service';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class StreetEffects {

    loadOnecGoods$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loadAllStreets),
            concatMap(action => {
                return from(this.idb.GetAllStreetsByIndex())
            }),

            concatMap(data => {

                if(data.length==0 ) {
                    return this.WebServise.GetAllStreetss();
                } else {
                    return of(data);
                }
                  }),
            map(allstreets =>allStreetsLoaded({streets:allstreets}))
        )
    );

   AddSteet$ = createEffect(() =>
   this.actions$.pipe(
       ofType(saveStreet),
       concatMap(action => {
        console.log("Effect AddSteet")
        return this.WebServise.UpsertByName(action.streetName);
       }),
       tap(streets=> {
          this.snackBar.open("Сохранен",'',{duration:2000 })
      }),
       map(streets =>savedStreet({streets:streets})),

   )
);



    constructor(private actions$: Actions,
                private snackBar: MatSnackBar,
                private WebServise: StreetsDataSourseService,
                private idb: LocalDBService,
                private store : Store<AppState>) {
    }
}
