import { IBaseGood } from './base.good';
import { IONECGood } from './onec.good';

export interface IWEBGood extends IBaseGood {
    price?:number,
    filials: string[]
}

export interface IWEBGoodWithFilials extends IWEBGood {
    filialNames: string[],
    filialElements: IONECGood[],
  }
  