
import { Update } from '@ngrx/entity';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatMap, map } from 'rxjs/operators';
import { LoadOptions,OptionsLoaded } from './option.reducer';



@Injectable()
export class OptionsEffects {

    loadOptions$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LoadOptions),
            
            map(action  => OptionsLoaded({ options:{filialname:""}} ))
        )
    );

    constructor(private actions$: Actions) {
    }
}