import { first, map } from 'rxjs/operators';
import { UpsertOrderRecord, DeleteOrderRecord, UpdateOrderfilial } from './../editorder.actions';
import { IOrderGoodsRecord, IOrderGoodsWievRecordWithEntity,  IDictionary } from './../../models/order';
import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialogConfig, MatDialogRef, MatDialog, MatInput } from '@angular/material';
import { IOrder } from 'src/app/models/order';
import { Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/reducers';
import { selectAllOrders } from 'src/app/orders/order.selectors';
import { selectAllOrderGoodsWithEntity, selectOrderFilial } from '../editorder.selectors';
import { DialogstringinputComponent } from 'src/app/baseelements/dialogstringinput/dialogstringinput.component';

@Component({
  selector: 'order-goods-list',
  templateUrl: './order-goods-list.component.html',
  styleUrls: ['./order-goods-list.component.scss']
})
export class OrderGoodsListComponent implements OnInit  {

  displayedColumns : string[] = ['good' ,'quantity','price' ,'comment','buttonsgroup'];

  EditCellsChain : IDictionary<string> = {
    'quantity':'comment',
    'comment':''
  };

  dataSource : MatTableDataSource<IOrderGoodsWievRecordWithEntity>  = new MatTableDataSource([]);
  ordersusbs:Subscription;
  filial : string = '';
  filialsubs : Subscription;
  total:number = 0;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  @ViewChild("inputCell",{static:false}) inputCell: TemplateRef<any>;
  @ViewChild('outputCell',{static:false}) outputCell: TemplateRef<any>;

  @ViewChild('editmatinput',{static:false}) editmatinput: MatInput;

  constructor(private store: Store<AppState>,
              public dialog: MatDialog ) { }

  ngOnInit() {
    this.ordersusbs = this.store.pipe(select(selectAllOrderGoodsWithEntity),
    map(orderrecords=> {
      let wievorderrecords : Array<IOrderGoodsWievRecordWithEntity> = orderrecords.map(el => {
        return {...el, EditCellName : "", NextCellEdit: ""}
      })
      return wievorderrecords;
    })
    )
    .subscribe(orderrecords=>{

      this.dataSource.data=orderrecords;
      this.total = this.GetOrderTotal();
    });

    this.filialsubs = this.store.pipe(select(selectOrderFilial))
    .subscribe(filial=>{
      this.filial = filial;
    });
  }

  GetOrderTotal():number {
    let total = 0;
    this.dataSource.data.forEach(record => total=total+record.quantity*record.good.price);
    return total;
  }

  get goodsvalid() {
    return true
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy() {
    this.ordersusbs.unsubscribe();
  }

  IncrQuantity(record:IOrderGoodsRecord) {
    record.quantity = 1;
    this.store.dispatch(UpsertOrderRecord({record}));
  }

  DecrQuantity(record) {
    record.quantity = -1;
    this.store.dispatch(UpsertOrderRecord({record}));

  }

  OnRecordClick(record ) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus=true;
    dialogConfig.minHeight="25wh"
    dialogConfig.minWidth="25wv"

    dialogConfig.data = {title: `Комментарий для : ${record.good.name}` , answer:record.comment}

    const DialogRef : MatDialogRef<DialogstringinputComponent>  = this.dialog.open(
      DialogstringinputComponent,
      dialogConfig);
      DialogRef.afterClosed().pipe(first()).subscribe(res =>{
      record.comment = res.answer;
      record.quantity = 0;
      this.store.dispatch(UpsertOrderRecord({record}));
    });


  }

  OnFilialChange() {
    this.store.dispatch(UpdateOrderfilial({filial:this.filial}));
  }

  Del(record) {
    this.store.dispatch(DeleteOrderRecord({recordid:record.id}));
  }


  OnCellClick(record:IOrderGoodsWievRecordWithEntity,cellName:string) {
    record.EditCellName = cellName;
    record.NextCellEdit = cellName === "" ? "" : this.EditCellsChain[cellName];
    setTimeout(()=>{
      if (this.editmatinput != undefined) {
        if (!this.editmatinput.focused) {

          this.editmatinput.focus();
        }
      }
    });


  }

  OnEditFocus(event) {
    console.log("event",event);
    setTimeout(()=>event.target.select(),20);
  }

  OnEditLeave(record:IOrderGoodsWievRecordWithEntity) {


    this.OnCellClick(record,record.NextCellEdit);


  }




  }






