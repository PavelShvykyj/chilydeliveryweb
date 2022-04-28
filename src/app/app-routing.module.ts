import { OrdersExchangeComponent } from './exchange/orders-exchange/orders-exchange.component';
import { GoodsExchangeComponent } from './exchange/goods-exchange/goods-exchange.component';
import { LoginComponent } from './auth/login/login.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GoodsResolver } from './exchange/resolvers/goods.resolver';
import { IsLoggedInGuard } from './isloged.guard';
import { OrderEditComponent } from './order/order-edit/order-edit.component';
import { OrdesResolver } from './orders/orderslist/orders.resolver';
import { StreetsResolver } from './streets/streets.resolver';
import { ChoicegoodsComponent } from './web/choicegoods/choicegoods.component';
import { ChoiceGoodsResolver } from './web/choice.goods.resolver';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },

  {
    path: 'goods',
    component: GoodsExchangeComponent,
    resolve : {goods : GoodsResolver},
    canActivate:[IsLoggedInGuard]
  },

  {
    path: 'choicegoods',
    component: ChoicegoodsComponent,
    resolve : {goods : ChoiceGoodsResolver},
    canActivate:[IsLoggedInGuard]
  },



  {
    path: 'orders',
    component: OrdersExchangeComponent,
    resolve : {goods : GoodsResolver, orders: OrdesResolver},
    canActivate:[IsLoggedInGuard]
  },

  {
    path: 'order',
    component: OrderEditComponent,
    resolve : {goods : GoodsResolver, streets:StreetsResolver},
    canActivate:[IsLoggedInGuard]
  },

  { path: '**',
    component: LoginComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
