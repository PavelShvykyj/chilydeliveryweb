import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of, combineLatest } from 'rxjs';
import { Store, select } from '@ngrx/store';

import { tap, first, finalize, filter } from 'rxjs/operators';
import { loadAllGoods } from 'src/app/onec/onec.actions';
import { AppState } from 'src/app/reducers';
import { areAllGoodsLoaded } from 'src/app/onec/onec.selectors';
import { areAllWebGoodsLoaded } from 'src/app/web/web.selectors';
import { loadAllWebGoods } from 'src/app/web/web.actions';

@Injectable()
export class GoodsResolver implements Resolve<any> {

    loading = false;
    webloading = false;
    constructor(private store: Store<AppState>) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {

        
        let OneCChain$ = this.store.pipe(
            select(areAllGoodsLoaded),
            tap(GoodsLoaded => {
                
                if (!this.loading && !GoodsLoaded) {
                    this.loading = true;
                    this.store.dispatch(loadAllGoods());
                }
            }),
            filter(GoodsLoaded => GoodsLoaded),
            first(),
            finalize(() => this.loading = false)
        );

        let WebChain$ = this.store.pipe(
            select(areAllWebGoodsLoaded), 
            tap(WebGoodsLoaded => {
                
                if (!this.webloading && !WebGoodsLoaded) {
                    this.webloading = true;
                    this.store.dispatch(loadAllWebGoods());
                }
            }),
            filter(WebGoodsLoaded => WebGoodsLoaded),
            first(),
            finalize(() => this.webloading = false)
        );
        
        return combineLatest(OneCChain$,WebChain$)          


    }



}