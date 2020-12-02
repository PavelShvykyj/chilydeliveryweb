import { IBaseGood } from './base.good';

export interface IMobileGood  {
    id: string | undefined,
    parentid:string | undefined,
    isFolder:boolean,
    mName: string,
    picture?:string,
    mCategory?:number,
    mNumber?:number,
    mDescription?:string
}

export interface IMobilePriceElement {
    id:string,
    price:number,
    bitmap:number,
    dirtyid:string[]
}

export interface IMobileData {
    id:string,
    parentid:string | undefined,
    isFolder:boolean,
    mCategory:number,
    mType:number,
    mNumber:number,
    mSize:number,
    mDescription:string,
    price:number
    bitmap?:number
    mName?:string,
    picture?:string,
    dirtyid:string[]
}



