import { tap } from 'rxjs/operators';
import { AppState } from './../../reducers/index';
import { Store, select } from '@ngrx/store';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { selectOrderHeader } from '../editorder.selectors';
import { IOrderHeader } from 'src/app/models/order';
import { UpdateOrderHeader } from '../editorder.actions';

@Component({
  selector: 'order-header',
  templateUrl: './order-header.component.html',
  styleUrls: ['./order-header.component.scss']
})
export class OrderHeaderComponent implements OnInit, OnDestroy {
  form: FormGroup;

  constructor(private store: Store<AppState>) {
    this.form = new FormGroup({
      addres: new FormControl("", Validators.required),
      phone: new FormControl("", Validators.required),
      comment: new FormControl("")
    })
  }


  ngOnInit() {
    this.store.pipe(
      select(selectOrderHeader),
      tap(header=>{
        console.log(header);
        this.addres=header.addres,
        this.phone=header.phone,
        this.comment=header.comment
      })).subscribe();
  }

  ngOnDestroy() {
    const header : IOrderHeader = {...this.form.value}
    this.store.dispatch(UpdateOrderHeader({
      header
    }))

  }

  get addres() {
    return this.form.get('addres').value
  }

  get phone() {
    return this.form.get('phone').value
  }

  get comment() {
    return this.form.get('comment').value
  }

  set addres(value: string) {
    this.form.get('addres').patchValue(value);
  }

  set phone(value: string) {
    this.form.get('phone').patchValue(value);
  }

  set comment(value: string) {
    this.form.get('comment').patchValue(value);
  }
}
