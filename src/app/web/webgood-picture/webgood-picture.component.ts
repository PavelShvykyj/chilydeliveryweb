import { select } from '@ngrx/store';
import {  Observable, of, combineLatest, from } from 'rxjs';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { last, concatMap, tap, map, take } from 'rxjs/operators';
import * as firebase from 'firebase/app';
import 'firebase/storage';
import { environment } from 'src/environments/environment';


const PATH: string = "webgoodpicures";
const METADATA = {
  cacheControl: 'public,max-age=2628000',
}


firebase.initializeApp(environment.firebase);
let fstorage = firebase.storage();

@Component({
  selector: 'webgood-picture',
  templateUrl: './webgood-picture.component.html',
  styleUrls: ['./webgood-picture.component.scss']
})
export class WebgoodPictureComponent implements OnInit {
  @Input() goodid : string | undefined;
  @Input() name : string | undefined;
  @Output() FileUploaded = new EventEmitter<string>();

  uploadPercent$: Observable<number>;
  downloadURL$: Observable<string>;
  fileList$ = from(fstorage.ref(PATH).listAll()).pipe( map(res=> {
    return res.items.map(el =>  { return {ref: el, name: el.name, idx: res.items.indexOf(el)}})
  }))

  urls$ = this.fileList$.pipe( concatMap(items => combineLatest(items.map(el => el.ref.getDownloadURL() ))))

  constructor(private storage: AngularFireStorage) { }

  ngOnInit() {
   
    
    
    if (this.name == undefined || this.name == "") {
      
    } else {
      this.downloadURL$ = of(this.name);
    }
  }

 

  SelectFile(item) {
    

    let ref = this.storage.ref(`${PATH}/${item.name}`);

    let fref = fstorage.ref(`${PATH}/${item.name}`);
    fref.updateMetadata(METADATA).then(res => console.log(res));

    this.downloadURL$ = ref.getDownloadURL().pipe(tap(res=>
      
      this.FileUploaded.emit(res as string)),
      
      );
  }  
  
  Clear() {
    this.FileUploaded.emit("");
    this.downloadURL$ = of("");
  }

  UploadFile(event) {
    const file: File  = event.target.files[0];
    const filePath = `${PATH}/${file.name}`;
    const task = this.storage.upload(filePath,file);
    this.uploadPercent$ = task.percentageChanges();     
    this.downloadURL$ = task.snapshotChanges().pipe(
      last(),
      concatMap(() => this.storage.ref(filePath).updateMetadata(METADATA)),
      concatMap(() => this.storage.ref(filePath).getDownloadURL()),
      tap(URL => {this.FileUploaded.emit(URL)})
    );
  }
}
