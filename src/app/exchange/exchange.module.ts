import { WebModule } from './../web/web.module';
import { MaterialsModule } from './../materials/materials.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoodsExchangeComponent } from './goods-exchange/goods-exchange.component';
import { OrdersExchangeComponent } from './orders-exchange/orders-exchange.component';
import { GoodsResolver } from './resolvers/goods.resolver';
import { OrdersModule } from '../orders/orders.module';


@NgModule({
  declarations: [GoodsExchangeComponent, OrdersExchangeComponent],
  imports: [
    CommonModule,
    WebModule,
    MaterialsModule,
    OrdersModule
  ],
  providers:[GoodsResolver]
})
export class ExchangeModule { }
