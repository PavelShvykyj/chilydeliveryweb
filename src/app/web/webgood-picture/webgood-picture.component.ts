import { Observable, of } from 'rxjs';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { last, concatMap, tap } from 'rxjs/operators';


const PATH: string = "webgoodpicures";

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

  constructor(private storage: AngularFireStorage) { }

  ngOnInit() {
    if (this.name == undefined || this.name == "") {
      
    } else {
      this.downloadURL$ = of(this.name);
    }
  }

  UploadFile(event) {
    
    
    const file: File  = event.target.files[0];
    
    const filePath = `${PATH}/${file.name}`;
    const task = this.storage.upload(filePath,file);
    this.uploadPercent$ = task.percentageChanges();     
    this.downloadURL$ = task.snapshotChanges().pipe(
      last(),
      concatMap(() => this.storage.ref(filePath).getDownloadURL()),
      tap(URL => {this.FileUploaded.emit(URL)})
    );
  }
}
