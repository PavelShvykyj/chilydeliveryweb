import { Router } from '@angular/router';
import { OrdersDatasourseService } from './../orders.datasourse.service';
import { Subscription } from 'rxjs';
import { IOrder, IOrderWithGoods } from './../../models/order';
import { Store, select } from '@ngrx/store';
import { Component, OnInit, ViewChild, OnDestroy, NgZone } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatSnackBar } from '@angular/material';
import { AppState } from 'src/app/reducers';
import { selectAllOrders, selectAllOrdersWithEntities } from '../order.selectors';
import { selectEntities } from 'src/app/web/reducers';
import { ReleaseOrder } from '../order.actions';

@Component({
  selector: 'orderslist',
  templateUrl: './orderslist.component.html',
  styleUrls: ['./orderslist.component.scss']
})
export class OrderslistComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['externalid', 'desk', 'filial', 'creation', 'phone', 'addres', 'buttonsgroup']
  dataSource: MatTableDataSource<IOrderWithGoods> = new MatTableDataSource([{
    id: "",
    isSelected: false,
    externalid: "",
    desk: "",
    filial: "",
    creation: new Date(),
    phone: "",
    addres: "",
    goods: [],
    comments: []

  }])
  ordersusbs: Subscription

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(private store: Store<AppState>,
    private db: OrdersDatasourseService,
    private ngZone: NgZone,
    private router: Router,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.ordersusbs = this.store.pipe(select(selectAllOrdersWithEntities))
      .subscribe(orders => {
        this.ngZone.run(() => {
          this.dataSource.data = orders;
        })
      });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy() {
    this.ordersusbs.unsubscribe();
  }

  AddOrder() {
    this.router.navigateByUrl("order");
  }

  AddComent(order: IOrder) {
  }

  async Remove(id: string) {
    let snack = this.snackBar.open("Для удаления нажмите -->", "OK", { duration: 2000, panelClass: ['mat-toolbar', 'snack-info'] });
    snack.onAction().subscribe(res => {
      this.db.RemoveOrder(id);
    })
  }

  Release(id: string) {
    let snack = this.snackBar.open("Для редактирования нажмите -->", "OK", { duration: 2000, panelClass: ['mat-toolbar','snack-info'] });
    snack.onAction().subscribe(res => {
      this.store.dispatch(ReleaseOrder({id}));
    })
  }

  GetTooltipText(order: IOrderWithGoods): string {
    const formated: string[] = order.goods.map(el => `${el.good.name} ${el.quantity} ${el.comment}`);
    return formated.join('\n');
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
}
