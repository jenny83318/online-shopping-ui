import { MessageComponent } from './message.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    MessageComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [MessageComponent ]
})
export class MessageModule { }

