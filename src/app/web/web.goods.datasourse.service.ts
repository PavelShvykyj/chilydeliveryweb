import { IWEBGood, IWEBGoodWithFilials } from './../models/web.good';
import { IFireBaseDirtyGood } from './../models/firebase.dirtygood';

import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { AngularFirestore } from '@angular/fire/firestore';
import { IONECGood } from '../models/onec.good';
import { IGoodsListDatasourse } from '../models/goods.list.datasourse';
import { Observable, BehaviorSubject, combineLatest, from } from 'rxjs';
import { map, filter, concatMap, first, tap } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { areAllWebGoodsLoaded } from './web.selectors';
import { AppState } from '../reducers';
import { environment } from 'src/environments/environment';
import { Update } from '@ngrx/entity';


// firebase.initializeApp(environment.firebase);
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



  constructor(private db: AngularFirestore, private store: Store<AppState>) { }

  GetList(parentID: string | undefined) {
    
    // this.store.pipe(
    //   select(areAllWebGoodsLoaded),
    //   filter(WebGoodsLoaded => {console.log("WebGoodsLoaded",WebGoodsLoaded);  return !WebGoodsLoaded} ),
    //   concatMap(WebGoodsLoaded => this.db.collection('web.goods').snapshotChanges().pipe(map(res => { console.log(res); return res.map(element  => {return {...(element.payload.doc.data() as object) ,isSelected:false, id:element.payload.doc.id}} ) as IWEBGood[];}   ))),
    //   first(),
    //   tap(res => this.dataEventer.next(res))
    //   ).subscribe();
  }

  GetAllGoods() : Observable<{goods: IWEBGood[], dirtygoods:IONECGood[]}> {

    const webgoods$ = this.db.collection('web.goods', ref => ref.orderBy("isFolder", 'desc').orderBy("name"))
    .snapshotChanges()
    .pipe(map(res =>
      {  
        return res.map(element  => { 
          return {...(element.payload.doc.data() as object),
                   isSelected:false, 
                   id:element.payload.doc.id}} ) as IWEBGood[];}),first());

    const dirtywebgoods$ = this.db.collection('onec.goods', ref => ref.orderBy("isFolder" , 'desc').orderBy("name"))
    .snapshotChanges()
    .pipe(map(res =>
      { 
        return res.map(element  => { 
          return {...(element.payload.doc.data() as object),
                  isSelected:false, 
                  id:element.payload.doc.id}} ) as IONECGood[];}),first());
                           

    return combineLatest(webgoods$,dirtywebgoods$)
    .pipe(map(element=> {return { goods: element[0], dirtygoods:element[1]}}),first())

  }

  UpdateByONEC(data: IONECGood) : Observable<IONECGood> {
   

   if(data.externalid=="" || data.externalid == undefined) {
    
    /// внешний код для фиребасе = внутренний от 1С  
    const dataToUpdate: IFireBaseDirtyGood = {
      externalid:data.id,
      parentid: data.parentid == undefined ? "" : data.parentid,
      isFolder:data.isFolder,
      name:data.name,
      filial:data.filial
    } 

    return from(this.db.collection('onec.goods').add(dataToUpdate)).pipe(map(docref => {return {...data,id:docref.id,externalid:data.id,isSelected:false}   } ));
   } else {

    const dataToUpdate: IFireBaseDirtyGood = {
      externalid:data.id,
      parentid:data.parentid == undefined ? "" : data.parentid,
      isFolder:data.isFolder,
      name:data.name,
      filial:data.filial
    } 

    
    return from(this.db.collection('onec.goods').doc(data.externalid).update(dataToUpdate)).pipe(map(() => {return {...data,id:data.externalid,externalid:data.id,isSelected:false}   } ));


   }
   
   
  }

  UpsertWebGood(webgood:IWEBGood): Observable<IWEBGood> {
   
   
    if(webgood.id==undefined|| webgood.id=="") {
      return from(this.db.collection('web.goods').add({
        name:webgood.name,
        parentid:webgood.parentid,
        isFolder:webgood.isFolder,
        filials:webgood.filials
        })).pipe(map(docref => { const newgood : IWEBGood = {...webgood, id:docref.id, isSelected:false}; return  newgood}))
    } else {
      return from(this.db.collection('web.goods').doc(webgood.id).update(webgood)).pipe(map(() => webgood))
    }


  }


}

