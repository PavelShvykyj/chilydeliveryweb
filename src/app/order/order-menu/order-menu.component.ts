import { IOrderGoodsRecord } from './../../models/order';
import { Component, OnInit, ViewChild, Input, HostListener } from '@angular/core';
import { CubToolbarComponent } from 'src/app/baseelements/cub-toolbar/cub-toolbar.component';
import { ITolbarCommandsList } from 'src/app/models/toolbar.commandslist';
import { Observable } from 'rxjs';
import { IWEBGoodWithFilials, IWEBGood } from 'src/app/models/web.good';
import { WebGoodsDatasourseService } from 'src/app/web/web.goods.datasourse.service';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/reducers';
import { MatSnackBar } from '@angular/material';
import { selectGoodsByParent, selectGoodBySelection, selectGoodByName } from 'src/app/web/web.selectors';
import { map } from 'rxjs/operators';
import { IBaseGood } from 'src/app/models/base.good';
import { UpsertOrderRecord } from '../editorder.actions';

@Component({
  selector: 'order-menu',
  templateUrl: './order-menu.component.html',
  styleUrls: ['./order-menu.component.scss']
})
export class OrderMenuComponent implements OnInit {

  @ViewChild(CubToolbarComponent, { static: false })
  toolbar: CubToolbarComponent;

  @Input('toolbarcommands')
  toolbarcommands: ITolbarCommandsList[] = []

  @Input('onlyfolders')
  onlyfolders: boolean = false

  
  isCTRLDOWN : boolean = false;

  elements$: Observable<IWEBGoodWithFilials[]>;
  allelements$: Observable<IWEBGoodWithFilials[]>;
  selectedelements$: Observable<IWEBGoodWithFilials[]>;
  blocklenth: number = 40;
  startindex: number = 0;
  blocks: number[] = [0];



  NameFilterValue: string = "";


  constructor(public ds: WebGoodsDatasourseService,
    private store: Store<AppState>,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.allelements$ = this.store.pipe(select(selectGoodsByParent, { onlyfolders: this.onlyfolders, parentid: undefined }));
    this.selectedelements$ = this.store.pipe(select(selectGoodBySelection));
    this.UpdateGoodsview();
  }

  UpdateGoodsview() {
    this.elements$ = this.allelements$.pipe(map(goods => { this.UpdateBlocks(goods.length); return goods.slice(this.startindex, Math.min(this.startindex + this.blocklenth, goods.length)) }));
  }


  OnLentaElementClicked(event: IBaseGood) {
    if (event == undefined) {
      //this.ds.GetList(undefined);
      this.allelements$ = this.store.pipe(select(selectGoodsByParent, { onlyfolders: this.onlyfolders, parentid: undefined }));
    } else {
      //this.ds.GetList(event.id);
      this.allelements$ = this.store.pipe(select(selectGoodsByParent, { onlyfolders: this.onlyfolders, parentid: event.id }));
    }
    this.UpdateGoodsview();
  }

  OnToolbarCommandClicked(event: string) {
    
    switch (event) {
      case "refresh":
        //this.ds.GetList(undefined);
        this.allelements$ = this.store.pipe(select(selectGoodsByParent, { onlyfolders: this.onlyfolders, parentid: this.GetCurrentParentID() }));
        this.NameFilterValue = '';
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
        if (this.NameFilterValue.length != 0) {
          return;
        }

        const empty: IWEBGoodWithFilials = {
          id: "",
          externalid: "",
          parentid: "",
          name: "",
          isFolder: false,
          isSelected: false,
          filials: [],
          filialNames: [],
          filialElements: []
        }

       


        break;

      default:
        break;
    }


  }

  OnNameFilterInput() {
    if (this.NameFilterValue.length == 0) {

      this.allelements$ = this.store.pipe(select(selectGoodsByParent, { onlyfolders: this.onlyfolders, parentid: this.GetCurrentParentID() }));
    } else {
      // заменям пробелы \s* на любое количество любых сиволов (".*")
      const reg = this.NameFilterValue.replace(/\s*/g, ".*");
      this.allelements$ = this.store.pipe(select(selectGoodByName, { onlyfolders: this.onlyfolders, filter: reg }));
    }
    this.UpdateGoodsview();
  }

  OnNameFilterCleared() {
    this.NameFilterValue = '';
    this.OnNameFilterInput();
  }

  GetCurrentParentID(): string | undefined {
    const parent = this.GetCurrentParent();
    if (parent == undefined) {
      return ""
    } else {
      return parent.id
    }
  }

  GetCurrentParent(): IBaseGood | undefined {
    let parent: IBaseGood = undefined;
    if (this.toolbar.lenta.length != 0) {
      parent = this.toolbar.lenta[this.toolbar.lenta.length - 1];
    }
    return parent;

  }

  UpdateBlocks(quontity: number) {
    this.blocks = [];
    this.startindex = 0;
    let index = 0;
    do {
      this.blocks.push(index);
      index = index + this.blocklenth;
    } while (index < quontity)
  }

  OnBlockClick(block) {
    this.startindex = block;
    this.elements$ = this.allelements$.pipe(map(goods => goods.slice(this.startindex, this.startindex + this.blocklenth)))
  }

  ElementClicked(item) {
    this.OnGoodClicked(item);

  }

  OnGoodClicked(item: IWEBGood) {
    if (item.isFolder) {
      //this.ds.GetList(item.id);
      this.allelements$ = this.store.pipe(select(selectGoodsByParent, { onlyfolders: this.onlyfolders, parentid: item.id }));
      this.toolbar.AddElement(item);
      this.UpdateGoodsview();
    } else {
      const quantity = this.isCTRLDOWN ? -1 : 1 ; 
      const record : IOrderGoodsRecord = {
        id:item.id,
        quantity:quantity,
        comment:""
      }
      this.store.dispatch(UpsertOrderRecord({record}))
    }

  }

  OnControlStatusChange(value) {
    this.isCTRLDOWN=value
  }
  

}
