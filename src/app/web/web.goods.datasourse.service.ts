import { IWEBGood, IWEBGoodWithFilials } from './../models/web.good';
import { IFireBaseDirtyGood } from './../models/firebase.dirtygood';

import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { AngularFirestore } from '@angular/fire/firestore';
import { IONECGood } from '../models/onec.good';
import { IGoodsListDatasourse } from '../models/goods.list.datasourse';
import { Observable, BehaviorSubject, combineLatest, from, of } from 'rxjs';
import { map, filter, concatMap, first, tap, catchError } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { areAllWebGoodsLoaded } from './web.selectors';
import { AppState } from '../reducers';
import { environment } from 'src/environments/environment';
import { Update } from '@ngrx/entity';
import { LocalDBService } from '../idb/local-db.service';





firebase.initializeApp(environment.firebase);


// const idfield = firebase.firestore.FieldPath.documentId();

@Injectable({
  providedIn: 'root'
})
export class WebGoodsDatasourseService implements IGoodsListDatasourse {

  private dataEventer: BehaviorSubject<IWEBGood[]> = new BehaviorSubject([]);
  public dataSourse$: Observable<IWEBGood[]> = this.dataEventer.asObservable();

  private fake: IWEBGood[] = [
    {
      isFolder: true,
      parentid: undefined,
      name: "fake folder 1",
      filials: [],
      id: "1",
      isSelected: false,
      externalid: undefined
    },

    {
      isFolder: true,
      parentid: undefined,
      name: "fake folder long long name 2",
      filials: [],
      id: "2",
      isSelected: false,
      externalid: undefined
    },

    {
      isFolder: false,
      parentid: undefined,
      name: "fake item 1 with long name пица ароматная большая ням ням",
      filials: ["vopak", "dastor"],
      id: "3",
      isSelected: false,
      externalid: undefined
    },

    {
      isFolder: false,
      parentid: undefined,
      name: "fake item 2",
      filials: ["vopak", "dastor", "luxor"],
      id: "4",
      isSelected: false,
      externalid: undefined
    }


  ]



  constructor(private db: AngularFirestore,
    private store: Store<AppState>,
    private idb: LocalDBService) { }


    get timestamp() {
      return firebase.firestore.FieldValue.serverTimestamp();
    }

  GetAllGoods(): Observable<{ goods: IWEBGood[], dirtygoods: IONECGood[] }> {

    const webgoods$ = this.db.collection('web.goods', ref => ref.orderBy("isFolder", 'desc').orderBy("name"))
      .snapshotChanges()
      .pipe(map(res => {
        return res.map(element => {
          return {
            ...(element.payload.doc.data() as object),
            isSelected: false,
            id: element.payload.doc.id
          }
        }) as IWEBGood[];
      }), first());

    const dirtywebgoods$ = this.db.collection('onec.goods', ref => ref.orderBy("isFolder", 'desc').orderBy("name"))
      .snapshotChanges()
      .pipe(map(res => {
        return res.map(element => {
          return {
            ...(element.payload.doc.data() as object),
            isSelected: false,
            id: element.payload.doc.id
          }
        }) as IONECGood[];
      }), first());


    return combineLatest(webgoods$, dirtywebgoods$)
      .pipe(
        map(element => { return { goods: element[0], dirtygoods: element[1] } }),
        first(),
        tap(allgoods => { this.idb.UpdateAllGoods(allgoods); return allgoods }))

  }


  
  GetAllChanges(lastupdate: Date): Observable<{ goods: IWEBGood[], dirtygoods: IONECGood[] }> {
    let mdate = lastupdate;
       
    
    const webgoods$ = this.db.collection('web.goods', ref => ref.where("lastmodified", ">", lastupdate))
      .snapshotChanges()
      .pipe(
        map(res => {

          return res.map(element => {
            
            const el:any = element.payload.doc.data() ;
            console.log('GetAllChanges web el',el);
            if (el.lastmodified!=undefined && el.lastmodified != null) {
              mdate = mdate > el.lastmodified.toDate() ? mdate : el.lastmodified.toDate();    
            } 
            
            return {
              ...(el),
              isSelected: false,
              id: element.payload.doc.id
            }
          }) as IWEBGood[];
        }),first());

    const dirtywebgoods$ = this.db.collection('onec.goods', ref => ref.where("lastmodified", ">=", lastupdate))
      .snapshotChanges()
      .pipe(map(res => {
        
        return res.map(element => {
          const el:any = element.payload.doc.data() ;
          if (el.lastmodified!=undefined && el.lastmodified != null) {
            mdate = mdate > el.lastmodified.toDate() ? mdate : el.lastmodified.toDate();    
          } 

          

          return {
            ...(element.payload.doc.data() as object),
            isSelected: false,
            id: element.payload.doc.id
          }
        }) as IONECGood[];
      }),first());


    return combineLatest(webgoods$, dirtywebgoods$)
      .pipe(
        map(element => { 
          
          console.log('lastupdate',lastupdate);
          
          if (mdate > lastupdate) {
            console.log('ask set LastUpdate',mdate);
            this.idb.SetLastUpdate(new Promise(reject => { reject(mdate) }));
          }
          
          return { goods: element[0], dirtygoods: element[1] } }),
        filter(changes => (changes.goods.length != 0 || changes.dirtygoods.length != 0)),
        tap(changes => {
          
          
          console.log('income changes', changes);
          this.idb.UpdateChanges(changes);
          return changes
        })

      );

  }


