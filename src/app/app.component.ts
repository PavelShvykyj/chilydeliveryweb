import { async } from '@angular/core/testing';
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
import { updateWebgoodByExternalData, updateDirtyWebgoodByExternalData } from './web/web.actions';
import { element } from 'protractor';


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
  dateuptsubs: Subscription;

  constructor(private store: Store<AppState>,
    private fdb: WebGoodsDatasourseService,
    private auth: AuthService,
    private router: Router,
    public idb: LocalDBService) {
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
    console.log("currentupdatedte", currentupdatedte);
    this.idb.lastupdateEventer.next(currentupdatedte);

  }

  ExternalChangesSubscription() {
    if (this.dateuptsubs) {
      console.log('unsubs date');
      this.fbgoodschangessubs.unsubscribe();
    }
    
    this.dateuptsubs = this.idb.lastupdate$.pipe(map(dateupdated => {
      if (this.fbgoodschangessubs) {
        console.log('unsubs changes');
        this.fbgoodschangessubs.unsubscribe();
      }

      console.log("dateupdated", dateupdated);
      this.fbgoodschangessubs = this.fdb.GetAllChanges(dateupdated).pipe(first()).subscribe(changes =>{
        changes.goods.forEach(good =>this.store.dispatch(updateWebgoodByExternalData({good})));
        changes.dirtygoods.forEach(dirtygood =>this.store.dispatch(updateDirtyWebgoodByExternalData({good:dirtygood})));
      }
      );
    })).pipe(first()).subscribe();
  }

  ngOnInit() {
    this.store.dispatch(LoadOptions());
    this.UpdateChanges();
    this.idb.UpdateErrorIdsCount();
  }

  UpdateChanges() {
    this.ExternalChangesSubscription();
    this.StartListenGoodsChange();
  }

  async RetryUpsert(element) {
    await this.idb.DeleteElement('LocaleChangedID',element);
    this.fdb.UpsertWebGood(element).pipe(first()).subscribe();
  }
  
  async UpdateErrors() {
    const errors = await this.idb.GetErrors();
    errors.forEach(element=> this.RetryUpsert(element))
  }

}
