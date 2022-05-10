import { ChoiceService } from './web/choiceservise.service';
import { IOrderChanges, IOrder } from './models/order';
import { async } from '@angular/core/testing';
import { selectIsLoggedIn, selectUserData } from './auth/auth.selectors';
import { Observable, Subject, Subscription } from 'rxjs';
import { LoadOptions } from './option.reducer';
import { Store, select } from '@ngrx/store';
import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { AppState } from './reducers';
import { AuthService } from './auth/auth.service';
import { map, first, take, tap, filter, concatMap } from 'rxjs/operators';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { LocalDBService } from './idb/local-db.service';
import { WebGoodsDatasourseService } from './web/web.goods.datasourse.service';
import { updateWebgoodByExternalData, updateDirtyWebgoodByExternalData, loadAllWebGoods } from './web/web.actions';
import { OrdersDatasourseService } from './orders/orders.datasourse.service';
import { OrdersUpdated, OrdersDeleted, loadAllOrders, loadAllOrdersOnAppInit } from './orders/order.actions';
import { AreOrdesLoaded } from './orders/order.selectors';
import { AngularFireStorage } from '@angular/fire/storage';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  title = 'deliveryonec';
  isLoggedIn$: Observable<boolean>;
  pictureUrl$: Observable<string>;

  private destroySubs: Subject<boolean> = new Subject<boolean>();

  fbgoodschangessubs: Subscription;
  dateuptsubs: Subscription;
  auditgoodsubs: Subscription;
  auditdirtygoodsubs: Subscription;
  loadingsubs: Subscription;
  orderssubs: Subscription;
  loading: boolean = true;


  @ViewChild('DownloadLink', { static: false }) DownloadLink: ElementRef;


  constructor(private store: Store<AppState>,
    private fdb: WebGoodsDatasourseService,
    private fdborders: OrdersDatasourseService,
    private chservise: ChoiceService,
    private auth: AuthService,
    private router: Router,
    private storage: AngularFireStorage,
    public idb: LocalDBService) {
    this.isLoggedIn$ = this.store.pipe(select(selectIsLoggedIn),

    tap(IsLoggedIn=>{
      if(IsLoggedIn) {
        setTimeout(() => {
          this.SetDownLoadURL();
        }, 10);
      }
    }));
    this.pictureUrl$ = this.store.pipe(select(selectUserData), map(userdata => userdata.avatar));

  }

  LogOut() {
    this.Unsubscribe();
    this.auth.LogOut();
    this.router.navigateByUrl("login");
  }

  async UpdateChangesAsync() {
    this.loading = true;
    const currentupdatedte = await this.idb.GetLastUpdate();
    this.idb.lastupdateEventer.next(currentupdatedte);
    const changes = await this.fdb.GetAllChangesAsync(currentupdatedte);
    await this.idb.UpdateChanges(changes);
    changes.goods.forEach(good => this.store.dispatch(updateWebgoodByExternalData({ good })));
    changes.dirtygoods.forEach(dirtygood => this.store.dispatch(updateDirtyWebgoodByExternalData({ good: dirtygood })));
    this.loading = false;

  }

  async StartListenGoodsChange() {
    const currentupdatedte = await this.idb.GetLastUpdate();
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

  ListenLoading() {
    this.loadingsubs = this.router.events.subscribe(event => {
      switch (true) {
        case event instanceof NavigationStart: {
          this.loading = true;
          break;
        }
        case event instanceof NavigationEnd:
        case event instanceof NavigationCancel:
        case event instanceof NavigationError:
          {
            this.loading = false;
            break;
          }

        default:
          break;
      }


    })
  }

  ngAfterViewInit(): void {

  }

  ngOnInit() {
    this.store.dispatch(LoadOptions());
    /// напрямую включаем прослушку изменений они затянут начальное значение
    /// поетому УДАЛИТЬ actions LoadAllOrders, LoadAllOrdersOnAppInit, и все что с ними связано ефект переменную состояния и акшн OrdersLoaded
    this.fdborders.OdrdersChangesStart();
    //this.chservise.OdrdersChangesStart();

    //this.UpdateChangesAsync();
    this.idb.UpdateErrorIdsCount();
    this.ListenLoading();
    this.store.dispatch(loadAllWebGoods());

  }


  SetDownLoadURL() {
    console.log("this.DownloadLink",this.DownloadLink);
    this.storage.ref("choise_proxy/index-win.exe").getDownloadURL()
    .pipe(take(1)).subscribe(url => {
      this.DownloadLink.nativeElement.href = url;

    })


  }

  DownloadProxy(link) {
    this.storage.ref("choise_proxy/index-win.exe").getDownloadURL()
    .pipe(take(1),
    concatMap(URL => {

      return this.chservise.GetProxyBlob(URL)
    })
    ).subscribe(res => {
      let newBlob = new Blob([res], {type: 'application/x-msdownload'});
      var downloadURL = window.URL.createObjectURL(newBlob);
      link.href = downloadURL;
      link.download = "index-win.exe";
      link.click()
    })
  }

  AuditOn() {
    //   this.auditgoodsubs = this.fdb.Audit('web.goods').subscribe(res=>console.log("auditgood", res))
    //   this.auditdirtygoodsubs = this.fdb.Audit('onec.goods').subscribe(res=>console.log("dirty", res))
  }

  Unsubscribe() {
    this.destroySubs.next(true);
    this.destroySubs.unsubscribe();

    if (this.fbgoodschangessubs) {
      this.fbgoodschangessubs.unsubscribe();
    }

    if (this.dateuptsubs) {
      this.fbgoodschangessubs.unsubscribe();
    }

    if (this.auditgoodsubs) {

      this.auditgoodsubs.unsubscribe();
    }
    if (this.auditgoodsubs) {
      this.auditgoodsubs.unsubscribe();
    }

    if (this.orderssubs) {
      this.orderssubs.unsubscribe();
    }

    if (this.orderssubs) {
      this.loadingsubs.unsubscribe();
    }

    this.fdborders.OdrdersChangesStop();
    this.chservise.OdrdersChangesStop();
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
    errors.forEach(element => this.RetryUpsert(element))
  }

  DeleteChoiseLog() {
    this.chservise.DeleteOrders();
  }



}
