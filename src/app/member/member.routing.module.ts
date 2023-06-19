import { MemberComponent } from './member.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: MemberComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)
  ],

  exports: [RouterModule]
})
export class LoginRoutingModule { }
