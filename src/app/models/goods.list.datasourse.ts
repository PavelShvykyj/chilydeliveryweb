import { IBaseGood } from './base.good';
import { Observable } from 'rxjs';

export interface IGoodsListDatasourse {
    GetList(parentID:string | undefined) 
    dataSourse$ : Observable<IBaseGood[]>
}