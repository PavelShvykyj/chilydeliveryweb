import { environment } from './../../environments/environment';


import { Injectable } from '@angular/core';

import { Observable, from } from 'rxjs';
import { first, map } from 'rxjs/operators';

import { IWEBGood } from '../models/web.good';
import { IONECGood } from '../models/onec.good';




//firebase.initializeApp(environment.firebase);

@Injectable({
  providedIn: 'root'
})
export class FireService {

  constructor() { }

  // getWebGoods() : Observable<IWEBGood[]> {
  //   return this.db.collection('web.goods')
  //   .valueChanges().pipe(map(res =>{ 

  //     return res as IWEBGood[];
  //   } ))
  // }

  // getONECGoods(ids: string[] ):Observable<IONECGood[]>  {
  //   // console.log(id);
  //   // console.log(firebase.firestore.FieldPath.documentId());
  //   // let db = firebase.firestore();
  //   // db.collection('onec.goods').where(firebase.firestore.FieldPath.documentId() ,"==",id[0]).get().then(res => console.log(res));

  //   ///// 
  //   ///// firebase.firestore.FieldPath.documentId()
  //   ///// --- Это специальная функция из основного SDK (поэтому делаем импорт import * as firebase from 'firebase/app';)
  //   /////     предназначена для возможности запросов к самому ID документа просто указать "id" нельзя так как библиотека 
  //   /////     будет искать поле средиатрибутов документа 
  //   return this.db.collection('onec.goods', ref => ref.where(firebase.firestore.FieldPath.documentId() ,"in",ids))
  //     .valueChanges()
  //     .pipe(map(snap => {console.log(snap); return  snap.map(element => element as IONECGood)} ));
  // }

  // getONECGood(id: string): Observable<IONECGood> {
  //   const path : string = `onec.goods/${id}`;
  //   return this.db.doc(path).valueChanges().pipe(map(snap => snap as IONECGood));
    
    
    
  // }

}
