
import { createEffect, ofType, Actions } from '@ngrx/effects';
import { catchError, concatMap, map, tap } from 'rxjs/operators';
import { from, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { MobileService } from './mobile.service';
import { mobileNotUpdated, mobileUpdated, UpdateMobileData } from './mobile.actions';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class MobileEffects {

    loadOnecGoods$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UpdateMobileData),
            concatMap(action => {
                return from(this.MobileServise.UpdateMobileData()).pipe(
                    tap(() => {this.snackBar.open("Данные обновлены", "OK",{duration: 1000})}),
                    map(() =>mobileUpdated()),
                    catchError(err => { console.log('mobile update ', err);
                                        this.snackBar.open("Данные не обновлены", "OK",{duration: 1000});
                                        return of(mobileNotUpdated())})
                )
            }),
           
        )
    );





    constructor(private actions$: Actions, 
                private MobileServise: MobileService,
                private snackBar: MatSnackBar
                ) {
    }
}