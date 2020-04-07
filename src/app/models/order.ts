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
    goods: IOrderGoodsRecordWithDirty[]
}

export interface IOrder extends IBaseElement, IOrderHeader, IOrderOnecData {
    goods: IOrderGoodsRecord[]
}