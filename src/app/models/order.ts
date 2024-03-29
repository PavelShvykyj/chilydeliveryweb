import { IBaseElement } from './base.good';
import { IWEBGood } from './web.good';

export interface IOrderGoodsRecord {
    id:string,
    quantity:number,
    comment:string
}

export interface IOrderGoodsRecordWithEntity extends IOrderGoodsRecord {
    good:IWEBGood
}

export interface IOrderGoodsWievRecordWithEntity extends IOrderGoodsRecordWithEntity,IWievRecord  {
}

export interface IWievRecord {
  EditCellName:string,
  NextCellEdit : string
}

export interface IOrderGoodsRecordWithDirty {
    id:string,
    dirtyid:string[],
    quantity:number,
    comment:string
}

export interface IOrderCommentRecord {
    id:string,
    comment:string
}

export interface  IOrderHeader {
    addres:string,
    phone:string,
    comment?:string,
    paytype?:string
}


export interface IOrderOnecData {
    creation:Date,
    filial:string,
    desk:string,


}

export interface IOrderChanges {
    type:string,
    order:IOrder
}

export interface IOrderWithDirty extends IBaseElement, IOrderHeader, IOrderOnecData {
    testMode: boolean,
    goods: IOrderGoodsRecordWithDirty[],
    cutlery?:string
}

export interface IOrder extends IBaseElement, IOrderHeader, IOrderOnecData {
  cutlery?:string,
  integrationid?:string,
  goods: IOrderGoodsRecord[]
}

export interface IOrderWithGoods extends IBaseElement, IOrderHeader, IOrderOnecData {
    goods: IOrderGoodsRecordWithEntity[]
}

export interface IOrderCutlery {
  id:string,
  name : string,
  quantity:number
}

export interface IOrderWievCutlery extends IOrderCutlery,IWievRecord  {


}

export interface IDictionary<TValue> {
  [id: string]: TValue;
}
