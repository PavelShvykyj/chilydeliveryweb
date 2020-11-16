import { IBaseGood } from './base.good';

export interface IMobileGood  {
    name: string,
    picture?:string,
    mCategory?:number,
    mNumber?:number
}

export interface IMobilePriceElement {
    id:string,
    price:number,
    bitmap:number
}

export interface IMobileData {
    id:string,
    mCategory:number,
    mType:number,
    mNumber:number,
    mSize:number,
    price:number
    bitmap?:number
    name?:string,
    picture?:string
}



