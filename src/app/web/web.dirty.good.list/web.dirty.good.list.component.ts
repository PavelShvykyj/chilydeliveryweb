import { IONECGood } from './../../models/onec.good';
import { selectDirtyGoodsByParent, selectDirtyGoodByName, selectDirtyGoodBySelection } from './../web.selectors';
import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { WebGoodsDatasourseService } from '../web.goods.datasourse.service';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/reducers';
import { Observable } from 'rxjs';
import { ITolbarCommandsList } from 'src/app/models/toolbar.commandslist';
import { IBaseGood } from 'src/app/models/base.good';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Update } from '@ngrx/entity';
import {  statusDirtyWebSelectedGanged } from '../web.actions';
import { map, first, tap } from 'rxjs/operators';
import { CubToolbarComponent } from 'src/app/baseelements/cub-toolbar/cub-toolbar.component';





@Component({
  selector: 'webdirtygoodlist',
  templateUrl: './web.dirty.good.list.component.html',
  styleUrls: ['./web.dirty.good.list.component.scss']
})
export class WebDirtyGoodListComponent implements OnInit {

  @ViewChild(CubToolbarComponent, {static: false})
  toolbar: CubToolbarComponent;

  @Input('filialname')
  filialname : string = ""

  elements$ : Observable<IONECGood[]>; 
  allelements$ : Observable<IONECGood[]>; 
  selectedelements$ : Observable<IONECGood[]>; 
  blocklenth:number = 20;
  startindex:number = 0;
  blocks:number[] = [0];


  toolbarcommands : ITolbarCommandsList[] = [
    {
      commandName: "refresh",
      buttonName:"",
      iconeName:'refresh'
    },

    {
      commandName: "difference",
      buttonName:"",
      iconeName:'call_split'
    }
  ]

  NameFilterValue:string="";


  constructor(public ds : WebGoodsDatasourseService, private store: Store<AppState>) { }

  ngOnInit() {
    console.log(this.filialname);
    this.allelements$ = this.store.pipe(select(selectDirtyGoodsByParent,{parentid:undefined,filialname:this.filialname}));
    this.selectedelements$ = this.store.pipe(select(selectDirtyGoodBySelection,{filialname:this.filialname})); 
    this.UpdateGoodsview();
  }

  OnGoodClicked(item: IONECGood) {
    if(item.isFolder) {
      //this.ds.GetList(item.id);
      this.allelements$ = this.store.pipe(select(selectDirtyGoodsByParent,{parentid:item.id,filialname:this.filialname})); 
      this.toolbar.AddElement(item);
      this.UpdateGoodsview();
    } else {
     
    }

  }

  AskForChangeSelection(id:string,status:boolean) {
    const update : Update<IONECGood> = {
      id:id,
      changes:{isSelected:status}
    }
    this.store.dispatch(statusDirtyWebSelectedGanged({update}));
  }

  OnGoodCheked(event:MatCheckboxChange,item: IONECGood) {
    console.log('fl-change',item.name,event.checked);
    this.store.pipe(select(selectDirtyGoodBySelection,{filialname:this.filialname}),
    first(),
    tap(goods => {goods.forEach(good => this.AskForChangeSelection(good.id,false));}),
    tap(()=>this.AskForChangeSelection(item.id,event.checked))).subscribe();
    this.AskForChangeSelection(item.id,event.checked);
    //alert(item.name+" "+event.checked);
  }

  OnLentaElementClicked(event : IBaseGood) {
    if(event == undefined) {
      //this.ds.GetList(undefined);
      
      this.allelements$ = this.store.pipe(select(selectDirtyGoodsByParent,{parentid:undefined,filialname:this.filialname}));  
    } else {
      //this.ds.GetList(event.id);
      this.allelements$ = this.store.pipe(select(selectDirtyGoodsByParent,{parentid:event.id,filialname:this.filialname}));  
    }
    this.UpdateGoodsview();
  }

  OnToolbarCommandClicked(event : string) {
    switch (event) {
      case "refresh":
        //this.ds.GetList(undefined);
        this.allelements$ = this.store.pipe(select(selectDirtyGoodsByParent,{parentid:this.GetCurrentParent(),filialname:this.filialname}));  
        this.NameFilterValue='';
        this.UpdateGoodsview();
        break;
      case "difference":
        //alert("Команда upload");
        //this.allelements$ = this.store.pipe(select(selectNotInONEC));
        this.UpdateGoodsview();
        break;
      case "download":
        //alert("Команда download");
        break;
        
      default:
        break;
    }


  }

  OnNameFilterInput() {
    if(this.NameFilterValue.length == 0 ){
      this.allelements$ = this.store.pipe(select(selectDirtyGoodsByParent,{parentid:this.GetCurrentParent(),filialname:this.filialname}));  
    } else {
      // заменям пробелы \s* на любое количество любых сиволов (".*")
      const reg = this.NameFilterValue.replace( /\s*/g, ".*");
      this.allelements$ = this.store.pipe(select(selectDirtyGoodByName,{name:reg,filialname:this.filialname}));
    }
    this.UpdateGoodsview();
  }

  OnNameFilterCleared() {
    this.NameFilterValue='';
    this.OnNameFilterInput();
  }

  GetCurrentParent() : string | undefined {
    let parentid : string = undefined;
    if( this.toolbar.lenta.length != 0) {
      parentid = this.toolbar.lenta[this.toolbar.lenta.length-1].id;
    }
    return  parentid;

  }

  UpdateBlocks(quontity:number) {
    this.blocks = [];
    this.startindex = 0;
    let index = 0;
    do {
      this.blocks.push(index);
      index = index + this.blocklenth;
    } while (index<quontity)
  }

  OnBlockClick(block) {
    this.startindex = block;
    this.elements$ = this.allelements$.pipe(map(goods => goods.slice(this.startindex,this.startindex+ this.blocklenth)))
  }

  UpdateGoodsview() {
    this.elements$ = this.allelements$.pipe(map(goods => {this.UpdateBlocks(goods.length);  return goods.slice(this.startindex,Math.min(this.startindex+this.blocklenth, goods.length))}));
  }

}
