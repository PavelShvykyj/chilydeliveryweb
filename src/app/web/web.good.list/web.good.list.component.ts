import { IONECGood } from './../../models/onec.good';
import { selectGoodsByParent,  selectDirtyGoodFilialById, selectNotInONEC, selectGoodByName } from './../web.selectors';
import { IWEBGood, IWEBGoodWithFilials } from './../../models/web.good';
import { Component, OnInit, ViewChild } from '@angular/core';
import { WebGoodsDatasourseService } from '../web.goods.datasourse.service';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/reducers';
import { LentaToolbarComponent } from 'src/app/baseelements/lenta-toolbar/lenta-toolbar.component';
import { Observable } from 'rxjs';
import { ITolbarCommandsList } from 'src/app/models/toolbar.commandslist';
import { IBaseGood } from 'src/app/models/base.good';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Update } from '@ngrx/entity';
import { statusWebSelectedGanged } from '../web.actions';
import { map } from 'rxjs/operators';
import { CubToolbarComponent } from 'src/app/baseelements/cub-toolbar/cub-toolbar.component';



@Component({
  selector: 'webgoodlist',
  templateUrl: './web.good.list.component.html',
  styleUrls: ['./web.good.list.component.scss']
})
export class WebGoodListComponent implements OnInit {

  @ViewChild(CubToolbarComponent, {static: false})
  toolbar: CubToolbarComponent;

  
  elements$ : Observable<IWEBGoodWithFilials[]>; 
  allelements$ : Observable<IWEBGoodWithFilials[]>; 
  blocklenth:number = 50;
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
    },

    {
      commandName: "download",
      buttonName:"",
      iconeName:'cloud_download'
    }

  ]

  NameFilterValue:string="";

  constructor(public ds : WebGoodsDatasourseService, private store: Store<AppState>) { }

  ngOnInit() {
    this.allelements$ = this.store.pipe(select(selectGoodsByParent,{parentid:undefined}));
    this.UpdateGoodsview();
  }

  OnGoodClicked(item: IWEBGood) {
    if(item.isFolder) {
      //this.ds.GetList(item.id);
      this.allelements$ = this.store.pipe(select(selectGoodsByParent,{parentid:item.id})); 
      this.toolbar.AddElement(item);
      this.UpdateGoodsview();
    } else {
     
    }

  }

  OnGoodCheked(event:MatCheckboxChange,item: IWEBGood) {
    const update : Update<IWEBGood> = {
      id:item.id,
      changes:{isSelected:event.checked}
    }
    this.store.dispatch(statusWebSelectedGanged({update}));

    //alert(item.name+" "+event.checked);
  }

  OnLentaElementClicked(event : IBaseGood) {
    if(event == undefined) {
      //this.ds.GetList(undefined);
      this.allelements$ = this.store.pipe(select(selectGoodsByParent,{parentid:undefined})); 
    } else {
      //this.ds.GetList(event.id);
      this.allelements$ = this.store.pipe(select(selectGoodsByParent,{parentid:event.id})); 
    }
    this.UpdateGoodsview();
  }

  OnToolbarCommandClicked(event : string) {
    switch (event) {
      case "refresh":
        //this.ds.GetList(undefined);
        this.allelements$ = this.store.pipe(select(selectGoodsByParent,{parentid: this.GetCurrentParent()})); 
        this.NameFilterValue='';
        this.UpdateGoodsview();
        break;
      case "difference":
        //alert("Команда upload");
        this.allelements$ = this.store.pipe(select(selectNotInONEC));
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
      
      this.allelements$ = this.store.pipe(select(selectGoodsByParent,{parentid:this.GetCurrentParent()})); 
    } else {
      // заменям пробелы \s* на любое количество любых сиволов (".*")
      const reg = this.NameFilterValue.replace( /\s*/g, ".*");
      this.allelements$ = this.store.pipe(select(selectGoodByName,reg));
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
