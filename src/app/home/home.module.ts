

import { NgModule } from '@angular/core';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';


import { CommonModule } from '@angular/common';
import { HeaderModule } from '../header/header.moudle';
import { FooterModule } from '../footer/footer.module';

@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    HeaderModule,
    FooterModule,
    HomeRoutingModule
  ]
})
export class HomeModule { }
