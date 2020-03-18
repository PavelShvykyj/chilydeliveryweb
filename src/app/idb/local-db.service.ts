
import { Observable, from, combineLatest, of, Subject } from 'rxjs';
import { map, filter, concatMap, first, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { IWEBGood } from '../models/web.good';
import { IONECGood } from '../models/onec.good';

@Injectable({
  providedIn: 'root'
})
export class LocalDBService {

  public lastupdateEventer:  Subject<Date> = new Subject<Date>();
  public lastupdate$ : Observable<Date> = this.lastupdateEventer.asObservable();

  constructor(private db: NgxIndexedDBService) { }

  DeleteDatabase(): Observable<any> {

    return from(this.db.deleteDatabase());
  }

  Sleep(time:number) {
    let promise = new Promise(reject => {

      setTimeout(() => {
        
        reject('tru');
      }, time);
    
    });

    return promise;
  }

  async GetAllGoodsByIndex(): Promise<{ goods: IWEBGood[], dirtygoods: IONECGood[] }>  {
    let goods: IWEBGood[] = [];
    let dirtygoods: IONECGood[] = [];
    let goodsdone:boolean = false;
    let dirtygoodsdone:boolean = false;


    await this.db.openCursorByIndex('WebGoods', 'sortdefoult', IDBKeyRange.lowerBound(""), (evt) => {
      let cursor = (<any>evt.target).result;
      if (cursor) {
        goods.push(cursor.value);
        cursor.continue();
      } else {
        goodsdone = true;
      }
    });
    
    await this.db.openCursorByIndex('DirtyGoods', 'sortdefoult', IDBKeyRange.lowerBound(""), (evt) => {
      let cursor = (<any>evt.target).result;
      if (cursor) {
        dirtygoods.push(cursor.value);
        cursor.continue();
      } else {
        dirtygoodsdone = true
      }
    });

    while (!goodsdone || !dirtygoodsdone) {
      await this.Sleep(100);
    }

    
    return {goods,dirtygoods};

  }


  GetAllGoods(): Observable<{ goods: IWEBGood[], dirtygoods: IONECGood[] }> {
    const indexDetails = {
      indexName: 'sortdefoult',
      order: 'desc'
    };

    this.db.indexedDB
    let webgoods$: Observable<IWEBGood[]> = from(this.db.getAll('WebGoods')) as Observable<IWEBGood[]>;
    let dirtywebgoods$: Observable<IONECGood[]> = from(this.db.getAll('DirtyGoods')) as Observable<IONECGood[]>;
    return combineLatest(webgoods$, dirtywebgoods$)
      .pipe(map(element => { return { goods: element[0], dirtygoods: element[1] } }), first())
  }

  async AddElement(element, name) {
    await this.db.add(name, element);
  }

  async DeleteElement(id, name) {
    await this.db.delete(name, id);
  }

  async UpdateElement(element, name, key) {
    await this.db.update(name, element, key)
  }


  async UpdateAllGoods(allgoods: { goods: IWEBGood[], dirtygoods: IONECGood[] }) {

    await this.db.clear('WebGoods');
    allgoods.goods.forEach(good => this.AddElement({ ...good, sortdefoult: (good.isFolder ? "A_" : "Z_") + good.name }, 'WebGoods'));
    await this.db.clear('DirtyGoods');
    allgoods.dirtygoods.forEach(good => this.AddElement({ ...good, sortdefoult: (good.isFolder ? "A_" : "Z_") + good.name }, 'DirtyGoods'));
    this.SetLastUpdate(new Promise(reject => { reject(new Date()) }));

  }

  async UpdateChanges(changes: { goods: IWEBGood[], dirtygoods: IONECGood[] }) {
    changes.goods.forEach(good => this.UpdateElement({ ...good, sortdefoult: (good.isFolder ? "A_" : "Z_") + good.name }, 'WebGoods', good.id));
    changes.dirtygoods.forEach(good => this.UpdateElement({ ...good, sortdefoult: (good.isFolder ? "A_" : "Z_") + good.name }, 'DirtyGoods', good.id));
    this.SetLastUpdate(new Promise(reject => reject(new Date())));
  }

  async SetLastUpdate(lastupdate: Promise<Date>) {
    const param: Date = await lastupdate;
    await this.db.clear('exchangeheader');
    const HeaderObj = { LastDownload: param };
    this.UpdateElement(HeaderObj, 'exchangeheader',1);
    this.lastupdateEventer.next(param);
  }

  async GetLastUpdate(): Promise<Date> {
    const lastupdate: {LastDownload:Date} = await this.db.getByKey('exchangeheader', 1);
    return lastupdate.LastDownload;
  }

  get DB() {
    return this.db.indexedDB
  }

}
