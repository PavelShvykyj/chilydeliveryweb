import { share } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AppState } from '../reducers';
import { Observable } from 'rxjs';
import { AuthStausChanged } from './reducers';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authState$: Observable<firebase.User>

  constructor(private afAuth: AngularFireAuth, private store: Store<AppState>) {
    this.authState$ = this.afAuth.authState.pipe(share());
    this.authState$.subscribe(user => {this.store.dispatch(AuthStausChanged({user}))});

  }

  get user(): Observable<firebase.User> {
    return this.authState$;
  }

  LogOut() {
    this.afAuth.auth.signOut();

  }

}




