import { HeaderModule } from '../header/header.module';
import { MemberComponent } from './member.component';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FooterModule } from '../footer/footer.module';
import { LoginRoutingModule } from './member.routing.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { BlockUIModule } from 'ng-block-ui';
import { HttpClientModule } from '@angular/common/http';
import { BlockuiComponent } from '../blockui/blockui.component';

@NgModule({
  declarations: [
    MemberComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    HeaderModule,
    FooterModule,
    MatCheckboxModule,
    MatButtonModule,
    LoginRoutingModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    BlockUIModule.forRoot({
      template:BlockuiComponent,
   })
  ],
  exports: [MemberComponent ]
})
export class MemberModule { }
