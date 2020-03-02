import { element } from 'protractor';

import { IGoodsListDatasourse } from './../models/goods.list.datasourse';
import { Injectable } from '@angular/core';
import { IBaseGood } from '../models/base.good';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { IONECGood } from '../models/onec.good';
import { OptionState } from '../option.reducer';

@Injectable({
  providedIn: 'root'
})
export class OnecGoodsDatasourseService implements IGoodsListDatasourse{

  private dataEventer : BehaviorSubject<IONECGood[]> = new BehaviorSubject([]);
  public dataSourse$ : Observable<IONECGood[]> = this.dataEventer.asObservable();

  private fake : IONECGood[] = [
    {
      isFolder:true,
      parentid:undefined,
      name: "fake folder 1",
      filial: "vopak",
      id:"1",
      isSelected:false,
      externalid:""
    },

    {
      isFolder:true,
      parentid:undefined,
      name: "fake folder long long name 2",
      filial: "vopak",
      id:"2",
      isSelected:false,
      externalid:""
    },

    {
      isFolder:false,
      parentid:"1",
      name: "fake item 1 with long name пица ароматная большая ням ням",
      filial: "vopak",
      id:"3",
      isSelected:false,
      externalid:""
    },

    {
      isFolder:false,
      parentid:undefined,
      name: "МАЛИНОВА НАСТОЯНКА",
      filial: "vopak",
      id:"4",
      isSelected:false,
      externalid:""
    }


  ]

  constructor() {
    
    
    


   }

  GetList(parentID:string | undefined)  {
    if(xForm1C == undefined) {
      for (let index = 0; index < 500; index++) {
        const element = {
          isFolder:false,
          parentid:undefined,
          name: "fake item "+index,
          filial: "vopak",
          id:(4+index).toString(),
          isSelected:false,
          externalid:""
        }
        this.fake.push(element);
      }
      
      
      
      
      this.dataEventer.next(this.fake);
    } 
    else {
      const content: IONECGood[] =  JSON.parse(xForm1C.GetList(parentID)).goods;
      this.dataEventer.next(content);
    }
  }

  UpdateExternalId(onecid:string,externalid:string) : Observable<IONECGood>  {
    

    if(xForm1C==undefined) {
      
      const fakeitem = this.fake.filter(element => element.id == onecid)[0];
      fakeitem.externalid = externalid;
      return of(fakeitem);
    } else {
      const updatedGood : IONECGood = JSON.parse(xForm1C.UpdateExternalId(onecid,externalid))  ;
      return of(updatedGood)
  
    }


  


  }

  LoadOptions() : Observable<{options:OptionState}> {
    if(xForm1C == undefined) {
      return of({options:{filialname:"unknown"}});
    } else {
      const options : {options:OptionState} = JSON.parse(xForm1C.LoadOptions()) ;
      return of(options);
    }
  }

}
