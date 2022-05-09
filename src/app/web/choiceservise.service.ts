import { IOrder } from 'src/app/models/order';
import { map, tap, concatMap } from "rxjs/operators";
import { from, Observable, of } from "rxjs";
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { IONECGood } from "../models/onec.good";
import { AngularFireDatabase } from "@angular/fire/database";
import * as firebase from 'firebase/app';
import 'firebase/database';

@Injectable({
  providedIn: "root",
})
export class ChoiceService {
  private token: string;

  constructor(private http: HttpClient, private db: AngularFireDatabase) {}

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
    console.log("orderdata",orderdata);
    const customer  = orderdata.delivery.customer;

    const internalOrder  = {
      id:"",
      testMode:false,
      addres: customer.address.streetName+" "+customer.address.streetNumber,
      phone: customer.phone,
      comment: orderdata.delivery.comment,
      paytype: orderdata.payBy === "cash" ? "1": "2",

      cutlery:"",
      integrationid:orderdata._id,
      goods: [],
      externalid: "",
      creation: this.timestamp,

      filial:"",
      desk:"",

    }

    return internalOrder;
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

  GetProxyBlob(URL: string): Observable<Blob> {
    return this.http.get(URL, { responseType: "blob" });
  }

  OnOrdersClosed(data: firebase.database.DataSnapshot) {
    this.RemoveByID(data.val().data._id);
  }

  OnOrdersCreated(data: firebase.database.DataSnapshot) {
   // this.db.database.ref("orders").push(this.ConvertCoiceOrder(data.val()));



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


    queryclosed.on('child_added', this.OnOrdersClosed.bind(this));
    querycreated.on('child_added', this.OnOrdersCreated.bind(this));


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


    queryclosed.off('child_added');
    querycreated.off('child_added');


  }


}

