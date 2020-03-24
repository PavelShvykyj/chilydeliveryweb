import { OrdersExchangeComponent } from './exchange/orders-exchange/orders-exchange.component';
import { GoodsExchangeComponent } from './exchange/goods-exchange/goods-exchange.component';
import { LoginComponent } from './auth/login/login.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GoodsResolver } from './exchange/resolvers/goods.resolver';
import { IsLoggedInGuard } from './isloged.guard';
import { OrderEditComponent } from './order/order-edit/order-edit.component';

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
    path: 'orders',
    component: OrdersExchangeComponent,
    resolve : {goods : GoodsResolver},
    canActivate:[IsLoggedInGuard]
  },
  
  {
    path: 'order',
    component: OrderEditComponent,
    resolve : {goods : GoodsResolver},
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
