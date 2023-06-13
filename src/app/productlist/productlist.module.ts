
import { NgModule } from '@angular/core';
import { BlockuiComponent } from './../blockui/blockui.component';
import { BlockUIModule } from 'ng-block-ui';
import { CommonModule } from '@angular/common';
import { HeaderModule } from '../header/header.module';
import { FooterModule } from '../footer/footer.module';
import { CardModule } from '../card/card.module';
import { ProductlistComponent } from './productlist.component';
import { ProductlistRoutingModule } from './productlist.routing.module';

@NgModule({
  declarations: [
    ProductlistComponent
  ],
  imports: [
    CommonModule,
    FooterModule,
    HeaderModule,
    CardModule,
    ProductlistRoutingModule,
    BlockUIModule.forRoot({
      template:BlockuiComponent,
   })
  ],
  exports: [ProductlistComponent ]
})
export class ProductlistModule { }
