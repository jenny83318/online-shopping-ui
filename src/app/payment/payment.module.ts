import { MessageModule } from '../message/message.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule} from '@angular/material/toolbar';
import {MatMenuModule} from '@angular/material/menu';
import {MatDialogModule} from '@angular/material/dialog';
import { BlockuiComponent } from '../blockui/blockui.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BlockUIModule } from 'ng-block-ui';
import { HttpClientModule } from '@angular/common/http';
import { NgxPayPalModule } from 'ngx-paypal';
import { PaymentComponent } from './payment.component';


@NgModule({
  imports: [
    CommonModule,
    MatToolbarModule,
    MatMenuModule,
    MatDialogModule,
    MessageModule,
    FontAwesomeModule,
    HttpClientModule,
    NgxPayPalModule,
    BlockUIModule.forRoot({
      template:BlockuiComponent,
   })
  ],
  declarations: [
    PaymentComponent

  ],
  exports: [PaymentComponent ]
})
export class PaymentModule { }
