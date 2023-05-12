import { DropdownComponent } from './../dropdown/dropdown.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header.component';
import { MatToolbarModule} from '@angular/material/toolbar';
import { MatIconModule} from '@angular/material/icon';

@NgModule({
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule
  ],
  declarations: [
    HeaderComponent,
    DropdownComponent,
  ],
  exports: [HeaderComponent ]
})
export class HeaderModule { }
