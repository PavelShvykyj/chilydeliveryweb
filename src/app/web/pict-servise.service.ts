import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import * as firebase from 'firebase/app';
import 'firebase/storage';
import { combineLatest, from, Observable, of } from 'rxjs';
import { map, concatMap, share, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

const PATH: string = "webgoodpicures";
const METADATA = {
  cacheControl: 'public,max-age=2628000',
}
firebase.initializeApp(environment.firebase);
let fstorage = firebase.storage();

export interface pictitem {
  ref: firebase.storage.Reference
  name: string,
  idx: number
}


@Injectable({
  providedIn: 'root'
})
export class PictServiseService {
  private fileList: Array<pictitem>;
  private urls: Array<string>;
  constructor() {
    let temp = from(fstorage.ref(PATH).listAll()).pipe(
      take(1),
      map(res => {
        return res.items.map(el => { return { ref: el, name: el.name, idx: res.items.indexOf(el) } })
      }
      )
    )
    let temp2 = temp.pipe(
      take(1),
      concatMap(items => combineLatest(items.map(el => el.ref.getDownloadURL()))),
      share()
    );
    temp.subscribe(data => {
      this.fileList = data;
    });
    temp2.subscribe(data => this.urls = data);
  }

  public get fileList$(): Observable<Array<pictitem>> {
    return of(this.fileList)
  }
  public get urls$(): Observable<Array<string>> {
    return of(this.urls)
  }
}






