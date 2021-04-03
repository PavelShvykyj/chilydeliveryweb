import { from } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { chpict, pictitem } from './choise-pict'
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-selectpicture',
  templateUrl: './selectpicture.component.html',
  styleUrls: ['./selectpicture.component.scss']
})
export class SelectpictureComponent implements OnInit {

  picts : Array<pictitem> = chpict;
  fpicts : Array<pictitem> = chpict;
  filter : string = "";


  constructor(public dialogRef: MatDialogRef<SelectpictureComponent>) { }

  ngOnInit() {
  }


  select(src: string) {
    console.log('select', src);
    this.dialogRef.close({answer: src });
  }

  applyFilter(filter: string) {
    this.fpicts = [];
    if (filter=="") {
      this.fpicts = this.picts
      return;
    }
    const filterexp =  ".*"+this.filter.trim().toUpperCase().replace(/\s+/g, ".*")+".*";
    this.fpicts = this.picts.filter(el => el.name.toUpperCase().search(filterexp) !=-1);
  }

}
