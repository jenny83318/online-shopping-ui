import { Component, OnInit,Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'

@Component({
  selector: 'app-cartdetail',
  templateUrl: './cartdetail.component.html',
  styleUrls: ['./cartdetail.component.scss']
})
export class CartdetailComponent implements OnInit {
  qty:number= 1;
  size:any=''
  sizeList:any=[]
  isShow:boolean = false;
  order:any = {size:"", qty:0, isConfirm:false};
  ngOnInit(): void {
    this.sizeList = this.data.split(',');
    if(this.sizeList[0] =='F'){
      this.size = 'F'
    }
  }
  constructor( public dialogRef: MatDialogRef<CartdetailComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  close(){
    this.dialogRef.close(this.order);
  }
  changeQty(isPlus: boolean) {
    this.qty = isPlus ? (this.qty += 1) : this.qty <= 1 ? 1 : (this.qty -= 1);
  }
  chooseSize(size: any) {
    this.size = size;
    this.isShow = false;
  }

  confirm() {
    if (this.size == '') {
      this.isShow = true;
    }else{
      this.order.size = this.size;
      this.order.qty = this.qty;
      this.order.isConfirm = true;
      this.dialogRef.close(this.order);
    }
  }
}
