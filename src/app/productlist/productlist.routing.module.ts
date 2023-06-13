import { ProductlistComponent } from './productlist.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{ path: '', component: ProductlistComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)
  ],

  exports: [RouterModule]
})
export class ProductlistRoutingModule { }
