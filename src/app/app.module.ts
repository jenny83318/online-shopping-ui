import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BlockUIModule } from 'ng-block-ui';
import { DatePipe } from '@angular/common';
import { BlockuiComponent } from './blockui/blockui.component';

@NgModule({
   declarations: [
      AppComponent,
      HomeComponent,
      BlockuiComponent
   ],
   imports: [
	 BrowserModule,
	 HttpClientModule,
	 BrowserAnimationsModule,
	 AppRoutingModule,
	 BlockUIModule.forRoot({
	 template:BlockuiComponent,
}),
	],
   providers: [DatePipe],
   bootstrap: [AppComponent]
})
export class AppModule { }
