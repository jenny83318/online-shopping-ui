import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Request } from '../model/Request';
import { JolService } from './../service/JolService.service';
import { Router } from '@angular/router';
import { BlockuiComponent } from './../blockui/blockui.component';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { MatDialog } from '@angular/material/dialog';
import { MessageComponent } from '../message/message.component';
@Component({
  selector: 'app-cartitem',
  templateUrl: './cartitem.component.html',
  styleUrls: ['./cartitem.component.scss'],
})
export class CartitemComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  block = BlockuiComponent;
  loginData: any;
  payment: any;
  delivery: any;
  deliverFee: number = 0;
  cartList: any;
  sum: number = 0;
  ishidden: boolean = false;
  deliveryOpt: any = [
    { value: 'delivery', viewValue: '宅配' },
    { value: 'convenient', viewValue: '7-11超商取貨' },
    { value: 'take', viewValue: '自取' },
  ];
  paymentOpt: any = [
    { value: 'creditCard', viewValue: '信用卡刷卡' },
    { value: 'bank', viewValue: '銀行轉帳' },
    { value: 'electric', viewValue: '電子支付' },
  ];
  constructor(private jolService: JolService, private router: Router, private dialog: MatDialog) { }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.loginData = this.jolService.loginData;
    this.getCartData();
  }

  getCartData() {
    if (this.loginData.account != '') {
      const body = {
        isCart: true
      };
      let request = new Request('JOLCartInfo', this.loginData.account, 'SELECT', body);
      this.jolService
        .getData(environment.JOLSERVER, request)
        .subscribe((res) => {
          this.blockUI.start('讀取中');
          this.cartList = res.cartList;
          if (this.cartList.length == 0) {
            this.sum == 0;
            this.ishidden = true;
            this.blockUI.stop();
          }
          this.jolService.setCartNum(this.cartList.length);
          this.sum = 0
          this.cartList.forEach((cart: any) => {
            cart.isCheck = false;
            cart.img = [];
            cart.img = cart.imgUrl.split(',');
            cart.isOnload = false;
            this.sum += cart.qty * cart.price;
          });
          this.jolService.sortByKey(this.cartList, "updateDt", true);
        });
    } else {
      this.router.navigate(['/login'], { skipLocationChange: true });
    }
  }

  deleteCartItem(cartId: any) {
    const dialogRef = this.dialog.open(MessageComponent, { data: { msg: '您確定要刪除?', isConfirm: true } });
    dialogRef.afterClosed().subscribe(isConfirm => {
      if (isConfirm) {
        const body = {
          isCart: true,
          cartId: cartId
        };
        let request = new Request('JOLCartInfo', this.loginData.account, 'DELETE', body);
        this.jolService.getData(environment.JOLSERVER, request)
          .subscribe((res) => {
            if (res.code == 200) {
              this.getCartData();
            }
          });
      }
    });
  }
  submit() {
    if (this.delivery == undefined) {
      this.dialog.open(MessageComponent, { data: { msg: '請選擇配送方式' } });
    } else if (this.payment == undefined) {
      this.dialog.open(MessageComponent, { data: { msg: '請選擇付款方式' } });
    } else {
      this.jolService.totAmt = this.sum + this.deliverFee;
      this.jolService.payment = this.payment;
      this.jolService.delivery = this.delivery;
      this.jolService.cartList = this.cartList;
      this.router.navigate(['/order'], { skipLocationChange: true });
    }
  }

  changeQty(isPlus: boolean, cartId: any) {
    this.cartList.forEach((cart: any) => {
      if (cart.cartId == cartId) {
        cart.qty = isPlus ? (cart.qty += 1) : cart.qty <= 1 ? 1 : (cart.qty -= 1);
        this.countSum();
      }
    })
  }

  changeDelivery() {
    if (this.delivery == 'delivery') {
      this.deliverFee = 80;
    } else if (this.delivery == 'convenient') {
      this.deliverFee = 60
    }
  }

  countSum() {
    this.sum = 0;
    this.cartList.forEach((cart: any) => {
      this.sum += cart.qty * cart.price;
    })
  }
  onLoadImg(index: any) {
    if (index == this.cartList.length - 1) {
      this.blockUI.stop();

    }
  }
}
