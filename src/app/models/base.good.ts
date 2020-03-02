export interface IBaseGood {
    name:string,
    parentid:string | undefined,
    isFolder:boolean,
    id:string,
    externalid:string | undefined,
    isSelected:boolean
}