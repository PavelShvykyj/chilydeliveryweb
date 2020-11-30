import { SelectOrder } from './../../order/editorder.actions';
import { IOrder } from 'src/app/models/order';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AppState } from 'src/app/reducers';
import { selectMobileOrders } from '../order.selectors';
import { Router } from '@angular/router';
import { BlockOrder } from '../order.actions';

@Component({
  selector: 'mobile-queue',
  templateUrl: './mobile-queue.component.html',
  styleUrls: ['./mobile-queue.component.scss']
})
export class MobileQueueComponent implements OnInit {

  Queue$ : Observable<IOrder[]>

  constructor(private router: Router, 
              private store: Store<AppState>,) { }

  ngOnInit() {
    this.Queue$ = this.store.pipe(select(selectMobileOrders));

  }

  OnMobileOrderClick(order: IOrder) {
    this.store.dispatch(BlockOrder({order}));
    if (!this.router.isActive("order",true)) {
      this.router.navigateByUrl('order'); 
    }
  }

}
