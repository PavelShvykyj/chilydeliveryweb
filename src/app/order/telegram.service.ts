
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { OrdersDatasourseService } from '../orders/orders.datasourse.service';
import { Itparams, Ichatparams } from '../models/telegram';



@Injectable({
  providedIn: 'root'
})
export class TelegramService {

  tparams : Itparams 
  baseURL : string = "https://api.telegram.org/bot"

  constructor(private http : HttpClient,
              private rtdb : OrdersDatasourseService) {
      this.GetParams();
      
   }

   private async GetParams() {
     this.tparams = await this.rtdb.GetTelegramParams();
     console.log('tparams',this.tparams);
   }

   SendMessage(filial:string,message:string) {
    
    let params = new HttpParams();
    params = params.append("chat_id", this.tparams[filial].chatid);
    params = params.append("text", message);
    params = params.append("parse_mode","HTML");
    
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    
    const url : string = this.baseURL+this.tparams[filial].apikey+"/sendMessage";
    
    
   
    this.http.get(url, { params: params }).toPromise().catch(err=>{
      console.log('telegram ', err)
    }).then(res=> {})


   }


}
