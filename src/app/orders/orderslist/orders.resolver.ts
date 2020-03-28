import { loadAllOrders } from './../order.actions';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/reducers';
import { Observable } from 'rxjs';
import { AreOrdesLoaded } from '../order.selectors';
import { tap, filter, first, finalize } from 'rxjs/operators';

@Injectable()
export class OrdesResolver implements Resolve<any> {

    
    webloading = false;
    constructor(private store: Store<AppState>) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        return this.store.pipe(
            select(AreOrdesLoaded), 
            tap(OrderssLoaded => {
                
                if (!this.webloading && !OrderssLoaded) {
                    this.webloading = true;
                    this.store.dispatch(loadAllOrders());
                }
            }),
            filter(OrderssLoaded => OrderssLoaded),
            first(),
            finalize(() => this.webloading = false)
        );

    }
}