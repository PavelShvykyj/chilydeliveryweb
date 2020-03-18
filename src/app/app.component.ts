import { selectIsLoggedIn, selectUserData } from './auth/auth.selectors';
import { Observable, Subscription } from 'rxjs';
import { LoadOptions } from './option.reducer';
import { Store, select } from '@ngrx/store';
import { Component, OnInit } from '@angular/core';
import { AppState } from './reducers';
import { AuthService } from './auth/auth.service';
import { map, first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LocalDBService } from './idb/local-db.service';
import { WebGoodsDatasourseService } from './web/web.goods.datasourse.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'deliveryonec';
  isLoggedIn$: Observable<boolean>;
  pictureUrl$: Observable<string>;
  fbgoodschangessubs: Subscription;

  constructor(private store: Store<AppState>,
    private fdb: WebGoodsDatasourseService,
    private auth: AuthService,
    private router: Router,
    private idb: LocalDBService) {
    this.isLoggedIn$ = this.store.pipe(select(selectIsLoggedIn));
    this.pictureUrl$ = this.store.pipe(select(selectUserData), map(userdata => userdata.avatar));
    console.log(this.idb.DB);
  }

  LogOut() {
    this.auth.LogOut();
    this.router.navigateByUrl("login");
  }

  async StartListenGoodsChange() {
    const currentupdatedte = await this.idb.GetLastUpdate();
    this.idb.lastupdate$.pipe(map(dateupdated => {
      if (this.fbgoodschangessubs) {
        this.fbgoodschangessubs.unsubscribe();
      }

      console.log("dateupdated", dateupdated);
      this.fbgoodschangessubs = this.fdb.GetAllChanges(dateupdated).subscribe();
    }),first()).subscribe();
    console.log("currentupdatedte", currentupdatedte);
    this.idb.lastupdateEventer.next(currentupdatedte);

  }

  ngOnInit() {
    this.store.dispatch(LoadOptions());
    this.StartListenGoodsChange();
  }




}
