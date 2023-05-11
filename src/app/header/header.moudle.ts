
import { NgModule } from '@angular/core';
import { BlockuiComponent } from './../blockui/blockui.component';
import { HeaderComponent } from './header.component';
import { CommonModule } from '@angular/common';
import { BlockUIModule } from 'ng-block-ui';
import { DropdownComponent } from './../dropdown/dropdown.component';

@NgModule({
  declarations: [
    HeaderComponent,
    DropdownComponent
  ],
  exports: [HeaderComponent],
  imports: [
    CommonModule,
    BlockUIModule.forRoot({
      template:BlockuiComponent,
   })
  ]
})
export class HeaderModule { }
