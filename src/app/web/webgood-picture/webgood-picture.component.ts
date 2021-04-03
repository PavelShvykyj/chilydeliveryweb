import { select } from '@ngrx/store';
import { Observable, of, combineLatest, from } from 'rxjs';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { last, concatMap, tap, map, take, filter } from 'rxjs/operators';
//import * as firebase from 'firebase/app';
//import 'firebase/storage';
//import { environment } from 'src/environments/environment';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';
import { SelectpictureComponent } from '../selectpicture/selectpicture.component';

import { pictitem, PictServiseService } from '../pict-servise.service';


const PATH: string = "webgoodpicures";
const METADATA = {
  cacheControl: 'public,max-age=2628000',
}


// firebase.initializeApp(environment.firebase);
// let fstorage = firebase.storage();

@Component({
  selector: 'webgood-picture',
  templateUrl: './webgood-picture.component.html',
  styleUrls: ['./webgood-picture.component.scss']
})
export class WebgoodPictureComponent implements OnInit {
  @Input() goodid: string | undefined;
  @Input() name: string | undefined;
  @Output() FileUploaded = new EventEmitter<string>();

  uploadPercent$: Observable<number>;
  downloadURL$: Observable<string>;
  fileList$: Observable<Array<pictitem>>;
  urls$: Observable<Array<string>>;

  constructor(private storage: AngularFireStorage,
    private dialog: MatDialog,
    private storegeservise: PictServiseService
  ) { }

  ngOnInit() {
    if (this.name == undefined || this.name == "") {
    } else {
      this.downloadURL$ = of(this.name);
    }
    this.urls$ = this.storegeservise.urls$;
    this.fileList$ = this.storegeservise.fileList$;
  }

  SelectFile(item) {
    let ref = this.storage.ref(`${PATH}/${item.name}`);
    ref.updateMetadata(METADATA).pipe(
      take(1)
    ).subscribe();
    this.downloadURL$ = ref.getDownloadURL().pipe(tap(res =>
      this.FileUploaded.emit(res as string)),
    );
  }

  Clear() {
    this.FileUploaded.emit("");
    this.downloadURL$ = of("");
  }

  UploadFile(event) {
    const file: File = event.target.files[0];
    const filePath = `${PATH}/${file.name}`;
    const task = this.storage.upload(filePath, file);
    this.uploadPercent$ = task.percentageChanges();
    this.downloadURL$ = task.snapshotChanges().pipe(
      last(),
      concatMap(() => this.storage.ref(filePath).updateMetadata(METADATA)),
      concatMap(() => this.storage.ref(filePath).getDownloadURL()),
      tap(URL => { this.FileUploaded.emit(URL) })
    );
  }

  UploadURL(src: string) {
    console.log("UploadURL", src);
    this.fileList$.pipe(
      map(items => {
        let item = items.find(el => el.name == src);
        
        return item.ref.fullPath;
      }),
      concatMap((path) => { this.storage.ref(path).updateMetadata(METADATA); return of(path) }),
      concatMap((path) => this.storage.ref(path).getDownloadURL()),
      tap(URL => {
        this.downloadURL$ = of(URL);
        this.FileUploaded.emit(URL)
      })
    ).subscribe();


  }

  Choise() {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.minHeight = "500px";
    dialogConfig.maxHeight = "500px";
    dialogConfig.minWidth = "30vw"


    const DialogRef: MatDialogRef<SelectpictureComponent> = this.dialog.open(SelectpictureComponent, dialogConfig);
    DialogRef.afterClosed().subscribe(res => {
      if (res.answer == '') {
        return;
      }


      this.UploadURL(res.answer);


    });

  }


}
