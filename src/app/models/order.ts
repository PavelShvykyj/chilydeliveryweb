import { IBaseElement } from './base.good';

export interface IOrderGoodsRecord {
    id:string,
    quantity:number,
    comment:string
}

export interface IOrderOnecData {}

export interface IOrderChanges {
    type:string,
    order:IOrder
} 
export interface IOrder extends IBaseElement {
    addres:string,
    phone:string,
    creation:Date,
    filial:string,
    desk:string,
    
    comments:string[],
    goods: IOrderGoodsRecord[]


}