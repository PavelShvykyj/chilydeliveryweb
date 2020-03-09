import { IONECGood } from './../../models/onec.good';
import { selectGoodsByParent,  selectGoodByName } from './../web.selectors';
import { IWEBGood, IWEBGoodWithFilials } from './../../models/web.good';
import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { WebGoodsDatasourseService } from '../web.goods.datasourse.service';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/reducers';

import { Observable } from 'rxjs';
import { ITolbarCommandsList } from 'src/app/models/toolbar.commandslist';
import { IBaseGood } from 'src/app/models/base.good';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Update } from '@ngrx/entity';
import { statusWebSelectedGanged, updateWebgood } from '../web.actions';
import { map } from 'rxjs/operators';
import { CubToolbarComponent } from 'src/app/baseelements/cub-toolbar/cub-toolbar.component';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';
import { WebGoodEditComponent } from '../web-good-edit/web-good-edit.component';



@Component({
  selector: 'webgoodlist',
  templateUrl: './web.good.list.component.html',
  styleUrls: ['./web.good.list.component.scss']
})
export class WebGoodListComponent implements OnInit {

  @ViewChild(CubToolbarComponent, {static: false})
  toolbar: CubToolbarComponent;

  @Input('toolbarcommands')
  toolbarcommands : ITolbarCommandsList[] = [
    {
      commandName: "refresh",
      buttonName:"",
      iconeName:'refresh'
    },

    {
      commandName: "add",
      buttonName:"",
      iconeName:'add_circle'
    },
  
    {
      commandName: "delete",
      buttonName:"",
      iconeName:'delete'
    },
  
    
    {
      commandName: "chain",
      buttonName:"",
      iconeName:'attachment'
    },


  ]
  
  @Input('onlyfolders')
  onlyfolders: boolean = false

  elements$ : Observable<IWEBGoodWithFilials[]>; 
  allelements$ : Observable<IWEBGoodWithFilials[]>; 
  blocklenth:number = 20;
  startindex:number = 0;
  blocks:number[] = [0];

 

  NameFilterValue:string="";

  constructor(public ds : WebGoodsDatasourseService, 
              private store: Store<AppState>,
              private dialog: MatDialog) { }

  ngOnInit() {
    this.allelements$ = this.store.pipe(select(selectGoodsByParent,{onlyfolders:this.onlyfolders,parentid:undefined}));
    this.UpdateGoodsview();
  }

  OnGoodClicked(item: IWEBGood) {
    if(item.isFolder) {
      //this.ds.GetList(item.id);
      this.allelements$ = this.store.pipe(select(selectGoodsByParent,{onlyfolders:this.onlyfolders,parentid:item.id})); 
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
      this.allelements$ = this.store.pipe(select(selectGoodsByParent,{onlyfolders:this.onlyfolders,parentid:undefined})); 
    } else {
      //this.ds.GetList(event.id);
      this.allelements$ = this.store.pipe(select(selectGoodsByParent,{onlyfolders:this.onlyfolders,parentid:event.id})); 
    }
    this.UpdateGoodsview();
  }

  OnToolbarCommandClicked(event : string) {
    switch (event) {
      case "refresh":
        //this.ds.GetList(undefined);
        this.allelements$ = this.store.pipe(select(selectGoodsByParent,{onlyfolders:this.onlyfolders,parentid: this.GetCurrentParentID()})); 
        this.NameFilterValue='';
        this.UpdateGoodsview();
        break;
      case "difference":
        //alert("Команда upload");
        
        
        break;
      case "chain":
        
        break;
      case "delete":
        break;
      case "add":
        if (this.NameFilterValue.length!=0) {
          return;   
        }   
        
        const empty :IWEBGoodWithFilials = {
          id:"",
          externalid:"",
          parentid:"",
          name:"",
          isFolder:false,
          isSelected:false,
          filials:[],
          filialNames:[],
          filialElements:[]
        }
        
        this.EditItem(empty);
           
      
        break;
        
      default:
        break;
    }


  }

  OnNameFilterInput() {
    if(this.NameFilterValue.length == 0 ){
      
      this.allelements$ = this.store.pipe(select(selectGoodsByParent,{onlyfolders:this.onlyfolders,parentid:this.GetCurrentParentID()})); 
    } else {
      // заменям пробелы \s* на любое количество любых сиволов (".*")
      const reg = this.NameFilterValue.replace( /\s*/g, ".*");
      this.allelements$ = this.store.pipe(select(selectGoodByName,{onlyfolders:this.onlyfolders,filter:reg}));
    }
    this.UpdateGoodsview();
  }

  OnNameFilterCleared() {
    this.NameFilterValue='';
    this.OnNameFilterInput();
  }

  GetCurrentParentID(): string | undefined {
    const parent = this.GetCurrentParent();
    if (parent == undefined) {
      return undefined
    } else {
      return parent.id
    }
  }

  GetCurrentParent() : IBaseGood | undefined {
    let parent : IBaseGood = undefined;
    if( this.toolbar.lenta.length != 0) {
      parent = this.toolbar.lenta[this.toolbar.lenta.length-1];
    }
    return  parent;

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

  OnGoodEdit(item:IWEBGoodWithFilials) {
    if (this.NameFilterValue.length!=0) {
      return;   
    }   
    this.EditItem(item);

  }

  EditItem(item:IWEBGoodWithFilials) {
    const parentel : IBaseGood | undefined = this.GetCurrentParent();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.minHeight="400px";
    dialogConfig.minWidth="30vw"

    dialogConfig.data = {item , parentel}
    const DialogRef : MatDialogRef<WebGoodEditComponent>  = this.dialog.open(WebGoodEditComponent,dialogConfig);
    DialogRef.afterClosed().subscribe(res =>{
      if(res.answer != 'save') {
        return;
      }
      console.log(res);

      this.store.dispatch(updateWebgood({good:res.data} ));
    });

  }

  UpdateGoodsview() {
    this.elements$ = this.allelements$.pipe(map(goods => {this.UpdateBlocks(goods.length);  return goods.slice(this.startindex,Math.min(this.startindex+this.blocklenth, goods.length))}));
  }

}
