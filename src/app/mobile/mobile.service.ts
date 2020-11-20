import { element } from 'protractor';

import { IMobileGood, IMobilePriceElement ,IMobileData } from './../models/mobile.good';
import { IWEBGood } from 'src/app/models/web.good';
import { Injectable } from '@angular/core';
import { LocalDBService } from '../idb/local-db.service';
import { AngularFireDatabase } from '@angular/fire/database';
import * as firebase from 'firebase/app';
import 'firebase/database';
import {  Observable, of, from } from 'rxjs';


function DataIsEqual(el:Object,uel:Object) : boolean {
  const kays = Object.keys(el);
  let isEqual = true;
  kays.forEach(key  => {
    isEqual = isEqual && (el[key]==uel[key]);
  });
  return isEqual;
}


export function DefoultIfEMpty(val,defoult) : any {
  if (val == undefined || val == 0 || val =="" || val == null) {
    return defoult
  } else {
    return val;
  }
}

export function MDataBitMap(el:IMobileData| IWEBGood) : number {
  
  let result = 0;
  result = result | ((el.mType & 0b1111) << 17); // 21-18  mType - 4bit - parent 
  result = result | ((el.mType & 0b1111111111) << 7) // 17-8  mNumber - 10bit - num in type
  result = result | ((el.mCategory & 0b1111) << 3) // 7-4  mCategory - 4bit - Category (non-0)
  result = result | (el.mSize & 0b111)  // 3-1  mSize - 3bit - 50cm-3 40cm-2 30cm-1 non-0
  //console.log('bit map',result, result.toString(2));
  return result;
}

function CompareByNumberCategory(el1:IMobileGood,el2:IMobileGood): number {
  if (el1.mCategory>el2.mCategory)  {
    return 1;
  }

  if (el1.mCategory==el2.mCategory) {
    if (el1.mNumber>el2.mNumber) {
      return 1;
    }
    if (el1.mNumber==el2.mNumber) {
      return 0;
    }
    if (el1.mNumber<el2.mNumber) {
      return -1;
    }
  }

  if (el1.mCategory<el2.mCategory) {
    return -1;
  }
}

@Injectable({
  providedIn: 'root'
})
export class MobileService {

  constructor(private idb: LocalDBService, private fdb: AngularFireDatabase) { }

  async UpdateMobileData() : Promise<any>  {

    let WebGoods: IWEBGood[] = await this.idb.GetWebGoodsByIndex();
    
    let mData: IMobileData[] = WebGoods.filter(el => el.mShowOnMobile == true)
      .map(el => { return {id:        el.id,
                           isFolder:  el.isFolder,
                           parentid:  DefoultIfEMpty(el.parentid,""),
                           mName:     DefoultIfEMpty(el.mName,el.name),
                           mCategory: DefoultIfEMpty(el.mCategory,0),
                           mType:     DefoultIfEMpty(el.mType,0),
                           mNumber:   DefoultIfEMpty(el.mNumber,0),
                           mSize:     DefoultIfEMpty(el.mSize,0),
                           price:     DefoultIfEMpty(el.price,0),
                           picture:   DefoultIfEMpty(el.picture,""),
                           bitmap:    MDataBitMap(el)
                          
                          } });

                              

    let mGoods : IMobileGood[] = [];
    let mPrice : IMobilePriceElement[] = [];
    let mGoodElement: IMobileGood ;
    let mGoodIndex: number ;                      
 
    let Folders = mData.filter(el=> el.isFolder);
    Folders.forEach(mdel =>{
      mGoods.push(
        {
        mName: mdel.mName,
        picture:mdel.picture,
        mCategory:mdel.mCategory,
        mNumber:mdel.mNumber,
        isFolder:mdel.isFolder,
        parentid:mdel.parentid,
        id: mdel.isFolder ? mdel.id : ""
    })});

    let elements = mData.filter(el=> !el.isFolder);


    elements.forEach(mdel => {
          
        mPrice.push({id: mdel.id, bitmap: mdel.bitmap, price: mdel.price });
        
        mGoodElement = mGoods.find(mgel=> {return (mgel.mCategory == mdel.mCategory && mgel.mNumber == mdel.mNumber)})
        
        if (mGoodElement == undefined) {
          ///// ЕЩЕ Такого не было просто добавляем
          mGoods.push(
            {
            mName: mdel.mName,
            picture:mdel.picture,
            mCategory:mdel.mCategory,
            mNumber:mdel.mNumber,
            isFolder:mdel.isFolder,
            parentid: Folders.find(el => el.id==mdel.parentid)!=undefined ? mdel.parentid : ""  ,
            id:  ""
          })
        } 
        else {
            //// перезаполним картинку и имя по аналогу если не пустые
            mGoodIndex = mGoods.indexOf(mGoodElement);
            const  newEl : IMobileGood  = {...mGoodElement,
              picture : mGoodElement.picture == "" &&  mdel.picture != "" ? mdel.picture : mGoodElement.picture,
              mName :   mdel.mName != "" ? mdel.mName : mGoodElement.mName,
              parentid: mGoodElement.parentid == "" ? mdel.parentid : mGoodElement.parentid 

             }
            mGoods[mGoodIndex] = newEl;
        }
    
       
      

        
      });

    console.log('piza ',mGoods.filter(el => {return el.mCategory==1}));  

    let tasks : Promise<any>[] = [];
    
    mGoods.sort((el1,el2)=> CompareByNumberCategory(el1,el2));

    tasks.push(this.fdb.database.ref('goods').set(mGoods));
    tasks.push(this.fdb.database.ref('price').set(mPrice));      

    return Promise.all(tasks);

  }

  DeleteMobileElement(webelement : IWEBGood) : Observable<any> {


    let mGood : IMobileGood = {mName: webelement.mName,
      picture:webelement.picture,
      mCategory:webelement.mCategory,
      mNumber:webelement.mNumber,
      isFolder:webelement.isFolder,
      parentid:webelement.parentid,
      id:webelement.id
      };


    let mPrice : IMobilePriceElement = {id: webelement.id,
                                        bitmap: MDataBitMap(webelement),
                                        price: webelement.price };

    //let refGood  =  this.fdb.database.ref('goods').orderByChild('mCategory').equalTo(webelement.mCategory).orderByChild('mNumber').equalTo(webelement.mNumber).limitToFirst(1).ref;
    let refPrice =  this.fdb.database.ref('price').orderByChild('id').equalTo(webelement.id).limitToFirst(1).ref;
    return from(refPrice.remove());
      

  }  


  UpdateMobileElement(webelement : IWEBGood) : Observable<any> {
    let mGood : IMobileGood = {mName: webelement.mName,
      picture:webelement.picture,
      mCategory:webelement.mCategory,
      mNumber:webelement.mNumber,
      isFolder:webelement.isFolder,
      parentid:webelement.parentid,
      id:webelement.id

    };


    let mPrice : IMobilePriceElement = {id: webelement.id,
                                        bitmap: MDataBitMap(webelement),
                                        price: webelement.price };


    let tasks : Promise<any>[] = [];  
    let refGood  =  this.fdb.database.ref('goods').orderByChild('mCategory').equalTo(webelement.mCategory).orderByChild('mNumber').equalTo(webelement.mNumber).limitToFirst(1).ref;
    let refPrice =  this.fdb.database.ref('price').orderByChild('id').equalTo(webelement.id).limitToFirst(1).ref;
    
    
    tasks.push(refGood.update(mGood));
    tasks.push(refPrice.update(mPrice));
    
    return from(Promise.all(tasks));


  }


}
