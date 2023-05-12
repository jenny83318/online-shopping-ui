import { HeaderModule } from '../header/header.module';
import { LoginComponent } from './login.component';
import { NgModule } from '@angular/core';
import { BlockuiComponent } from './../blockui/blockui.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BlockUIModule } from 'ng-block-ui';
import { FooterModule } from '../footer/footer.module';
import { LoginRoutingModule } from './login.routing.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    HeaderModule,
    FooterModule,
    MatCheckboxModule,
    MatButtonModule,
    LoginRoutingModule
  ]
})
export class LoginModule { }
