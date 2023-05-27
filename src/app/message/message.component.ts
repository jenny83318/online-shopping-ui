import { Component, OnInit, Input, Output, EventEmitter,Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { Router } from '@angular/router';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {
  isConfirm:boolean = false;
  constructor( public dialogRef: MatDialogRef<MessageComponent>,
    private router: Router,
     @Inject(MAT_DIALOG_DATA) public data: any) { }
  ngOnInit() {
    console.log('isConfirm', this.data.isConfirm)
    if(this.data.isConfirm != undefined){
      this.isConfirm = this.data.isConfirm;
    }
  }
  close(){
    this.dialogRef.close();
    if(this.data.fun != undefined){
      this.router.navigate(['/' + this.data.fun]);
    }
  }
  confirm() {
    // 執行確認操作
    this.dialogRef.close(true);
  }

  cancel() {
    // 執行取消操作
    this.dialogRef.close(false);
  }
}
