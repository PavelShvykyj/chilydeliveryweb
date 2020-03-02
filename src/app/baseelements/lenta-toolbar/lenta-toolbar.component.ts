import { ITolbarCommandsList } from './../../models/toolbar.commandslist';
import { IGoodsListDatasourse } from '../../models/goods.list.datasourse';
import { IWEBGood } from '../../models/web.good';
import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { IBaseGood } from '../../models/base.good';



interface ILentaElement extends IBaseGood {
  last: boolean,
  parity: boolean
}


@Component({
  selector: 'lenta-toolbar',
  templateUrl: './lenta-toolbar.component.html',
  styleUrls: ['./lenta-toolbar.component.scss']
})
export class LentaToolbarComponent implements OnInit {

  lenta: ILentaElement[] = [];
  @Input('dataSourse') dataSourse: IGoodsListDatasourse;
  @Input('toolbarcommands') toolbarcommands: ITolbarCommandsList[]=[];

  @Output('OnElementClicked') OnElementClicked = new EventEmitter<IBaseGood>();
  @Output('OnToolbarCommandClicked') OnToolbarCommandClicked = new EventEmitter<string>();


  @ViewChild(LentaToolbarComponent, {static: false})
  toolbar: LentaToolbarComponent;

  constructor() { }

  ngOnInit() {
    this.lenta = [];
  }

  AddElement(item: IBaseGood): void {
    if(item == undefined) {
      return
    }

    if (this.lenta.length == 0) {
      const LentaElement: ILentaElement = <ILentaElement>{
        parity: false,
        last: true,
        ...item
      }
      this.lenta.push(LentaElement);
      return;
    } else {
      const newElemnt: ILentaElement = <ILentaElement>{
        parity: !this.lenta[this.lenta.length-1].parity,
        last: true,
        ...item
      }
      this.lenta[this.lenta.length-1].last = false;
      this.lenta.push(newElemnt);
    }
    
  }

  ElementClicked(item: ILentaElement | undefined) {
    if(item == undefined) {
      this.lenta = [];
    } else {
      this.lenta.splice( this.lenta.indexOf(item)+1);
      if(this.lenta.length!=0) {
        this.lenta[this.lenta.length-1].last=true;
      }
    }
    
    this.OnElementClicked.emit(item); 
  }

  ToolbarCommandClicked(commandName:string) {
    
    this.OnToolbarCommandClicked.emit(commandName);
  } 


}
