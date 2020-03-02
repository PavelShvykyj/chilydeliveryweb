import { selectGoodsByParent, selectNotInWeb, selectGoodByName, selectGoodBySelection, selectGoodBySelectionForUpload } from './../onec.selectors';
import { AppState } from './../../reducers/index';
import { Store, select } from '@ngrx/store';
import { ITolbarCommandsList } from './../../models/toolbar.commandslist';
import { Component, OnInit, ViewChild } from '@angular/core';
import { OnecGoodsDatasourseService } from '../onec.goods.datasourse.service';
import { LentaToolbarComponent } from 'src/app/baseelements/lenta-toolbar/lenta-toolbar.component';
import { IONECGood } from 'src/app/models/onec.good';
import { Observable } from 'rxjs';
import { IBaseGood } from 'src/app/models/base.good';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { tap, first, finalize, map } from 'rxjs/operators';
import { loadAllGoods, statusSelectedGanged } from '../onec.actions';
import { Update } from '@ngrx/entity';
import { uploadOnecSelected } from 'src/app/web/web.actions';



@Component({
  selector: 'onecgoodslist',
  templateUrl: './onec.goods.list.component.html',
  styleUrls: ['./onec.goods.list.component.scss']
})
export class OnecGoodsListComponent implements OnInit {

  @ViewChild(LentaToolbarComponent, {static: false})
  toolbar: LentaToolbarComponent;

  elements$ : Observable<IONECGood[]>; 
  allelements$ : Observable<IONECGood[]>; 
  blocklenth:number = 30;
  startindex:number = 0;
  blocks:number[] = [0];


  toolbarcommands : ITolbarCommandsList[] = [
    {
      commandName: "refresh",
      buttonName:"",
      iconeName:'refresh'
    },

    {
      commandName: "upload",
      buttonName:"",
      iconeName:'cloud_upload'
    },

    {
      commandName: "difference",
      buttonName:"",
      iconeName:'call_split'
    }

  ]

  NameFilterValue:string="";

  constructor(public ds : OnecGoodsDatasourseService, private store: Store<AppState>) { }

  ngOnInit() {
    this.allelements$ = this.store.pipe(select(selectGoodsByParent,{parentid:undefined})); 
    this.UpdateGoodsview();
  }

  UpdateGoodsview() {
    
    this.elements$ = this.allelements$.pipe(map(goods => {this.UpdateBlocks(goods.length);  return goods.slice(this.startindex,Math.min(this.startindex+this.blocklenth, goods.length))}));
  }


  OnGoodClicked(item: IONECGood) {
    if(item.isFolder) {
      //this.ds.GetList(item.id);
      this.allelements$ = this.store.pipe(select(selectGoodsByParent,{parentid:item.id})); 
      this.UpdateGoodsview();
      this.toolbar.AddElement(item);
    } else {
     
    }

  }

  OnGoodCheked(event:MatCheckboxChange,item: IONECGood) {
    const update : Update<IONECGood> = {
      id:item.id,
      changes:{isSelected:event.checked}
    }
    this.store.dispatch(statusSelectedGanged({update}));

    
  }


  OnLentaElementClicked(event : IBaseGood) {
    if(event == undefined) {
      this.allelements$ = this.store.pipe(select(selectGoodsByParent,{parentid:undefined})); 
    } else {
      this.allelements$ = this.store.pipe(select(selectGoodsByParent,{parentid:event.id})); 
    }
    this.UpdateGoodsview();
  }

  OnToolbarCommandClicked(event : string) {
    switch (event) {
      case "refresh":
        
        this.allelements$ = this.store.pipe(select(selectGoodsByParent,{parentid:this.GetCurrentParent()})); 
        this.UpdateGoodsview(); 
        this.NameFilterValue='';
        break;
      case "upload":
        this.store.pipe(
          select(selectGoodBySelectionForUpload),
          first())
        .subscribe(
          selectedgoods  => {selectedgoods.forEach(good => this.store.dispatch(uploadOnecSelected({good})))}
        );
        

        break;
      case "difference":
        this.allelements$ = this.store.pipe(select(selectNotInWeb));
        this.UpdateGoodsview(); 
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
      const reg:string  = '.*'+this.NameFilterValue.replace( /\s/g, ".*")+'.*';
      
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

}
