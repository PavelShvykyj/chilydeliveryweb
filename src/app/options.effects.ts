
import { Update } from '@ngrx/entity';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatMap, map } from 'rxjs/operators';
import { LoadOptions,OptionsLoaded } from './option.reducer';
import { OnecGoodsDatasourseService } from './onec/onec.goods.datasourse.service';


@Injectable()
export class OptionsEffects {

    loadOptions$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LoadOptions),
            concatMap(action => {return this.OnecServise.LoadOptions();  }),
            map(option => OptionsLoaded({ options:option.options }))
        )
    );

    constructor(private actions$: Actions, private OnecServise: OnecGoodsDatasourseService) {
    }
}