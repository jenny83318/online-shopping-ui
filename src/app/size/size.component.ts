import { Component, OnInit,Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'

@Component({
  selector: 'app-size',
  templateUrl: './size.component.html',
  styleUrls: ['./size.component.scss']
})
export class SizeComponent implements OnInit {
  ngOnInit(): void {
  }
  constructor( public dialogRef: MatDialogRef<SizeComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }
 
  close(){
    this.dialogRef.close();
  }

}
