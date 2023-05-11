import { NgModule } from '@angular/core';
import { BlockuiComponent } from './../blockui/blockui.component';
import { FooterComponent } from './footer.component';
import { CommonModule } from '@angular/common';
import { BlockUIModule } from 'ng-block-ui';
import { DropdownComponent } from './../dropdown/dropdown.component';

@NgModule({
  declarations: [
    FooterComponent
  ],
  exports: [FooterComponent],
  imports: [
    CommonModule,
    BlockUIModule.forRoot({
      template:BlockuiComponent,
   })
  ]
})
export class FooterModule { }
