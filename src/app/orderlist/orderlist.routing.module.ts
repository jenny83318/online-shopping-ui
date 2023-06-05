import { OrderlistComponent } from './orderlist.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: OrderlistComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)
  ],

  exports: [RouterModule]
})
export class OrderlistRoutingModule { }
