import { JolService } from './../service/JolService.service';
import { Component, Input, OnInit } from '@angular/core';
import { BlockuiComponent } from './../blockui/blockui.component';
import { CartblockComponent } from '../cartblock/cartblock.component';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { SizeComponent } from '../size/size.component';
import { environment } from 'src/environments/environment';
import { Request } from '../model/Request';
import { MatDialog } from '@angular/material/dialog';
import { MessageComponent } from '../message/message.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  isBlock: boolean = true;
  block =CartblockComponent;
  loginData: any;
  prod: any;
  qty: number = 1;
  size: any = '';
  sizeList:any;
  constructor(private dialog: MatDialog, private jolService: JolService, private router:Router) {}

  ngOnInit() {
    window.scrollTo(0, 0);
    this.loginData = this.jolService.loginData;
    this.prod = this.jolService.prod;
    this.sizeList = this.prod.size.split(",");
    console.log('this.sizeList', this.sizeList)
    console.log('this.prod', this.prod);
  }

  changeQty(isPlus: boolean) {
    this.qty = isPlus ? (this.qty += 1) : this.qty <= 1 ? 1 : (this.qty -= 1);
  }

  chooseSize(size: any) {
    this.size = size;
    console.log('size', this.size);
  }

  showSizeInfo() {
    this.dialog.open(SizeComponent);
  }
  addCart( isCart:boolean) {
    this.jolService.isWishBlock = isCart ? false : true;
    if(this.loginData.account != ''){
      if (this.size == '') {
        this.dialog.open(MessageComponent, {
          data: { msg: '請選擇尺寸'},
        });
      } else {
        this.blockUI.start('');
        const body = {
          type: 'ADD',
          prodId: this.prod.prodId,
          qty: this.qty,
          size: this.size,
          isCart: isCart,
        };
        let request = new Request('JOLCartInfo', this.loginData.account, body);
        console.log('request', request);
        this.jolService.getData(environment.JOLSERVER, request).subscribe((res) => {
          console.log('res', res);
          if(isCart){
            this.jolService.setCartNum(res.cartList.length);
          }else{
            this.jolService.setWishNum(res.cartList.length);
          }
        });
        setTimeout(() => {
          this.blockUI.stop();
        }, 700);
      }
      
    }else{
      this.router.navigate(['/login'], { skipLocationChange: true });
    }
  }

  tabChanged(event: any) {
    console.log('index',event.index)
    if (event.index === 2) {
      this.dialog.open(SizeComponent);
    }
  }
}
