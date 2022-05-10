import { IDictionary } from './../models/order';
import { Dictionary } from '@ngrx/entity';
import { IOrder } from 'src/app/models/order';
import { map, tap, concatMap, first, filter } from "rxjs/operators";
import { from, Observable, of } from "rxjs";
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { IONECGood } from "../models/onec.good";
import { AngularFireDatabase } from "@angular/fire/database";
import * as firebase from 'firebase/app';
import 'firebase/database';
import { selectDirtyGoodsByIDS } from './web.selectors';
import { select, Store } from '@ngrx/store';
import { AppState } from '../reducers';
import { GetInitCutleryString } from '../order/reducers';

@Injectable({
  providedIn: "root",
})
export class ChoiceService {
  private token: string;

  constructor(private http: HttpClient,
              private db: AngularFireDatabase,
              private store: Store<AppState>
              ) {}

  get timestamp() {
    return firebase.database.ServerValue.TIMESTAMP;
  }

  ConvertCoiceMenu(choicemenu): Array<IONECGood> {
    let choicegoods: Array<IONECGood> = [];

    /// folders
    choicemenu.categories.forEach((element) => {
      choicegoods.push({
        id: element._id,
        externalid: element._id,
        isSelected: false,
        filial: "choice",
        name: element.name,
        parentid: undefined,
        isFolder: true,
      });
    });

    /// items
    choicemenu.menu.forEach((element) => {
      if (element.menuOptions.length === 0) {
        choicegoods.push({
          id: element._id,
          externalid: element._id,
          isSelected: false,
          filial: "choice",
          name: element.name
            .concat(" (")
            .concat((element.price as number) / 100)
            .concat("грн.)"),
          parentid: element.category,
          isFolder: false,
        });
      } else {
        element.menuOptions.forEach((optelement) => {
          optelement.list.forEach((listelement) => {
            choicegoods.push({
              id: listelement._id,
              externalid: listelement._id,
              isSelected: false,
              filial: "choice",
              name: element.name
                .concat(" ")
                .concat(listelement.name)
                .concat(" (")
                .concat((listelement.price as number) / 100)
                .concat("грн.)"),
              parentid: element.category,
              isFolder: false,
            });
          });
        });
      }
    });
    return choicegoods;
  }

  ConvertCoiceOrder(choiceorder) {
    const orderdata = choiceorder.data;
    const customer  = orderdata.delivery.customer;
    const internalOrder  = {
      id:"",
      testMode:false,
      addres: customer.address.streetName+" "+customer.address.streetNumber,
      phone: (customer.phone as string).slice(3),
      comment: orderdata.delivery.comment,
      paytype: orderdata.payBy === "cash" ? "1": "2",

      cutlery:GetInitCutleryString(),
      integrationid:orderdata._id,
      goods: [],
      externalid: "",
      creation: this.timestamp,
      filial:"",
      desk:"",

    }

    let ids = [];
    let idsData: IDictionary<number> = {};
    orderdata.items.forEach(dish => {
      if (dish.menuOptions!=null && dish.menuOptions.length !=0) {
        dish.menuOptions.forEach(opt=>{
          ids.push(opt._id);
          idsData[opt._id]= opt.count;
          });


      } else {
        ids.push(dish._id);
        idsData[dish._id]= dish.count;

      }
    });


    let allelements$ = this.store
    .pipe(select(selectDirtyGoodsByIDS,{ids,filialname:'choice'}),
    map(dirtygoods => {
      dirtygoods.forEach(dirtygood=> {
        internalOrder.goods.push({
          id:dirtygood.owner[0].id,
          comment:"",
          dirtyid:dirtygood.owner[0].filials,
          quantity:idsData.idwithq[dirtygood.id]
        })
      })
      let delta = internalOrder.goods.length - ids.length;
      if (delta != 0) {
        internalOrder.comment = "НЕ НАЙДЕНО ".concat(delta.toString())
                                             .concat(" ИЗ ")
                                             .concat(ids.length.toString())
                                             .concat(internalOrder.comment);
      }
      return internalOrder
    }

    ));

    return allelements$;
  }

  GetToken(): Observable<string> {
    if (this.token != undefined) {
      return of(this.token);
    } else {
      return from(
        this.db.database.ref("options/choicetoken").once("value")
      ).pipe(
        map((tokensnap) => tokensnap.val()),
        tap((token) => {
          this.token = token;
        })
      );
    }
  }

