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




@NgModule({
  declarations: [OrderslistComponent],
  exports:[OrderslistComponent],
  imports: [
    CommonModule,
    MaterialsModule,
    EffectsModule.forFeature([OrderEffects]),

    StoreModule.forFeature(fromOrders.ordersFeatureKey, orderreducer, { metaReducers: fromOrders.metaReducers })
  ],
  providers:[OrdersDatasourseService]
})
export class OrdersModule { }
