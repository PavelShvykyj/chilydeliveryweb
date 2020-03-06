import { IWEBGood } from './../../models/web.good';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-web-good-edit',
  templateUrl: './web-good-edit.component.html',
  styleUrls: ['./web-good-edit.component.scss']
})
export class WebGoodEditComponent implements OnInit {
  form : FormGroup;
  

  constructor(
    public dialogRef: MatDialogRef<WebGoodEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data : {item: IWEBGood, parent: IWEBGood}, public dialog: MatDialog) { 

      

      this.form = new FormGroup({name: new FormControl(this.data.item.name,Validators.required),
        isFolder: new FormControl(this.data.item.isFolder)
       })  



    }

  ngOnInit() {
  }

}
