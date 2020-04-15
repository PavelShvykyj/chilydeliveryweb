import { loadAllStreets, allStreetsLoaded } from './streets.actions';
import { createEffect, ofType, Actions } from '@ngrx/effects';
import { concatMap, map } from 'rxjs/operators';
import { from, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { LocalDBService } from '../idb/local-db.service';
import { Store } from '@ngrx/store';
import { AppState } from '../reducers';
import { StreetsDataSourseService } from './streets-data-sourse.service';

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



   

    constructor(private actions$: Actions, 
                private WebServise: StreetsDataSourseService,
                private idb: LocalDBService,
                private store : Store<AppState>) {
    }
}