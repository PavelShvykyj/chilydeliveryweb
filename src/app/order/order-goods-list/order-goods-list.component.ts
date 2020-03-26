import { UpsertOrderRecord, DeleteOrderRecord } from './../editorder.actions';
import { IOrderGoodsRecord, IOrderGoodsRecordWithEntity } from './../../models/order';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { IOrder } from 'src/app/models/order';
import { Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/reducers';
import { selectAllOrders } from 'src/app/orders/order.selectors';
import { selectAllOrderGoodsWithEntity } from '../editorder.selectors';

@Component({
  selector: 'order-goods-list',
  templateUrl: './order-goods-list.component.html',
  styleUrls: ['./order-goods-list.component.scss']
})
export class OrderGoodsListComponent implements OnInit {

  displayedColumns : string[] = ['good' ,'quantity','comment','buttonsgroup'];
  dataSource : MatTableDataSource<IOrderGoodsRecordWithEntity>  = new MatTableDataSource([]);
  ordersusbs:Subscription

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  constructor(private store: Store<AppState> ) { }

  ngOnInit() {
    this.ordersusbs = this.store.pipe(select(selectAllOrderGoodsWithEntity))
    .subscribe(orderrecords=>{
      
      this.dataSource.data=orderrecords;
    });

  }
  
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy() {
    this.ordersusbs.unsubscribe();
  }

  IncrQuantity(record:IOrderGoodsRecord) {
    record.quantity = 1;
    this.store.dispatch(UpsertOrderRecord({record}));
  }

  DecrQuantity(record) {
    record.quantity = -1;
    this.store.dispatch(UpsertOrderRecord({record}));

  }

  Del(record) {
    this.store.dispatch(DeleteOrderRecord({recordid:record.id}));
  }

}
