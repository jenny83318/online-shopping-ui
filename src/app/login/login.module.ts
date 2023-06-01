import { HeaderModule } from '../header/header.module';
import { LoginComponent } from './login.component';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FooterModule } from '../footer/footer.module';
import { LoginRoutingModule } from './login.routing.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';

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
    LoginRoutingModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule
  ]
})
export class LoginModule { }
