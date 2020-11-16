
import { IStreet } from './../models/street';
import { updateWebgoodByExternalData } from './../web/web.actions';
import { Store } from '@ngrx/store';

import { Observable, from, combineLatest, of, Subject } from 'rxjs';
import { map, filter, concatMap, first, tap, take } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { IWEBGood } from '../models/web.good';
import { IONECGood } from '../models/onec.good';
import { AppState } from '../reducers';

@Injectable({
  providedIn: 'root'
})
export class LocalDBService {

  public lastupdateEventer:  Subject<Date> = new Subject<Date>();
  public lastupdate$ : Observable<Date> = this.lastupdateEventer.asObservable();

  public errorIdCountEventer:  Subject<number> = new Subject<number>();
  public errorIdCount$ : Observable<number> = this.errorIdCountEventer.asObservable();


  constructor(private db: NgxIndexedDBService, private store : Store<AppState>) { }

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


  async GetAllStreetsByIndex() :Promise<IStreet[]> {
    return await this.db.getAll("Streets");
  }

  async GetWebGoodsByIndex() :Promise<IWEBGood[]> {
    return await this.db.getAll("WebGoods");

  }

  async GetAllGoodsByIndex(): Promise<{ goods: IWEBGood[], dirtygoods: IONECGood[] }>  {
    let goods: IWEBGood[] = [];
    let dirtygoods: IONECGood[] = [];
    let goodsdone:boolean = false;
    let dirtygoodsdone:boolean = false;


    await this.db.openCursorByIndex('WebGoods', 'sortdefoult', IDBKeyRange.lowerBound(""), (evt) => {
      let cursor = (<any>evt.target).result;
      if (cursor) {
        //console.log(cursor.value.name,cursor.value.id);
        const good : IWEBGood = {...cursor.value, picture: cursor.value.picture==undefined ? "" : cursor.value.picture  ,price: cursor.value.price==undefined ? 0 : cursor.value.price}
        goods.push(good);
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
    console.log(goods.length);
    
    return {goods,dirtygoods};

  }


  GetAllGoods(): Observable<{ goods: IWEBGood[], dirtygoods: IONECGood[] }> {


    
    let webgoods$: Observable<IWEBGood[]> = from(this.db.getAll('WebGoods')) as Observable<IWEBGood[]>;
    let dirtywebgoods$: Observable<IONECGood[]> = from(this.db.getAll('DirtyGoods')) as Observable<IONECGood[]>;
    return combineLatest(webgoods$, dirtywebgoods$)
      .pipe(map(element => { return { goods: element[0], dirtygoods: element[1] } }), take(1))
  }

  async AddElement(element, name) {
    console.log('AddElement',element, name);
    await this.db.add(name, element);
  }

  async DeleteElement(id, name) {
    await this.db.delete(name, id);
  }

  async UpdateElement(element, name) {
    console.log('UpdateElement',element, element.name);
    await this.db.update(name, element)
  }


  async UpdateAllGoods(allgoods: { goods: IWEBGood[], dirtygoods: IONECGood[] }) {

    await this.db.clear('WebGoods');
    allgoods.goods.forEach(good =>this.AddElement({ ...good, sortdefoult: (good.isFolder ? "A_" : "Z_") + good.name }, 'WebGoods'));
    await this.db.clear('DirtyGoods');
    allgoods.dirtygoods.forEach(good => this.AddElement({ ...good, sortdefoult: (good.isFolder ? "A_" : "Z_") + good.name }, 'DirtyGoods'));
    this.SetLastUpdate(new Promise(reject => { reject(new Date()) }));

  }

  async UpdateAllStreets(streets: IStreet[] ) {
    await this.db.clear('Streets');
    streets.forEach(street => this.AddElement(street,'Streets'));

  }
 

  async UpdateChanges(changes: { goods: IWEBGood[], dirtygoods: IONECGood[], webgoodsDeleted: IWEBGood[], dirtywebgoodsDeleted: IONECGood[] }) {
    
    changes.goods.forEach(good => this.UpdateElement({ ...good, sortdefoult: (good.isFolder ? "A_" : "Z_") + good.name }, 'WebGoods'));
    changes.dirtygoods.forEach(dgood => this.UpdateElement({ ...dgood, sortdefoult: (dgood.isFolder ? "A_" : "Z_") + dgood.name }, 'DirtyGoods'));
    changes.webgoodsDeleted.forEach(good => this.DeleteElement(good.id, 'WebGoods'));
    changes.dirtywebgoodsDeleted.forEach(dgood => this.DeleteElement(dgood.id, 'DirtyGoods'));
    
  }

  async SetLastUpdate(lastupdate: Promise<Date>) {
    const param: Date = await lastupdate;
    await this.db.clear('exchangeheader');
    const HeaderObj = { id:1, LastDownload: param };
    this.UpdateElement(HeaderObj, 'exchangeheader');
    console.log('SetLastUpdate');
    this.lastupdateEventer.next(param);
  }

  async GetLastUpdate(): Promise<Date> {
    const lastupdate: {LastDownload:Date} = await this.db.getByKey('exchangeheader', 1);
    return lastupdate.LastDownload;
  }

  async UpdateErrorIdsCount() {
    const erroCoutn = await this.db.count('LocaleChangedID');
    console.log('erroCoutn',erroCoutn);
    this.errorIdCountEventer.next(erroCoutn);
  }

  GetErrors() : Promise<any[]> {
    return this.db.getAll('LocaleChangedID');
  }

  get DB() {
    return this.db.indexedDB
  }

}
