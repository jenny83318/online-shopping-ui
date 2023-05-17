import { NgModule } from '@angular/core';
import { HeaderModule } from '../header/header.module';
import { FooterModule } from '../footer/footer.module';
import { ProductComponent } from './product.component';
import { BlockuiComponent } from './../blockui/blockui.component';
import { BlockUIModule } from 'ng-block-ui';
import { ProductRoutingModule } from './product.routing.module';

@NgModule({
  declarations: [
    ProductComponent,
  ],
  imports: [
    FooterModule,
    HeaderModule,
    ProductRoutingModule,
    BlockUIModule.forRoot({
      template:BlockuiComponent,
   })
  ],
  exports: [ProductComponent ]
})
export class ProductModule { }
