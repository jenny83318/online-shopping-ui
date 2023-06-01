import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [
  { path: '', loadChildren: () => import('./home/home.module').then(m => m.HomeModule) },
  { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginModule) },
  { path: 'product', loadChildren: () => import('./product/product.module').then(m => m.ProductModule) },
  { path: 'cartitem', loadChildren: () => import('./cartitem/cartitem.module').then(m => m.CartItemModule) },
  { path: 'wishitem', loadChildren: () => import('./wishitem/wishitem.module').then(m => m.WishItemModule) },
  { path: 'order', loadChildren: () => import('./order/order.module').then(m => m.OrderModule) },
  { path: "**", redirectTo: "", pathMatch: "full" },
];

@NgModule({
    //for 預先載入，暫不使用
  // imports: [RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
