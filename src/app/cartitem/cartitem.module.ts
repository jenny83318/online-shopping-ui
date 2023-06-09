import { MessageModule } from './../message/message.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartitemComponent } from './cartitem.component';
import { CartitemRoutingModule } from './cartitem.routing.module';
import { MatToolbarModule} from '@angular/material/toolbar';
import { MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatDialogModule} from '@angular/material/dialog';
import { HeaderModule } from '../header/header.module';
import { FooterModule } from '../footer/footer.module';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { CartblockComponent } from '../cartblock/cartblock.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { BlockUIModule } from 'ng-block-ui';


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
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    CartitemRoutingModule,
    FontAwesomeModule,
    MatCheckboxModule,
    FormsModule,
    BlockUIModule.forRoot({
      template:CartblockComponent,
   })
  ],
  declarations: [
    CartitemComponent

  ],
  exports: [CartitemComponent ]
})
export class CartItemModule { }
