import { selectIsLoggedIn, selectUserData } from './auth/auth.selectors';
import { Observable } from 'rxjs';
import { LoadOptions } from './option.reducer';
import { Store, select } from '@ngrx/store';
import { Component, OnInit } from '@angular/core';
import { AppState } from './reducers';
import { AuthService } from './auth/auth.service';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'deliveryonec';
  isLoggedIn$:Observable<boolean>;
  pictureUrl$:Observable<string>;

  constructor(private store : Store<AppState>,private auth : AuthService, private router : Router,) {
    this.isLoggedIn$ = this.store.pipe(select(selectIsLoggedIn));
    this.pictureUrl$ = this.store.pipe(select(selectUserData), map(userdata=>   userdata.avatar));
  }

  LogOut() {
    this.auth.LogOut();
    this.router.navigateByUrl("login");
  }

  ngOnInit() {
    this.store.dispatch(LoadOptions());
  }

  OnExternal1CValueChange(el){
    if(el.value=="options") {
      this.store.dispatch(LoadOptions());
    }
  }


}
