import { EffectsModule } from '@ngrx/effects';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderEditComponent } from '../order/order-edit/order-edit.component';
import { MaterialsModule } from '../materials/materials.module';
import { StoreModule, props } from '@ngrx/store';
import * as fromEditorder from './reducers';
import { editorderreducer } from './reducers';
import { EditOrderEffects } from './editorder.effects';
import { OrderHeaderComponent } from './order-header/order-header.component';
import { OrderGoodsListComponent } from './order-goods-list/order-goods-list.component';
import { OrderMenuComponent } from './order-menu/order-menu.component';
import { OrderToolbarComponent } from './order-toolbar/order-toolbar.component';
import { BaseelementsModule } from '../baseelements/baseelements.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { OrdersModule } from '../orders/orders.module';
import { TelegramService } from './telegram.service';
import { HttpClientModule } from '@angular/common/http';




@NgModule({
  declarations: [OrderEditComponent, OrderHeaderComponent, OrderGoodsListComponent, OrderMenuComponent, OrderToolbarComponent],
  exports:[OrderEditComponent],
  imports:[
    MaterialsModule,
    CommonModule,
    HttpClientModule,
    BaseelementsModule,
    FormsModule,
    ReactiveFormsModule,
    OrdersModule,
    EffectsModule.forFeature([EditOrderEffects]),
    StoreModule.forFeature(fromEditorder.editorderFeatureKey, editorderreducer, { metaReducers: fromEditorder.metaReducers })
  ],
  providers:[TelegramService]
})
export class OrderModule { }
