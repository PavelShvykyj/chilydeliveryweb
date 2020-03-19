import { AngularFirestore } from '@angular/fire/firestore';
import { Component, OnInit } from '@angular/core';
import { LocalDBService } from 'src/app/idb/local-db.service';
import { WebGoodsDatasourseService } from 'src/app/web/web.goods.datasourse.service';

@Component({
  selector: 'app-orders-exchange',
  templateUrl: './orders-exchange.component.html',
  styleUrls: ['./orders-exchange.component.css']
})
export class OrdersExchangeComponent implements OnInit {

  constructor(private idb : LocalDBService, private fbd: AngularFirestore ,private sfbd: WebGoodsDatasourseService) { }

  ngOnInit() {
  }

  DeleteLDB() {
    this.idb.DeleteDatabase().subscribe(()=> console.log('deleted'));
  }

  SetDate() {
    const d = new Date(2020,3,19,11,29,12) ;
  

    this.idb.SetLastUpdate(new Promise(reject=>{reject(d)}) );
  }

  ApdateModified() {
    const now : Date = new Date();
    this.idb.SetLastUpdate(new Promise(reject=>{reject(now)}) );
    this.sfbd.GetAllGoods().subscribe(goodsdata=> {
      goodsdata.goods.forEach(good => {
        this.fbd.collection('web.goods').doc(good.id).update({lastmodified: now})
        .catch(()=>console.log('err',good.id))
        .then(()=>console.log('Ok',good.id))
      }) 
      
      goodsdata.dirtygoods.forEach(good => {
        this.fbd.collection('onec.goods').doc(good.id).update({lastmodified: now})
        .catch(()=>console.log('err',good.id))
        .then(()=>console.log('Ok',good.id))
      }) 
    })

  }


}
