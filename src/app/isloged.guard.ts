import { selectIsLoggedIn } from './auth/auth.selectors';
import { Store, select } from '@ngrx/store';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs";
import { AppState } from './reducers';
import { Injectable } from '@angular/core';
 
@Injectable({
    providedIn: 'root'
  })
export class IsLoggedInGuard implements CanActivate{
 
    constructor(private store: Store<AppState>) {
        
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) : Observable<boolean> | boolean{
         return this.store.pipe(select(selectIsLoggedIn));
    }
}