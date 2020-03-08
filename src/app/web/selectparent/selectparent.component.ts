import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { WebFolderListComponent } from '../web.folder.list/web.folder.list.component';

@Component({
  selector: 'app-selectparent',
  templateUrl: './selectparent.component.html',
  styleUrls: ['./selectparent.component.scss']
})
export class SelectparentComponent implements OnInit {


  @ViewChild(WebFolderListComponent, {static: false})
  folderlist: WebFolderListComponent;

  constructor(public dialogRef: MatDialogRef<SelectparentComponent>) { }

  ngOnInit() {
  }

  Save() {
    this.dialogRef.close({answer: 'save', data : this.folderlist.GetCurrentParent() });
  }

  Cancel() {
    this.dialogRef.close({answer: 'cancel'});
  }


}