  DeleteOrders() {
    this.db.database.ref("choiceorders").remove();
  }

  GetAllGoods(): Observable<Array<IONECGood>> {
    // return of([]);

    // return this.GetToken().pipe(
    //   concatMap(token => {
    //     const uRL = 'https://open-api.choiceqr.com/menu/ua/full/list';
    //     const headers = new HttpHeaders({"Authorization": 'Bearer '+token});
    //     return this.http.get(uRL, {headers,observe:'body'});
    //   }),
    //   map(choicemenu=>  this.ConvertCoiceMenu(choicemenu))
    // )

    return this.GetToken().pipe(
      concatMap((token) => {
        const uRL = "http://localhost:3000/menu/ua/full/list";
        const headers = new HttpHeaders({ Authorization: "Bearer " + token });
        return this.http.get(uRL, { headers, observe: "body" });
      }),
      map((choicemenu) => this.ConvertCoiceMenu(choicemenu))
    );
  }

  GetOrderByID(id): Observable<any> {
    return this.GetToken().pipe(
      concatMap((token) => {
        const uRL = `http://localhost:3000/orders/${id}`;
        const headers = new HttpHeaders({ Authorization: "Bearer " + token });
        return this.http.get(uRL, { headers, observe: "body" });
      }),
      map((choiceorder) => this.ConvertCoiceOrder(choiceorder))
    );
  }

  RemoveByID(id:string) {
    this.db.database
      .ref("choiceorders")
      .orderByChild("data/_id")
      .equalTo(id)
      .once("value")
      .then((res) => {
        res.forEach((el) => {
          el.ref.remove();
        });
      });
  }

  GetProxyBlob(URL: string): Observable<any> {
    return this.http.get(URL, { responseType: "blob" });
  }

  OnOrdersClosed(data: firebase.database.DataSnapshot) {
    this.RemoveByID(data.val().data._id);
  }

  OnOrdersCreated(data: firebase.database.DataSnapshot) {
    /// сначала проверку на присутсвие потом конвертация

    from(
      this.db.database
      .ref("orders")
      .orderByChild('integrationid')
      .equalTo(data.val().data._id).once('value')
    ).pipe(
      map(res=> {return res.exists()}),
      filter(resexist=> !resexist),
      concatMap(()=>{return this.ConvertCoiceOrder(data.val())}),
      first()
    ).subscribe(orderdata=>{this.db.database.ref("orders").push(orderdata)});
  }

  OdrdersChangesStart() {
    const queryclosed = this.db.database
    .ref("choiceorders")
    .orderByChild("type")
    .equalTo("order.closed");

    const querycreated = this.db.database
    .ref("choiceorders")
    .orderByChild("type")
    .equalTo("order.created");

    const querycanseled = this.db.database
    .ref("choiceorders")
    .orderByChild("type")
    .equalTo("order.cancelled");

    const queryaccepted = this.db.database
    .ref("choiceorders")
    .orderByChild("type")
    .equalTo("order.accepted");


    queryclosed.on('child_added', this.OnOrdersClosed.bind(this));
    querycreated.on('child_added', this.OnOrdersCreated.bind(this));
    querycanseled.on('child_added', this.OnOrdersClosed.bind(this));
    queryaccepted.on('child_added', this.OnOrdersClosed.bind(this));

  }

  OdrdersChangesStop() {
    const queryclosed = this.db.database
    .ref("choiceorders")
    .orderByChild("type")
    .equalTo("order.closed");

    const querycreated = this.db.database
    .ref("choiceorders")
    .orderByChild("type")
    .equalTo("order.created");

    const queryaccepted = this.db.database
    .ref("choiceorders")
    .orderByChild("type")
    .equalTo("order.accepted");



    const querycanseled = this.db.database
    .ref("choiceorders")
    .orderByChild("type")
    .equalTo("order.cancelled");

    queryclosed.off('child_added');
    querycreated.off('child_added');
    querycanseled.off('child_added');
    queryaccepted.off('child_added');
  }

  //// if elements count > 100 delete first 100 (not all) можем все равно зацепить лишнее
  // this.db.database
  // .ref("choiceorders").once('value').then(res => {
  //   res.numChildren()
  // })
}

