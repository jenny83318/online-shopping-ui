import { MessageModule } from '../message/message.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderdetailComponent } from './orderdetail.component';
import { OrderdetailRoutingModule } from './orderdetail.routing.module';
import { MatToolbarModule} from '@angular/material/toolbar';
import { MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatDialogModule} from '@angular/material/dialog';
import { HeaderModule } from '../header/header.module';
import { FooterModule } from '../footer/footer.module';
import { BlockuiComponent } from '../blockui/blockui.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { BlockUIModule } from 'ng-block-ui';
import { FormsModule } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { HttpClientModule } from '@angular/common/http';
import { MatPaginatorModule} from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table';
import {MatExpansionModule} from '@angular/material/expansion';


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
    OrderdetailRoutingModule,
    FormsModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    HttpClientModule,
    MatPaginatorModule,
    MatTableModule,
    MatExpansionModule,
    BlockUIModule.forRoot({
      template:BlockuiComponent,
   })
  ],
  declarations: [
    OrderdetailComponent

  ],
  exports: [OrderdetailComponent ]
})
export class OrderdetailModule { }
