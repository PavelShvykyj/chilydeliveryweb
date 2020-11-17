import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { IBaseGood } from './../../models/base.good';
import { IWEBGood, IWEBGoodWithFilials } from './../../models/web.good';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogConfig } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IONECGood } from 'src/app/models/onec.good';
import { SelectparentComponent } from '../selectparent/selectparent.component';
import { select, Store } from '@ngrx/store';
import { AppState } from 'src/app/reducers';
import { selectMaxNumbersByCategoty, selectWebGoodsByCategoty } from '../web.selectors';

@Component({
  selector: 'app-web-good-edit',
  templateUrl: './web-good-edit.component.html',
  styleUrls: ['./web-good-edit.component.scss']
})
export class WebGoodEditComponent implements OnInit {
  form : FormGroup;
  categoryMaxNumber$ : Observable<number>;
  categoryElements$ : Observable<IWEBGood[]>;

  constructor(
    private store: Store<AppState>,
    public dialogRef: MatDialogRef<WebGoodEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data : {item: IWEBGoodWithFilials, parentel: IBaseGood},
    public dialog: MatDialog) { 

      this.form = new FormGroup({name: new FormControl(this.data.item.name,Validators.required),
        isFolder: new FormControl(this.data.item.isFolder),
        price: new FormControl(this.data.item.price==undefined? 0 : this.data.item.price),
        mCategory: new FormControl(this.data.item.mCategory==undefined? 0 : this.data.item.mCategory),
        mType: new FormControl(this.data.item.mType==undefined? 0 : this.data.item.mType),
        mShowOnMobile: new FormControl(this.data.item.mShowOnMobile==undefined? false : this.data.item.mShowOnMobile),
        mSize: new FormControl(this.data.item.mSize==undefined? 0 : this.data.item.mSize),
        mName: new FormControl(this.data.item.mName==undefined? "" : this.data.item.mName),
        mNumber: new FormControl(this.data.item.mNumber==undefined? 0 : this.data.item.mNumber)
      })  

    }

  ngOnInit() {
    this.InitSelectors();
  }

  InitSelectors() {
    // = this.store.pipe(select(selectMaxNumbersByCategoty, {mCategory:  this.Category }));
    const reg = ".*"+this.form.get("mName").value.trim().toUpperCase().replace(/\s+/g, ".*")+".*";
    this.categoryElements$ = this.store.pipe(select(selectWebGoodsByCategoty, {mCategory:  this.Category,name: reg }));
    this.categoryMaxNumber$ = this.categoryElements$.pipe(
      map(goods => {
        if (goods.length == 0) {
          return 0
      } else {
          return goods[0].mNumber = undefined? 0 : goods[0].mNumber;
      }}));
  }

  OnFilialDelete(filial) {
    this.data.item.filialElements.splice(this.data.item.filialElements.indexOf(filial),1)
  }

  OnCategoryChange() {
    this.InitSelectors();
  }

  OnParentSelectClick() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.minHeight="300px";
    dialogConfig.minWidth="25wv"

    const DialogRef : MatDialogRef<SelectparentComponent>  = this.dialog.open(SelectparentComponent,dialogConfig);
    DialogRef.afterClosed().subscribe(res =>{
      if(res.answer != 'save') {
        return;
      }
      
      
      if (res.data!=undefined && this.data.item.id == res.data.id) {
        return;
      }

      this.data.parentel = res.data

    });



  }

  OnFileUploaded(event) {
    
    this.data.item.picture = event;
    //this.Save();
  }


  Save() {
    if(this.form.invalid) {
      this.form.get("name").markAsTouched();
      return;
    }

  

    const newversion : IWEBGood  = {
      ...this.data.item,
      isFolder:this.form.get("isFolder").value,
      name: this.form.get("name").value,
      parentid: this.data.parentel==undefined? "" : this.data.parentel.id,
      price:this.form.get("price").value,
      mCategory: this.form.get("mCategory").value,
      mType: this.form.get("mType").value,
      mSize: this.form.get("mSize").value,
      mShowOnMobile: this.form.get("mShowOnMobile").value,
      mNumber: this.form.get("mNumber").value,
      picture:this.data.item.picture,
      filials:this.data.item.filialElements.map(el => el.id)
    }
    this.dialogRef.close({answer: 'save', data : newversion });
  }

  Cancel() {
    this.dialogRef.close({answer: 'cancel'});
  }

  AvtoName() {
    
    const shablonsize = new RegExp(/\d\d\sСМ/, 'ig');
    const shablonsizeshort = new RegExp(/\d\dСМ/, 'ig');
    const shabloncat  = new RegExp(/.ЦМ./, 'ig');
    const shablon34  = new RegExp(/\"/, 'ig');
    const shablonfit  = new RegExp(/ФІТ/, 'ig');
    const shablonleft  = new RegExp(/\(/, 'ig');
    const shablonright  = new RegExp(/\)/, 'ig');
    const shablondot  = new RegExp(/\./, 'ig');
    const shablonpiza  = new RegExp(/ПІЦА/, 'ig');
    
    
    let name : string = this.Name;
    let mName : string =  name.toUpperCase()
        .replace(shablonsize,'')
        .replace(shabloncat,'')
        .replace(shablonsizeshort,'')
        .replace(shablon34,'')
        .replace(shablonfit,'')
        .replace(shablonleft,'')
        .replace(shablonright,'')
        .replace(shablondot,'')
        .replace(shablonpiza,'')
        .toLowerCase();

    this.form.get("mName").setValue(mName);    

  }

  AvtoNumber(MaxNumber: number) {
    this.form.get("mNumber").setValue(MaxNumber+1);

  }

  AnalogSelected(SelectedNumber : number) {
    this.form.get("mNumber").setValue(SelectedNumber);
  } 
  
  //////// GET --- SET ////////

  get Category() : boolean {
    return this.form.get("mCategory").value
  }


  get ShowInMobile() : boolean {
    return this.form.get("mShowOnMobile").value
  }
  
  get Name() : string {
    return this.form.get("name").value
  }

  get isFolder() : boolean {
    return this.form.get("isFolder").value
  }

}
