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
import { HeaderComponent } from './header/header.component';
import { DropdownComponent } from './dropdown/dropdown.component';
import { FooterComponent } from './footer/footer.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';

@NgModule({
   declarations: [
      AppComponent,
      HomeComponent,
      BlockuiComponent,
      AppComponent,
      FooterComponent,
      HeaderComponent,
      DropdownComponent,
      FooterComponent
   ],
   imports: [
	 BrowserModule,
	 HttpClientModule,
	 BrowserAnimationsModule,
	 AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    MatMenuModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
	 BlockUIModule.forRoot({
	 template:BlockuiComponent,
}),
	],
   providers: [DatePipe],
   bootstrap: [AppComponent]
})
export class AppModule { }
