import { MessageModule } from '../message/message.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderComponent } from './order.component';
import { MatToolbarModule} from '@angular/material/toolbar';
import { MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatDialogModule} from '@angular/material/dialog';
import { HeaderModule } from '../header/header.module';
import { FooterModule } from '../footer/footer.module';
import { OrderRoutingModule } from './order.routing.module';
import { CartblockComponent } from '../cartblock/cartblock.component';
import { BlockuiComponent } from '../blockui/blockui.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { BlockUIModule } from 'ng-block-ui';
import { FormsModule } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';


@NgModule({
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatDialogModule,
    MessageModule,
    HeaderModule,
    FooterModule,
    FontAwesomeModule,
    MatCheckboxModule,
    OrderRoutingModule,
    FormsModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    BlockUIModule.forRoot({
      template:BlockuiComponent,
   })
  ],
  declarations: [
    OrderComponent

  ],
  exports: [OrderComponent ]
})
export class OrderModule { }
