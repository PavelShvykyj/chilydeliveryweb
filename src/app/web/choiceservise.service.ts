import { map, tap, concatMap } from 'rxjs/operators';
import { from, Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IONECGood } from '../models/onec.good';
import { AngularFireDatabase } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class ChoiceService {

  private token : string;

  constructor(private http: HttpClient,
    private db: AngularFireDatabase
    ) { }

  ConvertCoiceMenu(choicemenu): Array<IONECGood> {
    let choicegoods : Array<IONECGood> = [];

    /// folders
    choicemenu.categories.forEach(element => {
      choicegoods.push({
        id:element._id,
        externalid: element._id,
        isSelected: false,
        filial: 'choice',
        name:element.name,
        parentid: undefined,
        isFolder:true,
      })
    });


    /// items
    choicemenu.menu.forEach(element => {

      if (element.menuOptions.length === 0)
      {
        choicegoods.push({
          id:element._id,
          externalid: element._id,
          isSelected: false,
          filial: 'choice',
          name:element.name.concat(" (")
                           .concat((element.price as number)/100)
                           .concat("грн.)"),
          parentid: element.category,
          isFolder:false
        });
      }
      else
      {
        element.menuOptions.forEach(optelement => {
          optelement.list.forEach(listelement=> {
            choicegoods.push({
              id: listelement._id,
              externalid: listelement._id,
              isSelected: false,
              filial: 'choice',
              name:  element.name.concat(" ")
                                 .concat(listelement.name)
                                 .concat(" (")
                                 .concat((listelement.price as number)/100)
                                 .concat("грн.)"),
              parentid: element.category,
              isFolder:false
            });
          });
        });
      }
  });
  return choicegoods;
}


  GetToken(): Observable<string> {
    if(this.token != undefined)
    {
      return of(this.token);
    }
    else
    {
      return from(this.db.database.ref('options/choicetoken').once('value')).pipe(
        map(tokensnap => tokensnap.val()),
        tap(token => {this.token = token})
      )
    }
  }

  DeleteOrders() {
    this.db.database.ref('choiceorders').remove();
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
      concatMap(token => {
        const uRL = 'http://localhost:3000/menu/ua/full/list';
        const headers = new HttpHeaders({"Authorization": 'Bearer '+token});
        return this.http.get(uRL, {headers,observe:'body'});
      }),
      map(choicemenu=>  this.ConvertCoiceMenu(choicemenu))
    )
  }


  GetCreated() {

    this.db.database.ref('choiceorders').orderByChild('data/_id').equalTo("6273dab238f43f74464d6a1e").once('value').then(
      res => {res.forEach(el => {
        console.log(el.val())
      })}
    )
  }
}


