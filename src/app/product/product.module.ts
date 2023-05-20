import { NgModule } from '@angular/core';
import { HeaderModule } from '../header/header.module';
import { FooterModule } from '../footer/footer.module';
import { ProductComponent } from './product.component';
import { BlockuiComponent } from './../blockui/blockui.component';
import { BlockUIModule } from 'ng-block-ui';

import { ProductRoutingModule } from './product.routing.module';
import { CommonModule } from '@angular/common';
import { MatToolbarModule} from '@angular/material/toolbar';
import { MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatDialogModule} from '@angular/material/dialog';
import {MatTabsModule} from '@angular/material/tabs';
import { CartblockComponent } from '../cartblock/cartblock.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [
    ProductComponent,
  ],
  imports: [
    CommonModule,
    FooterModule,
    HeaderModule,
    MatToolbarModule,
    ProductRoutingModule,
    MatIconModule,
    MatMenuModule,
    MatDialogModule,
    MatTabsModule,
    FontAwesomeModule,
    BlockUIModule.forRoot({
      template:CartblockComponent
   }),

  ],
  exports: [ProductComponent ]
})
export class ProductModule { }
