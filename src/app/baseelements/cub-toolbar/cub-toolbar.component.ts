
import { ITolbarCommandsList } from './../../models/toolbar.commandslist';
import { IGoodsListDatasourse } from '../../models/goods.list.datasourse';
import { IWEBGood } from '../../models/web.good';
import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { IBaseGood } from '../../models/base.good';
import { ILentaElement } from '../lenta-toolbar/lenta-toolbar.component';

@Component({
  selector: 'cub-toolbar',
  templateUrl: './cub-toolbar.component.html',
  styleUrls: ['./cub-toolbar.component.scss']
})
export class CubToolbarComponent implements OnInit {

  lenta: ILentaElement[] = [];
  @Input('dataSourse') dataSourse: IGoodsListDatasourse;
  @Input('toolbarcommands') toolbarcommands: ITolbarCommandsList[]=[];

  @Output('OnElementClicked') OnElementClicked = new EventEmitter<IBaseGood>();
  @Output('OnToolbarCommandClicked') OnToolbarCommandClicked = new EventEmitter<string>();


  @ViewChild(CubToolbarComponent, {static: false})
  toolbar: CubToolbarComponent;

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

  GetColumsQuont() {
    const LentaLenth = this.lenta.length;

    if (LentaLenth <= 1) {
      return 1
    } else if(LentaLenth >= 2 && LentaLenth <= 4) {
      return 2
    } else if(LentaLenth > 4 && LentaLenth <= 6) {
      return 3
    } else {
      return 4
    }
  }

}
