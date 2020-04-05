import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import * as fromOrders from './reducers';
import { orderreducer } from './reducers';
import { MaterialsModule } from '../materials/materials.module';
import { EffectsModule } from '@ngrx/effects';
import { OrderEffects } from './order.effects';
import { OrdersDatasourseService } from './orders.datasourse.service';
import { OrderslistComponent } from './orderslist/orderslist.component';
import { CtrlStatusDirective } from './ctrldown.directive';
import { OrdesResolver } from './orderslist/orders.resolver';




@NgModule({
  declarations: [OrderslistComponent, CtrlStatusDirective],
  exports:[OrderslistComponent,CtrlStatusDirective],
  imports: [
    CommonModule,
    MaterialsModule,
    EffectsModule.forFeature([OrderEffects]),
    StoreModule.forFeature(fromOrders.ordersFeatureKey, orderreducer, { metaReducers: fromOrders.metaReducers })
  ],
  providers:[OrdersDatasourseService,OrdesResolver]
})
export class OrdersModule { }
