

import { NgModule } from '@angular/core';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { BlockuiComponent } from './../blockui/blockui.component';
import { BlockUIModule } from 'ng-block-ui';

import { CommonModule } from '@angular/common';
import { HeaderModule } from '../header/header.module';
import { FooterModule } from '../footer/footer.module';
import { PreloadImageDirective } from "./../preload-image.directive"
import { CardComponent } from '../card/card.component';


@NgModule({
  declarations: [
    HomeComponent,
    PreloadImageDirective,
    CardComponent
  ],
  imports: [
    CommonModule,
    FooterModule,
    HeaderModule,
    HomeRoutingModule,
    BlockUIModule.forRoot({
      template:BlockuiComponent,
   })
  ]
})
export class HomeModule { }
