import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';


@Component({
  selector: 'dialogstringinput',
  templateUrl: './dialogstringinput.component.html',
  styleUrls: ['./dialogstringinput.component.scss']
})
export class DialogstringinputComponent implements OnInit {

  answer: string;
  title: string = "";


  constructor(
    public dialogRef: MatDialogRef<DialogstringinputComponent>,
    @Inject(MAT_DIALOG_DATA) public data : {title: string, answer:string},
    public dialog: MatDialog) { 
      this.title = this.data.title;
      this.answer = this.data.answer;
    }

  ngOnInit() {
  }

  Answer() {
    this.dialogRef.close({answer: this.answer});
  }

  

}
