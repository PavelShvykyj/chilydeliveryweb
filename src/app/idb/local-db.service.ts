import {  Observable, from, combineLatest } from 'rxjs';
import { map, filter, concatMap, first, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { IWEBGood } from '../models/web.good';
import { IONECGood } from '../models/onec.good';

@Injectable({
  providedIn: 'root'
})
export class LocalDBService {

  constructor(private db: NgxIndexedDBService) { }

  DeleteDatabase() : Observable<any> {
    
    return from(this.db.deleteDatabase()); 
  }

  GetAllGoods() : Observable<{ goods: IWEBGood[], dirtygoods: IONECGood[] }> {
    let webgoods$: Observable<IWEBGood[]> = from(this.db.getAll('WebGoods')) as Observable<IWEBGood[]>;
    let dirtywebgoods$: Observable<IONECGood[]> = from(this.db.getAll('DirtyGoods')) as Observable<IONECGood[]>;
    return combineLatest(webgoods$, dirtywebgoods$)
    .pipe(map(element => { return { goods: element[0], dirtygoods: element[1] } }), first())
  }

  async AddElement(element,name) {
    await this.db.add(name,element);
  }

  async DeleteElement(id,name) {
    await this.db.delete(name,id);
  }

  async UpdateElement(element,name) {
    await this.db.update(name,element)
  }


  async UpdateAllGoods(allgoods:{ goods: IWEBGood[], dirtygoods: IONECGood[] }) {

    await this.db.clear('WebGoods');
    allgoods.goods.forEach(good=> this.AddElement(good,'WebGoods'));
    await this.db.clear('DirtyGoods');
    allgoods.dirtygoods.forEach(good=> this.AddElement(good,'DirtyGoods'));
    await this.db.clear('exchangeheader');
    const HeaderOb = {LastDownload : new Date()}
    this.AddElement(HeaderOb,'exchangeheader')

    
  }

  get DB() {
    return this.db.indexedDB
  }

}
