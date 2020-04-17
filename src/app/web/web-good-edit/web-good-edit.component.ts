import { IBaseGood } from './../../models/base.good';
import { IWEBGood, IWEBGoodWithFilials } from './../../models/web.good';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogConfig } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IONECGood } from 'src/app/models/onec.good';
import { SelectparentComponent } from '../selectparent/selectparent.component';

@Component({
  selector: 'app-web-good-edit',
  templateUrl: './web-good-edit.component.html',
  styleUrls: ['./web-good-edit.component.scss']
})
export class WebGoodEditComponent implements OnInit {
  form : FormGroup;
  
  

  constructor(
    public dialogRef: MatDialogRef<WebGoodEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data : {item: IWEBGoodWithFilials, parentel: IBaseGood},
    public dialog: MatDialog) { 


      this.form = new FormGroup({name: new FormControl(this.data.item.name,Validators.required),
        isFolder: new FormControl(this.data.item.isFolder),
        price: new FormControl(this.data.item.price==undefined? 0 : this.data.item.price)
       })  

    }

  ngOnInit() {
  }

  OnFilialDelete(filial) {
    this.data.item.filialElements.splice(this.data.item.filialElements.indexOf(filial),1)
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
      filials:this.data.item.filialElements.map(el => el.id)
    }
    this.dialogRef.close({answer: 'save', data : newversion });
  }

  Cancel() {
    this.dialogRef.close({answer: 'cancel'});
  }


}
