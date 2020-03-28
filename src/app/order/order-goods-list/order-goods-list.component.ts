import { UpsertOrderRecord, DeleteOrderRecord, UpdateOrderfilial } from './../editorder.actions';
import { IOrderGoodsRecord, IOrderGoodsRecordWithEntity } from './../../models/order';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { IOrder } from 'src/app/models/order';
import { Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/reducers';
import { selectAllOrders } from 'src/app/orders/order.selectors';
import { selectAllOrderGoodsWithEntity, selectOrderFilial } from '../editorder.selectors';

@Component({
  selector: 'order-goods-list',
  templateUrl: './order-goods-list.component.html',
  styleUrls: ['./order-goods-list.component.scss']
})
export class OrderGoodsListComponent implements OnInit {

  displayedColumns : string[] = ['good' ,'quantity','comment','buttonsgroup'];
  dataSource : MatTableDataSource<IOrderGoodsRecordWithEntity>  = new MatTableDataSource([]);
  ordersusbs:Subscription;
  filial : string = 'luxor';
  filialsubs : Subscription;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  constructor(private store: Store<AppState> ) { }

  ngOnInit() {
    this.ordersusbs = this.store.pipe(select(selectAllOrderGoodsWithEntity))
    .subscribe(orderrecords=>{
      
      this.dataSource.data=orderrecords;
    });

    this.filialsubs = this.store.pipe(select(selectOrderFilial))
    .subscribe(filial=>{
      this.filial = filial;
    });
  }
  
  get goodsvalid() {
    return true
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

  OnFilialChange() {
    this.store.dispatch(UpdateOrderfilial({filial:this.filial}));
  }

  Del(record) {
    this.store.dispatch(DeleteOrderRecord({recordid:record.id}));
  }

}
