import { IONECGood, IONECGoodWithOwner } from './../../models/onec.good';
import { selectGoodsByParent, selectGoodBySelection, selectGoodByName, selectAllBySelection } from './../web.selectors';
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
import { statusWebSelectedGanged, updateWebgood, chainWebgood, deleteWebgood } from '../web.actions';
import { map, first, tap } from 'rxjs/operators';
import { CubToolbarComponent } from 'src/app/baseelements/cub-toolbar/cub-toolbar.component';
import { MatDialog, MatDialogConfig, MatDialogRef, MatSnackBar } from '@angular/material';
import { WebGoodEditComponent } from '../web-good-edit/web-good-edit.component';
import { element } from 'protractor';



@Component({
  selector: 'webgoodlist',
  templateUrl: './web.good.list.component.html',
  styleUrls: ['./web.good.list.component.scss']
})
export class WebGoodListComponent implements OnInit {

  @ViewChild(CubToolbarComponent, { static: false })
  toolbar: CubToolbarComponent;

  @Input('toolbarcommands')
  toolbarcommands: ITolbarCommandsList[] = [
    {
      commandName: "refresh",
      buttonName: "",
      iconeName: 'refresh'
    },

    {
      commandName: "add",
      buttonName: "",
      iconeName: 'add_circle'
    },

    {
      commandName: "delete",
      buttonName: "",
      iconeName: 'delete'
    },


    {
      commandName: "chain",
      buttonName: "",
      iconeName: 'attachment'
    },


  ]

  @Input('onlyfolders')
  onlyfolders: boolean = false

  elements$: Observable<IWEBGoodWithFilials[]>;
  allelements$: Observable<IWEBGoodWithFilials[]>;
  selectedelements$: Observable<IWEBGoodWithFilials[]>;
  blocklenth: number = 15;
  startindex: number = 0;
  blocks: number[] = [0];



  NameFilterValue: string = "";

  constructor(public ds: WebGoodsDatasourseService,
    private store: Store<AppState>,
    private dialog: MatDialog,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.allelements$ = this.store.pipe(select(selectGoodsByParent, { onlyfolders: this.onlyfolders, parentid: undefined }));
    this.selectedelements$ = this.store.pipe(select(selectGoodBySelection));
    this.UpdateGoodsview();
  }

  OnGoodClicked(item: IWEBGood) {
    if (item.isFolder) {
      //this.ds.GetList(item.id);
      this.allelements$ = this.store.pipe(select(selectGoodsByParent, { onlyfolders: this.onlyfolders, parentid: item.id }));
      this.toolbar.AddElement(item);
      this.UpdateGoodsview();
    } else {

    }

  }

  AskForChangeSelection(id: string, status: boolean) {
    const update: Update<IWEBGood> = {
      id: id,
      changes: { isSelected: status }
    }
    this.store.dispatch(statusWebSelectedGanged({ update }));
  }


  OnGoodCheked(event: MatCheckboxChange, item: IWEBGood) {
    this.store.pipe(select(selectGoodBySelection),
      first(),
      tap(goods => { goods.forEach(good => this.AskForChangeSelection(good.id, false)); }),
      tap(() => this.AskForChangeSelection(item.id, event.checked))).subscribe();
    this.AskForChangeSelection(item.id, event.checked);
  }

  DeleteSelected() {
    this.store.pipe(select(selectGoodBySelection),
      first(),
      tap(goods => { 
        
        goods.forEach(good => {
          if(good.filials.length==0) {
            this.store.dispatch(deleteWebgood({id:good.id}))
          }
        }); 
      }),
      ).subscribe();
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
        this.ChainSelected()

        break;
      case "delete":
        this.DeleteSelected();
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

        this.EditItem(empty);


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

  OnGoodEdit(item: IWEBGoodWithFilials) {
    if (this.NameFilterValue.length != 0) {
      return;
    }
    this.EditItem(item);

  }

  EditItem(item: IWEBGoodWithFilials) {
    const parentel: IBaseGood | undefined = this.GetCurrentParent();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.minHeight = "400px";
    dialogConfig.minWidth = "30vw"

    dialogConfig.data = { item, parentel }
    const DialogRef: MatDialogRef<WebGoodEditComponent> = this.dialog.open(WebGoodEditComponent, dialogConfig);
    DialogRef.afterClosed().subscribe(res => {
      if (res.answer != 'save') {
        return;
      }
      console.log(res);

      this.store.dispatch(updateWebgood({ good: res.data }));
    });

  }

  UpdateGoodsview() {
    this.elements$ = this.allelements$.pipe(map(goods => { this.UpdateBlocks(goods.length); return goods.slice(this.startindex, Math.min(this.startindex + this.blocklenth, goods.length)) }));
  }

  isChainPossible(selection: { dirty: IONECGoodWithOwner[], web: IWEBGoodWithFilials[] }): boolean {

    /// ничего не выбрано
    if (selection.dirty.length == 0 && selection.web.length == 0) {
      return false
    }

    /// по сути нельзя допустить замены в рвмках одного филиала т.е.
    /// нельзя привязать уже привязанный к другому 
    /// нельзя заменить ранее привязанный

    /// ищем грязный выбранный елемент уже привязанный не к выбранному чистому 
    /// так нельзя сначала нужно отвязать его
    const incorrectdirty = selection.dirty.find(element => element.owner.length != 0 &&
      selection.web.length != 0 &&
      element.owner[0].id == selection.web[0].id);
    if (incorrectdirty != undefined) {
      this.snackBar.open("Некорректное выделение", "OK",{duration: 1000});  
      return false
    }


    if (selection.web.length == 0) {
      return true
    }

    const web = selection.web[0];
    ///т.е. нашли такой грязный елемент который должент заменить другой ранее привязанный
    /// так нельзя сначала нужно отвязать старый.
    const incorrectweb = web.filialElements.find(filialel => selection.dirty.find(el => el.filial == filialel.filial && el.id != filialel.id) != undefined)
    if (incorrectweb != undefined) {
      this.snackBar.open("Некорректное выделение", "OK",{duration: 1000});  
      return false
    }

    return true
  }

  ChainSelected() {
    this.store.pipe(select(selectAllBySelection),
      first(),
      tap(selection => {
        console.log("selection",selection)
        if (this.isChainPossible(selection)) {
          if (selection.web.length == 0) {
            /// создаем новый елемент
            let newweb: IWEBGoodWithFilials = {
              id: "",
              isFolder: false,
              name: selection.dirty[0].name,
              parentid: this.GetCurrentParentID(),
              externalid: "",
              filials: [],
              filialNames: [],
              filialElements: [],
              isSelected: false
            }
            selection.web.push(newweb);
          }

          let web: IWEBGoodWithFilials = selection.web[0];

          selection.dirty.forEach(dirty => {
            if (web.filials.find(f => f == dirty.id) == undefined) {
              web.filials.push(dirty.id)
            }
          });

          this.store.dispatch(chainWebgood({ good: web }))

        }


      })).subscribe();



  }


}
