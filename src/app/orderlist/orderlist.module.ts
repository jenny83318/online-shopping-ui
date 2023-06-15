import { MessageModule } from '../message/message.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderlistComponent } from './orderlist.component';
import { MatToolbarModule} from '@angular/material/toolbar';
import { MatIconModule} from '@angular/material/icon';
import {MatDialogModule} from '@angular/material/dialog';
import { HeaderModule } from '../header/header.module';
import { FooterModule } from '../footer/footer.module';
import { PaymentModule } from '../payment/payment.module';
import { OrderlistRoutingModule } from './orderlist.routing.module';
import { BlockuiComponent } from '../blockui/blockui.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BlockUIModule } from 'ng-block-ui';
import { HttpClientModule } from '@angular/common/http';
import { MatPaginatorModule} from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table';
import {MatExpansionModule} from '@angular/material/expansion';

@NgModule({
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatDialogModule,
    MessageModule,
    HeaderModule,
    FooterModule,
    PaymentModule,
    FontAwesomeModule,
    OrderlistRoutingModule,
    HttpClientModule,
    MatPaginatorModule,
    MatTableModule,
    MatExpansionModule,
    BlockUIModule.forRoot({
      template:BlockuiComponent,
   })
  ],
  declarations: [
    OrderlistComponent

  ],
  exports: [OrderlistComponent ]
})
export class OrderlistModule { }
