import { DropdownComponent } from './../dropdown/dropdown.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header.component';
import { MatToolbarModule} from '@angular/material/toolbar';
import { MatIconModule} from '@angular/material/icon';
import { HtmlPipe } from './../util/Html.pipe';
@NgModule({
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule
  ],
  declarations: [
    HeaderComponent,
    DropdownComponent,
    HtmlPipe
  ],
  exports: [HeaderComponent ]
})
export class HeaderModule { }

