import { async } from '@angular/core/testing';
import { IWEBGood, IWEBGoodWithFilials } from './../models/web.good';
import { IFireBaseDirtyGood } from './../models/firebase.dirtygood';

import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { AngularFirestore, DocumentData, QuerySnapshot } from '@angular/fire/firestore';
import { IONECGood } from '../models/onec.good';
import { IGoodsListDatasourse } from '../models/goods.list.datasourse';
import { Observable, BehaviorSubject, combineLatest, from, of } from 'rxjs';
import { map, filter, concatMap, first, take, tap, catchError, share } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { areAllWebGoodsLoaded } from './web.selectors';
import { AppState } from '../reducers';
import { environment } from 'src/environments/environment';
import { Update } from '@ngrx/entity';
import { LocalDBService } from '../idb/local-db.service';
import { AngularFireStorage } from '@angular/fire/storage';





//firebase.initializeApp(environment.firebase);
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
    private idb: LocalDBService) { 
      

    }


  get timestamp() {
    return firebase.firestore.FieldValue.serverTimestamp();
  }

  GetAllGoods(): Observable<{ goods: IWEBGood[], dirtygoods: IONECGood[] }> {

    const webgoods$ = from(this.db.firestore.collection('web.goods').where("isDeleted","==",false).get())
      .pipe(map(res => {
        return res.docs.map(element => {
          return {
            ...(element.data() as object),
            isSelected: false,
            id: element.id,
            price: element.data().price==undefined ? 0 : element.data().price==undefined
          }
        }) as IWEBGood[];
      }), take(1), share());

    const dirtywebgoods$ = this.db.collection('onec.goods')
      .snapshotChanges()
      .pipe(map(res => {
        return res.map(element => {
          return {
            ...(element.payload.doc.data() as object),
            isSelected: false,
            id: element.payload.doc.id
          }
        }) as IONECGood[];
      }), take(1), share());


    return combineLatest(webgoods$, dirtywebgoods$)
      .pipe(
        map(element => { return { goods: element[0], dirtygoods: element[1] } }),
        take(1),

        tap(allgoods => { this.idb.UpdateAllGoods(allgoods); return allgoods }),
        share())

  }


  async GetWebChanges(lastupdate: Date): Promise<QuerySnapshot<DocumentData>> {
    return this.db.firestore.collection('web.goods')
      //.orderBy("lastmodified")
      .where("lastmodified",">",lastupdate).get()
  }

  async GetDirtyChanges(lastupdate: Date): Promise<QuerySnapshot<DocumentData>> {
    return this.db.firestore.collection('onec.goods')
      //.orderBy("lastmodified")
      .where("lastmodified",">",lastupdate).get()
  }

  async GetAllChangesAsync(lastupdate: Date): Promise<{
    goods: IWEBGood[],
    dirtygoods: IONECGood[],
    webgoodsDeleted: IWEBGood[],
    dirtywebgoodsDeleted: IONECGood[]
  }> {
    let mdate = lastupdate;
    let goods: IWEBGood[] = [];
    let dirtygoods: IONECGood[] = [];
    let webgoodsDeleted: IWEBGood[] = [];
    let dirtywebgoodsDeleted: IONECGood[] = [];

    const snapsgoods = await this.GetWebChanges(lastupdate);
    let changesgoods = snapsgoods.docs.map(snap => {
      const el: any = snap.data();
      if (el.lastmodified != undefined && el.lastmodified != null) {
        mdate = mdate > el.lastmodified.toDate() ? mdate : el.lastmodified.toDate();
      }
      return {
        ...(el),
        isSelected: false,
        id: snap.id
      }
    });

    const snapsdirty = await this.GetDirtyChanges(lastupdate);
    let changesdirty = snapsdirty.docs.map(snap => {
      const el: any = snap.data();

      if (el.lastmodified != undefined && el.lastmodified != null) {
        mdate = mdate > el.lastmodified.toDate() ? mdate : el.lastmodified.toDate();
      }
      return {
        ...(el),
        isSelected: false,
        id: snap.id
      }
    });

    goods = changesgoods.filter(good => good.isDeleted == false) as IWEBGood[];
    webgoodsDeleted = changesgoods.filter(good => good.isDeleted == true) as IWEBGood[];
    dirtygoods = changesdirty.filter(good => good.isDeleted == false) as IONECGood[];
    dirtywebgoodsDeleted = changesdirty.filter(good => good.isDeleted == true) as IONECGood[];

    if (mdate > lastupdate) {
      console.log('ask set LastUpdate', mdate);
      await this.idb.SetLastUpdate(new Promise(reject => { reject(mdate) }));
    }

    return new Promise(reject => reject({
      goods,
      webgoodsDeleted,
      dirtygoods,
      dirtywebgoodsDeleted
    }));


  }

  GetAllChanges(lastupdate: Date): Observable<{ goods: IWEBGood[], dirtygoods: IONECGood[], webgoodsDeleted: IWEBGood[], dirtywebgoodsDeleted: IONECGood[] }> {
    let mdate = lastupdate;


    const goodschanges$ = from(this.db.firestore.collection('web.goods')
      .orderBy("lastmodified")
      .startAfter(lastupdate).get())
      .pipe(map(snaps => {
        return snaps.docs.map(element => {
          const el: any = element.data();
          console.log('GetAllChanges web el', el);
          if (el.lastmodified != undefined && el.lastmodified != null) {
            mdate = mdate > el.lastmodified.toDate() ? mdate : el.lastmodified.toDate();
          }

          return {
            ...(el),
            isSelected: false,
            id: element.id
          }
        });
      }), take(1), share());

    const webgoods$ = goodschanges$.pipe(
      map(goods => goods.filter(good => good.isDeleted == false) as IWEBGood[]), take(1)
    );

    const webgoodsDeleted$ = goodschanges$.pipe(
      map(goods => goods.filter(good => good.isDeleted == true) as IWEBGood[]), take(1)
    );






    const dirtywebgoodsDeleted$ = this.db.collection('onec.goods', ref => ref.where('isDeleted', "==", true).where("lastmodified", ">", lastupdate))
      .stateChanges()
      .pipe(map(res => {

        return res.map(element => {
          const el: any = element.payload.doc.data();
          console.log('GetAllChanges web dirty delete el', el);
          if (el.lastmodified != undefined && el.lastmodified != null) {
            mdate = mdate > el.lastmodified.toDate() ? mdate : el.lastmodified.toDate();
          }

          return {
            ...(element.payload.doc.data() as object),
            isSelected: false,
            id: element.payload.doc.id
          }
        }) as IONECGood[];
      }), take(1));

    const dirtywebgoods$ = this.db.collection('onec.goods', ref => ref.where('isDeleted', "==", false).where("lastmodified", ">", lastupdate))
      .stateChanges()
      .pipe(map(res => {

        return res.map(element => {
          const el: any = element.payload.doc.data();
          console.log('GetAllChanges web dirty  el', el);
          if (el.lastmodified != undefined && el.lastmodified != null) {
            mdate = mdate > el.lastmodified.toDate() ? mdate : el.lastmodified.toDate();
          }



          return {
            ...(element.payload.doc.data() as object),
            isSelected: false,
            id: element.payload.doc.id
          }
        }) as IONECGood[];
      }), take(1));

    return combineLatest(webgoods$, dirtywebgoods$, webgoodsDeleted$, dirtywebgoodsDeleted$)
      .pipe(
        map(element => {

          console.log('lastupdate', lastupdate);

          if (mdate > lastupdate) {
            console.log('ask set LastUpdate', mdate);
            this.idb.SetLastUpdate(new Promise(reject => { reject(mdate) }));
          }

          return { goods: element[0], dirtygoods: element[1], webgoodsDeleted: element[2], dirtywebgoodsDeleted: element[3] }
        }),
        filter(changes => (changes.goods.length != 0 ||
          changes.dirtygoods.length != 0 ||
          changes.webgoodsDeleted.length != 0 ||
          changes.dirtywebgoodsDeleted.length != 0
        )),
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
        price:webgood.price,
        mCategory: webgood.mCategory,
        mType: webgood.mType,
        mShowOnMobile: webgood.mShowOnMobile,
        mNumber: webgood.mNumber,
        mSize: webgood.mSize,
        mName: webgood.mName,
        parentid: webgood.parentid,
        isFolder: webgood.isFolder,
        filials: webgood.filials,
        picture:"",
        isDeleted: false,
        lastmodified: this.timestamp
      })).pipe(

        catchError(e => {
          //this.idb.SetLastUpdate(lastupdate);
          this.idb.UpdateElement(webgood, "WebGoods");
          this.idb.AddElement(webgood, 'LocaleChangedID')
          this.idb.UpdateErrorIdsCount();
          console.log("ERRROR ON UPSERT ELEMENT", e);
          return Observable.throw(e)
        }),

        map(docref => { console.log('docref', docref); const newgood: IWEBGood = { ...webgood, id: docref.id, isSelected: false }; return newgood }),
        tap(newgood => { this.idb.AddElement({...newgood, sortdefoult: (newgood.isFolder ? "A_" : "Z_") + newgood.name}, "WebGoods"); return newgood })
      )
    } else {
      return from(this.db.collection('web.goods').doc(webgood.id).update(
        {
          name: webgood.name,
          price:webgood.price,
          parentid: webgood.parentid,
          isFolder: webgood.isFolder,
          filials: webgood.filials,
          picture: webgood.picture,
          mCategory: webgood.mCategory,
          mType: webgood.mType,
          mSize: webgood.mSize,
          mName: webgood.mName,
          mShowOnMobile: webgood.mShowOnMobile,
          mNumber: webgood.mNumber,
          isDeleted: false,
          lastmodified: this.timestamp
        }
      )).pipe(
        catchError(e => {
          //this.idb.SetLastUpdate(lastupdate);
          this.idb.UpdateElement(webgood, "WebGoods");
          this.idb.AddElement(webgood, 'LocaleChangedID')
          this.idb.UpdateErrorIdsCount();
          console.log("ERRROR ON UPSERT ELEMENT", e);
          return Observable.throw(e)
        }),
        tap(() => this.idb.UpdateElement(webgood, "WebGoods")),
        map(() => webgood))
    }
  }

  DeleteWebGood(id: string) {

    return from(this.db.collection('web.goods').doc(id).update({
      isDeleted: true,
      lastmodified: this.timestamp
    })).pipe(
      catchError(e => { console.log("ERROR on set delete mark in firebase", id); return Observable.throw(e) }),
      // из локальной базы удалим когда прийдет подтвеждение с сервера в UpdateChanges
      // в отличии от обновления когда в локальную базу можно и записать
      //tap(() => this.idb.DeleteElement(id, "WebGoods")),
      map(() => id));
  }

  Audit(collectionname: string): Observable<any> {
    return this.db.collection(collectionname).auditTrail();
  }

  /////////////////////////// DELETE THIS
  UpdateByONEC(data: IONECGood): Observable<IONECGood> {


    return of({
      id: "",
      name: "",
      isSelected: false,
      parentid: "",
      isFolder: false,
      filial: "",
      externalid: ""
    });
    // if (data.externalid == "" || data.externalid == undefined) {

    //   /// внешний код для фиребасе = внутренний от 1С  
    //   const dataToUpdate: IFireBaseDirtyGood = {
    //     externalid: data.id,
    //     parentid: data.parentid == undefined ? "" : data.parentid,
    //     isFolder: data.isFolder,
    //     name: data.name,
    //     filial: data.filial,
    //     lastmodified: new Date()
    //   }

    //   return from(this.db.collection('onec.goods').add(dataToUpdate)).pipe(map(docref => { return { ...data, id: docref.id, externalid: data.id, isSelected: false } }));
    // } else {

    //   const dataToUpdate: IFireBaseDirtyGood = {
    //     externalid: data.id,
    //     parentid: data.parentid == undefined ? "" : data.parentid,
    //     isFolder: data.isFolder,
    //     name: data.name,
    //     filial: data.filial,
    //     lastmodified: new Date()
    //   }


    //   return from(this.db.collection('onec.goods').doc(data.externalid).update(dataToUpdate)).pipe(map(() => { return { ...data, id: data.externalid, externalid: data.id, isSelected: false } }));


    //}


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