  UpsertWebGood(webgood: IWEBGood): Observable<IWEBGood> {
    
    //const lastupdate: Promise<Date> = this.idb.GetLastUpdate();

    //this.idb.SetLastUpdate(new Promise(reject => { reject(operationDate) }));

    if (webgood.id == undefined || webgood.id == "") {
      return from(this.db.collection('web.goods').add({
        name: webgood.name,
        parentid: webgood.parentid,
        isFolder: webgood.isFolder,
        filials: webgood.filials,
        lastmodified: this.timestamp
      })).pipe(
        
        catchError(e => { 
          //this.idb.SetLastUpdate(lastupdate);
          this.idb.UpdateElement(webgood, "WebGoods");
          this.idb.AddElement(webgood,'LocaleChangedID')
          this.idb.UpdateErrorIdsCount();
          console.log("ERRROR ON UPSERT ELEMENT",e);
          return Observable.throw(e) }),
        
        map(docref => {console.log('docref',docref); const newgood: IWEBGood = { ...webgood, id: docref.id, isSelected: false }; return newgood }),
        tap(newgood => { this.idb.AddElement(newgood, "WebGoods"); return newgood })
      )
    } else {
      return from(this.db.collection('web.goods').doc(webgood.id).update(
        {
          name: webgood.name,
          parentid: webgood.parentid,
          isFolder: webgood.isFolder,
          filials: webgood.filials,
          lastmodified: this.timestamp
        }
      )).pipe(
        catchError(e => { 
          //this.idb.SetLastUpdate(lastupdate);
          this.idb.UpdateElement(webgood, "WebGoods");
          this.idb.AddElement(webgood,'LocaleChangedID')
          this.idb.UpdateErrorIdsCount();
          console.log("ERRROR ON UPSERT ELEMENT",e);
          return Observable.throw(e) }),
        tap(() => this.idb.UpdateElement(webgood, "WebGoods")),
        map(() => webgood))
    }
  }

  DeleteWebGood(id: string) {
    const operationDate: Date = new Date();
    const lastupdate: Promise<Date> = this.idb.GetLastUpdate();
    this.idb.SetLastUpdate(new Promise(reject => { reject(operationDate) }));

    return from(this.db.collection('web.goods').doc(id).delete()).pipe(
      catchError(e => { this.idb.SetLastUpdate(lastupdate); return Observable.throw(e) }),
      tap(() => this.idb.DeleteElement(id, "WebGoods")),
      map(() => id));
  }

  /////////////////////////// DELETE THIS
  UpdateByONEC(data: IONECGood): Observable<IONECGood> {


    if (data.externalid == "" || data.externalid == undefined) {

      /// внешний код для фиребасе = внутренний от 1С  
      const dataToUpdate: IFireBaseDirtyGood = {
        externalid: data.id,
        parentid: data.parentid == undefined ? "" : data.parentid,
        isFolder: data.isFolder,
        name: data.name,
        filial: data.filial,
        lastmodified: new Date()
      }

      return from(this.db.collection('onec.goods').add(dataToUpdate)).pipe(map(docref => { return { ...data, id: docref.id, externalid: data.id, isSelected: false } }));
    } else {

      const dataToUpdate: IFireBaseDirtyGood = {
        externalid: data.id,
        parentid: data.parentid == undefined ? "" : data.parentid,
        isFolder: data.isFolder,
        name: data.name,
        filial: data.filial,
        lastmodified: new Date()
      }


      return from(this.db.collection('onec.goods').doc(data.externalid).update(dataToUpdate)).pipe(map(() => { return { ...data, id: data.externalid, externalid: data.id, isSelected: false } }));


    }


  }

  GetList(parentID: string | undefined) {

    // this.store.pipe(
    //   select(areAllWebGoodsLoaded),
    //   filter(WebGoodsLoaded => {console.log("WebGoodsLoaded",WebGoodsLoaded);  return !WebGoodsLoaded} ),
    //   concatMap(WebGoodsLoaded => this.db.collection('web.goods').snapshotChanges().pipe(map(res => { console.log(res); return res.map(element  => {return {...(element.payload.doc.data() as object) ,isSelected:false, id:element.payload.doc.id}} ) as IWEBGood[];}   ))),
    //   first(),
    //   tap(res => this.dataEventer.next(res))
    //   ).subscribe();
  }
}

