import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of, combineLatest } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { tap, first, finalize, filter } from 'rxjs/operators';
import { AppState } from 'src/app/reducers';
import { areAllWebGoodsLoaded } from 'src/app/web/web.selectors';
import { loadAllWebGoods } from 'src/app/web/web.actions';
import { LocalDBService } from 'src/app/idb/local-db.service';
import { areAllStreetsLoaded } from './streets.selectors';
import { loadAllStreets } from './streets.actions';

@Injectable()
export class StreetsResolver implements Resolve<any> {

    loading = false;
    webloading = false;
    constructor(private store: Store<AppState>) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {



        let WebChain$ = this.store.pipe(
            select(areAllStreetsLoaded), 
            tap(StreetssLoaded => {
                
                if (!this.webloading && !StreetssLoaded) {
                    this.webloading = true;
                    this.store.dispatch(loadAllStreets());
                }
            }),
            filter(StreetssLoaded => StreetssLoaded),
            first(),
            finalize(() => this.webloading = false)
        );
        
        return combineLatest(WebChain$)          


    }



}