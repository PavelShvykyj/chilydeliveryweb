import { Injectable } from '@angular/core';

import { IONECGood } from '../models/onec.good';
import { WebGoodsDatasourseService } from '../web/web.goods.datasourse.service';
import { LocalDBService } from '../idb/local-db.service';

import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AppState } from '../reducers';
import { Update } from '@ngrx/entity';

import { concatMap, map } from 'rxjs/operators';
import { of, from } from 'rxjs';

@Injectable()
export class EditOrderEffects {

    constructor(private actions$: Actions, 
        private WebServise: WebGoodsDatasourseService,
        private idb: LocalDBService,
        private store : Store<AppState>) {
}

}