import { WishitemComponent } from './wishitem.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: WishitemComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)
  ],

  exports: [RouterModule]
})
export class CartitemRoutingModule { }
