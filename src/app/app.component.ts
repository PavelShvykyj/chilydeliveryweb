import { IOrderChanges, IOrder } from './models/order';
import { async } from '@angular/core/testing';
import { selectIsLoggedIn, selectUserData } from './auth/auth.selectors';
import { Observable, Subscription } from 'rxjs';
import { LoadOptions } from './option.reducer';
import { Store, select } from '@ngrx/store';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppState } from './reducers';
import { AuthService } from './auth/auth.service';
import { map, first, take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LocalDBService } from './idb/local-db.service';
import { WebGoodsDatasourseService } from './web/web.goods.datasourse.service';
import { updateWebgoodByExternalData, updateDirtyWebgoodByExternalData } from './web/web.actions';
import { element } from 'protractor';
import { OrdersDatasourseService } from './orders/orders.datasourse.service';
import { OrdersUpdated, OrdersDeleted } from './orders/order.actions';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'deliveryonec';
  isLoggedIn$: Observable<boolean>;
  pictureUrl$: Observable<string>;
  fbgoodschangessubs: Subscription;
  dateuptsubs: Subscription;
  auditgoodsubs: Subscription;
  auditdirtygoodsubs: Subscription;
  orderssubs: Subscription;

  constructor(private store: Store<AppState>,
    private fdb: WebGoodsDatasourseService,
    private fdborders: OrdersDatasourseService,
    private auth: AuthService,
    private router: Router,
    public idb: LocalDBService) {
    this.isLoggedIn$ = this.store.pipe(select(selectIsLoggedIn));
    this.pictureUrl$ = this.store.pipe(select(selectUserData), map(userdata => userdata.avatar));
    console.log(this.idb.DB);
  }

  LogOut() {
    this.Unsubscribe();
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
      this.fbgoodschangessubs = this.fdb.GetAllChanges(dateupdated).pipe(take(1)).subscribe(changes => {
        changes.goods.forEach(good => this.store.dispatch(updateWebgoodByExternalData({ good })));
        changes.dirtygoods.forEach(dirtygood => this.store.dispatch(updateDirtyWebgoodByExternalData({ good: dirtygood })));
      }
      );
    })).pipe(take(1)).subscribe();
  }

  ngOnInit() {
    this.store.dispatch(LoadOptions());
    this.UpdateChanges();
    this.idb.UpdateErrorIdsCount();
    this.orderssubs = this.fdborders.GetOrdersChanges()
      .subscribe(orderchanges => {
        const ordersToUpdate: IOrder[] = [];
        const ordersToDelete: string[] = [];
        orderchanges.forEach(element => {
          if (element.type == 'removed') {
            ordersToDelete.push(element.order.id)
          } else {
            ordersToUpdate.push(element.order)
          }
          if (ordersToUpdate.length != 0) {
            this.store.dispatch(OrdersUpdated({ orders: ordersToUpdate }));
          }
          if (ordersToDelete.length != 0) {
            this.store.dispatch(OrdersDeleted({ orders: ordersToDelete }));
          }

        })


      });

    //this.AuditOn()
  }


  AuditOn() {
    //   this.auditgoodsubs = this.fdb.Audit('web.goods').subscribe(res=>console.log("auditgood", res))
    //   this.auditdirtygoodsubs = this.fdb.Audit('onec.goods').subscribe(res=>console.log("dirty", res))
  }

  Unsubscribe() {
    if (this.fbgoodschangessubs) {
      console.log('unsubs changes');
      this.fbgoodschangessubs.unsubscribe();
    }

    if (this.dateuptsubs) {
      console.log('unsubs date');
      this.fbgoodschangessubs.unsubscribe();
    }

    if (this.auditgoodsubs) {
      console.log('unsubs auditgoodsubs');
      this.auditgoodsubs.unsubscribe();
    }
    if (this.auditgoodsubs) {
      console.log('unsubs auditgoodsubs');
      this.auditgoodsubs.unsubscribe();
    }
    if (this.orderssubs) {
      console.log('unsubs orderssubs');
      this.orderssubs.unsubscribe();
    }

  }


  ngOnDestroy() {
    this.Unsubscribe();

  }

  UpdateChanges() {
    this.ExternalChangesSubscription();
    this.StartListenGoodsChange();
  }

  async RetryUpsert(element) {
    console.log('RetryUpsert', element)
    await this.idb.DeleteElement('LocaleChangedID', element);
    this.fdb.UpsertWebGood(element).pipe(take(1)).subscribe();
  }

  async UpdateErrors() {
    const errors = await this.idb.GetErrors();
    console.log("local errors", errors);
    errors.forEach(element => this.RetryUpsert(element))
  }

}
