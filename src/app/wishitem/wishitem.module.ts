import { MessageModule } from './../message/message.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WishitemComponent } from './wishitem.component';
import { CartitemRoutingModule } from './wishitem.routing.module';
import { MatToolbarModule} from '@angular/material/toolbar';
import { MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatDialogModule} from '@angular/material/dialog';
import { HeaderModule } from '../header/header.module';
import { FooterModule } from '../footer/footer.module';
import { BlockuiComponent } from './../blockui/blockui.component';
import { CartblockComponent } from '../cartblock/cartblock.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
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
    CartitemRoutingModule,
    FontAwesomeModule,
    BlockUIModule.forRoot({
      template:CartblockComponent,
   })
  ],
  declarations: [
    WishitemComponent

  ],
  exports: [WishitemComponent ]
})
export class WishItemModule { }
