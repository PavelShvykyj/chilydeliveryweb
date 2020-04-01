import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { DialogstringinputComponent } from '../dialogstringinput/dialogstringinput.component';

@Component({
  selector: 'yndialog',
  templateUrl: './yndialog.component.html',
  styleUrls: ['./yndialog.component.scss']
})
export class YndialogComponent implements OnInit {

  
  title: string = "";
  content: string = "";

  constructor(
    public dialogRef: MatDialogRef<YndialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data : {title: string, content:string},
    public dialog: MatDialog) { 
      this.title = this.data.title;
      this.content = this.data.content;
    }

  ngOnInit() {
  }

  Answer(answer:boolean) {
    this.dialogRef.close({answer: answer});
  }


}
