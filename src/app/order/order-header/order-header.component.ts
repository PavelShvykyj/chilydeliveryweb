import { loadAllStreets, savedStreet, saveStreet } from './../../streets/streets.actions';
import { IStreet } from './../../models/street';
import { tap, map, take } from 'rxjs/operators';
import { AppState } from './../../reducers/index';
import { Store, select } from '@ngrx/store';
import { Component, OnInit, OnDestroy, ViewChild, ViewContainerRef, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { selectOrderHeader } from '../editorder.selectors';
import { IOrderHeader } from 'src/app/models/order';
import { UpdateOrderHeader } from '../editorder.actions';
import { Subscription, Observable, of } from 'rxjs';
import { selectByName } from 'src/app/streets/streets.selectors';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'order-header',
  templateUrl: './order-header.component.html',
  styleUrls: ['./order-header.component.scss']
})
export class OrderHeaderComponent implements OnInit, OnDestroy {
  form: FormGroup;
  headersubs: Subscription;
  streetsByname$ : Observable<IStreet[]> = of([]);

  @ViewChild("#inputadress",{static:false, read: ViewContainerRef})
  InputAddres: ViewContainerRef

  constructor(private store: Store<AppState>,private snackBar: MatSnackBar) {
    this.form = new FormGroup({
      addres: new FormControl("", Validators.required),
      phone: new FormControl("", [Validators.required, Validators.minLength(10), Validators.maxLength(10)]),
      comment: new FormControl("")
    });



  }


  ngOnInit() {
    this.headersubs =  this.store.pipe(
      select(selectOrderHeader),
      tap(header=>{

          this.addres=header.addres;


          this.phone=header.phone;


          this.comment=header.comment;

      })).subscribe();
  }

  ngOnDestroy() {
    this.UpdateHeader()
    this.headersubs.unsubscribe();
  }

  UpdateHeader() {
    const header : IOrderHeader = {...this.form.value}
    this.store.dispatch(UpdateOrderHeader({
      header
    }))

  }

  OnAddresInput() {

    if (this.addres.trim().length==0) {
      this.streetsByname$ = of([]);
    } else {
      const reg = ".*"+this.addres.trim().toUpperCase().replace(/\s+/g, ".*")+".*";
      this.streetsByname$ = this.store.pipe(select(selectByName, {filter: reg }));
    }
  }

  ClearAdress() {
    this.addres="";
    this.UpdateHeader();
  }

  SaveAddres( ) {
    const reg = ".*"+this.addres.trim().toUpperCase().replace(/\s+/g, ".*")+".*";
    this.store.pipe(select(selectByName, {filter: reg }),take(1)).subscribe(adr=>{
      console.log(adr, adr.length);
      if (adr.length == 0) {

        this.store.dispatch(saveStreet({streetName:this.addres}));
      } else {
        this.snackBar.open("Есть аналог не сохраняем",'',{ duration: 2000, viewContainerRef: this.InputAddres} );
      }

    })

  }

  RefreshAddres() {
    let snack = this.snackBar.open("Для полного обновления нажмите -->", "OK", { duration: 2000, panelClass: ['mat-toolbar', 'snack-info'] });
    snack.onAction().subscribe(res => {
      this.store.dispatch(loadAllStreets());
    })
  }

  ClearPhone() {
    this.phone="";
    this.UpdateHeader();
  }

  ClearComment() {
    this.comment="";
    this.UpdateHeader();
  }

  getErrorMessage(controlname: string) {
    return this.form.hasError('minlength',controlname) ? 'Нехватает символов...' :
    this.form.hasError('maxlength',controlname) ? 'Лишние символы...' :
        '';
  }

  get headervalid() {
    return this.form.valid
  }

  get addres() {
    return this.form.get('addres').value
  }

  get phone() {
    return this.form.get('phone').value
  }

  get phoneControl() {
    return this.form.get('phone');
  }


  get comment() {
    return this.form.get('comment').value
  }

  set addres(value: string) {
    this.form.get('addres').setValue(value);

  }

  set phone(value: string) {
    this.form.get('phone').setValue(value);

  }

  set comment(value: string) {
    this.form.get('comment').setValue(value);

  }
}
