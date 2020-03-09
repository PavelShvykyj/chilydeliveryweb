import { IWEBGood } from './web.good';
import { IBaseGood } from './base.good';

export interface IONECGood extends IBaseGood {
    filial: string
}

export interface IONECGoodWithOwner extends IONECGood {
    owner: IWEBGood[]
}