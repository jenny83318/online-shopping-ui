

import { NgModule } from '@angular/core';

import { BlockuiComponent } from '../blockui/blockui.component';
import { BlockUIModule } from 'ng-block-ui';
import { CommonModule } from '@angular/common';
import { HeaderModule } from '../header/header.module';
import { FooterModule } from '../footer/footer.module';
import { PreloadImageDirective } from "../preload-image.directive"
import { CardComponent } from './card.component';


@NgModule({
  declarations: [
    PreloadImageDirective,
    CardComponent
  ],
  imports: [
    CommonModule,
    FooterModule,
    HeaderModule,
    BlockUIModule.forRoot({
      template:BlockuiComponent,
   })
  ],
  exports: [CardComponent ]
})
export class CardModule { }
