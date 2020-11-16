import { IMobileGood, IMobilePriceElement ,IMobileData } from './../models/mobile.good';
import { IWEBGood } from 'src/app/models/web.good';
import { Injectable } from '@angular/core';
import { LocalDBService } from '../idb/local-db.service';
import { AngularFireDatabase } from '@angular/fire/database';
import * as firebase from 'firebase/app';
import 'firebase/database';


function DataIsEqual(el:Object,uel:Object) : boolean {
  const kays = Object.keys(el);
  let isEqual = true;
  kays.forEach(key  => {
    isEqual = isEqual && (el[key]==uel[key]);
  });
  return isEqual;
}


function DefoultIfEMpty(val,defoult) : any {
  if (val == undefined) {
    return defoult
  } else {
    return val;
  }
}

function MDataBitMap(el:IMobileData| IWEBGood) : number {
  
  let result = 0;
  result = result | ((el.mType & 0b1111) << 17); // 21-18  mType - 4bit - parent 
  result = result | ((el.mType & 0b1111111111) << 7) // 17-8  mNumber - 10bit - num in type
  result = result | ((el.mCategory & 0b1111) << 3) // 7-4  mCategory - 4bit - Category (non-0)
  result = result | (el.mSize & 0b111)  // 3-1  mSize - 3bit - 50cm-3 40cm-2 30cm-1 non-0
  //console.log('bit map',result, result.toString(2));
  return result;
}


@Injectable({
  providedIn: 'root'
})
export class MobileService {

  constructor(private idb: LocalDBService, private fdb: AngularFireDatabase) { }

  async UpdateMobileData() : Promise<any>  {
    const shablonsize = new RegExp("\d\d\sСМ", 'g');
    const shablonsizeshort = new RegExp("\d\d\СМ", 'g');
    const shabloncat  = new RegExp("(ЦМ)", 'g');

    let WebGoods: IWEBGood[] = await this.idb.GetWebGoodsByIndex();
    
    let mData: IMobileData[] = WebGoods.filter(el => el.isFolder == false)
      .filter(el => el.mShowOnMobile == true)
      .map(el => { return {id:        el.id,
                           name:      el.name,
                           mCategory: DefoultIfEMpty(el.mCategory,0),
                           mType:     DefoultIfEMpty(el.mType,0),
                           mNumber:   DefoultIfEMpty(el.mNumber,0),
                           mSize:     DefoultIfEMpty(el.mSize,0),
                           price:     DefoultIfEMpty(el.price,0),
                           picture:   DefoultIfEMpty(el.picture,""),
                           bitmap:    MDataBitMap(el)
                          
                          } });

                              
      mData.map(el => 
      {
        el.name = el.name.toUpperCase().replace(shablonsize,"").replace(shabloncat,"").replace(shablonsizeshort,"")
      }
      );

    let mGoods : IMobileGood[] = [];
    let mPrice : IMobilePriceElement[] = [];
    
    mData.forEach(mdel => {
      mPrice.push({id: mdel.id, bitmap: mdel.bitmap, price: mdel.price });
      if (mGoods.find(mgel=> {return (mgel.mCategory == mdel.mCategory && mgel.mNumber == mdel.mNumber)}) == undefined) {
        mGoods.push({name: mdel.name,
          picture:mdel.picture,
          mCategory:mdel.mCategory,
          mNumber:mdel.mNumber})}});

    let tasks : Promise<any>[] = [];
    
    console.log('mGoods',mGoods.filter(el=> el.mCategory == 1));


    tasks.push(this.fdb.database.ref('goods').set(mGoods));
    tasks.push(this.fdb.database.ref('price').set(mPrice));      

    return Promise.all(tasks);

  }

}
