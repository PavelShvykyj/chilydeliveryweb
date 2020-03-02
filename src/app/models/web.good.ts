import { IBaseGood } from './base.good';

export interface IWEBGood extends IBaseGood {
    filials: string[]
}

export interface IWEBGoodWithFilials extends IWEBGood {
    filialNames: string[]
  }
  