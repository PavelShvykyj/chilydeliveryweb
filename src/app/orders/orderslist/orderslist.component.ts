import { Subscription } from 'rxjs';
import { IOrder } from './../../models/order';
import { Store, select } from '@ngrx/store';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { AppState } from 'src/app/reducers';
import { selectAllOrders } from '../order.selectors';

@Component({
  selector: 'orderslist',
  templateUrl: './orderslist.component.html',
  styleUrls: ['./orderslist.component.scss']
})
export class OrderslistComponent implements OnInit, OnDestroy {
  displayedColumns : string[] = ['externalid','desk','filial','creation','phone','addres','buttonsgroup']
  dataSource : MatTableDataSource<IOrder>  = new MatTableDataSource([{
    id:"",
    isSelected:false,
    externalid:"",
    desk:"",
    filial:"",
    creation:new Date(),
    phone:"",
    addres:"",
    goods:[],
    comments:[]

  }])
  ordersusbs:Subscription

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  constructor(private store: Store<AppState> ) { }

  ngOnInit() {
    this.ordersusbs = this.store.pipe(select(selectAllOrders))
    .subscribe(orders=>{
      console.log(orders);
      this.dataSource.data=orders;
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

  }

  AddComent(order:IOrder) {

  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
}
