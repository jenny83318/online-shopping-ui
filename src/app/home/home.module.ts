

import { NgModule } from '@angular/core';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { BlockuiComponent } from './../blockui/blockui.component';
import { BlockUIModule } from 'ng-block-ui';
import { CommonModule } from '@angular/common';
import { HeaderModule } from '../header/header.module';
import { FooterModule } from '../footer/footer.module';
import { CardModule } from '../card/card.module';


@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    FooterModule,
    HeaderModule,
    CardModule,
    HomeRoutingModule,
    BlockUIModule.forRoot({
      template:BlockuiComponent,
   })
  ]
})
export class HomeModule { }
