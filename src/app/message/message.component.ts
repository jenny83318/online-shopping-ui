import { Component, OnInit, Input, Output, EventEmitter,Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { Router } from '@angular/router';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {

  constructor( public dialogRef: MatDialogRef<MessageComponent>,
    private router: Router,
     @Inject(MAT_DIALOG_DATA) public data: any) { }
  ngOnInit() {
  }
  close(){
    this.dialogRef.close();
    if(this.data.fun != undefined){
      this.router.navigate(['/' + this.data.fun]);
    }
  }
}
