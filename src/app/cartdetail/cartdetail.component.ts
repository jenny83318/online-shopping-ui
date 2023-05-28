import { Component, OnInit,Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'

@Component({
  selector: 'app-cartdetail',
  templateUrl: './cartdetail.component.html',
  styleUrls: ['./cartdetail.component.scss']
})
export class CartdetailComponent implements OnInit {
  ngOnInit(): void {
  }
  constructor( public dialogRef: MatDialogRef<CartdetailComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }
 
  close(){
    this.dialogRef.close();
  }

}
