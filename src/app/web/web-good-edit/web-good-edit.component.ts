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
import { webDataCanges } from 'src/app/mobile/mobile.actions';
import { DefoultIfEMpty } from 'src/app/mobile/mobile.service';

@Component({
  selector: 'app-web-good-edit',
  templateUrl: './web-good-edit.component.html',
  styleUrls: ['./web-good-edit.component.scss']
})
export class WebGoodEditComponent implements OnInit {
  form : FormGroup;
  categoryMaxNumber$ : Observable<number>;
  categoryElements$ : Observable<IWEBGood[]>;
  categoryShowElements$ : Observable<IWEBGood[]>;

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

  InitShownElements()  {
    const reg = ".*"+this.mName.trim().toUpperCase().replace(/\s+/g, ".*")+".*";
    this.categoryShowElements$ = this.categoryElements$.pipe(
      map(goods => {return  goods.filter(el => {return el.name.toUpperCase().search(reg)!=-1; })}));
  }

  InitSelectors() {
    // = this.store.pipe(select(selectMaxNumbersByCategoty, {mCategory:  this.Category }));
    
    this.categoryElements$ = this.store.pipe(select(selectWebGoodsByCategoty, {mCategory:  this.Category }));
    this.categoryMaxNumber$ = this.categoryElements$.pipe(
      map(goods => {
        if (goods.length == 0) {
          return 0
      } else {
          return goods[0].mNumber = undefined? 0 : goods[0].mNumber;
      }}));
    
      this.InitShownElements();  



      //.filter(el => {const res = el.name.toUpperCase().search(props.name)!=-1;  return res})

  }

  OnMobileNameChange() {
    this.InitShownElements();
    
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
      mCategory: DefoultIfEMpty(this.form.get("mCategory").value,0),
      mType: DefoultIfEMpty(this.form.get("mType").value,0),
      mSize: DefoultIfEMpty(this.form.get("mSize").value,0),
      mShowOnMobile: this.form.get("mShowOnMobile").value,
      mNumber: DefoultIfEMpty(this.form.get("mNumber").value,0),
      mName:DefoultIfEMpty(this.form.get("mName").value,""),
      picture:this.data.item.picture,
      filials:this.data.item.filialElements.map(el => el.id)
    }
    this.store.dispatch(webDataCanges());
    this.dialogRef.close({answer: 'save', data : newversion });
  }

  Cancel() {
    this.dialogRef.close({answer: 'cancel'});
  }

  AvtoName() {
    
    const shablonsize = new RegExp(/\d\d\sСМ/, 'ig');
    const shablonsizeshort = new RegExp(/\d\dСМ/, 'ig');
    const shabloncat  = new RegExp(/\(ЦМ\)/, 'ig');
    const shablon34  = new RegExp(/\"/, 'ig');
    const shablonfit  = new RegExp(/ФІТ/, 'ig');
    const shablonleft  = new RegExp(/\(/, 'ig');
    const shablonright  = new RegExp(/\)/, 'ig');
    const shablondot  = new RegExp(/\./, 'ig');
    const shablonpiza  = new RegExp(/ПІЦА/, 'ig');
    
    
    let name : string = this.Name;
    let shortname : string =  name.toUpperCase()
        .replace(shablonsize,'')
        .replace(shabloncat,'')
        .replace(shablonsizeshort,'')
        //.replace(shablon34,'')
        .replace(shablonfit,'')
        .replace(shablonleft,'')
        .replace(shablonright,'')
        .replace(shablondot,'')
        //.replace(shablonpiza,'')
        .toLowerCase();

    shortname = shortname.slice(0,1).toUpperCase().concat(shortname.slice(1));

    this.mName = shortname;
    this.InitSelectors();

  }

  AvtoNumber(NewNumber: number) {
    this.mNumber = NewNumber;
  }


  
  //////// GET --- SET ////////
  
  public set mNumber(v : number) {
    this.form.patchValue({mNumber : v});
  }
  
  public set mName(v : string) {
    this.form.patchValue({mName : v});
  }
  

  public get mName() : string {
    return this.form.get("mName").value
  }

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
