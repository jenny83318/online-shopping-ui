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
  styleUrls: ['./cartitem.component.scss','./cartitemExtra.component.scss'],
})
export class CartitemComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  block = BlockuiComponent;
  loginData: any;
  payment: any;
  delivery: any;
  deliverFee: number = 0;
  cartList: any = [];
  sum: number = 0;
  ishidden: boolean = false;
  deliveryOpt: any = [
    { viewValue: '宅配', fee: 80 },
    { viewValue: '7-11超商取貨', fee: 60 },
    { viewValue: '自取', fee: 0 },
  ];
  paymentOpt: any = [
    { viewValue: 'Paypal' },
    { viewValue: 'Stripe Pay' },
  ];
  constructor(private jolService: JolService, private router: Router, private dialog: MatDialog) { }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.loginData = this.jolService.getLoginData();
    this.getCartData();
  }

  ngOnDestroy(): void {
    this.updateCartItem();
  }

  getCartData() {
    if (this.loginData.account != '') {
      const body = {
        isCart: true
      };
      let request = new Request('JOLCartInfo', this.loginData.account, this.loginData.token, 'SELECT', body);
      this.jolService
        .getData(environment.JOLSERVER, request)
        .subscribe((res) => {
          if(res.code == 200){

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
          }else if (res.code == 666){
            this.jolService.resetLoginData();
            this.router.navigate(['/login'], { skipLocationChange: false });
          }
          });
        } else {
          this.router.navigate(['/login'], { skipLocationChange: false });
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
        let request = new Request('JOLCartInfo', this.loginData.account, this.loginData.token ,'DELETE', body);
        this.jolService.getData(environment.JOLSERVER, request)
          .subscribe((res) => {
            if (res.code == 200) {
              this.getCartData();
            }else if (res.code == 666){
              this.jolService.resetLoginData();
              this.router.navigate(['/login'], { skipLocationChange: false });
            }
          });
      }
    });
  }

  updateCartItem() {
    this.cartList.forEach((cart: any) => {
      const body = {
        cartId: cart.cartId,
        prodId: cart.prodId,
        qty: cart.qty,
        size: cart.size,
        isCart: true,
      };
      let request = new Request('JOLCartInfo', this.loginData.account, this.loginData.token, 'UPDATE', body);
      this.jolService.getData(environment.JOLSERVER, request).subscribe((res) => {
        console.log('UPDATE CART', res);
      });
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

  toProductList() {
    this.jolService.getProductData("OTHER", { selectType: "series", keyWord: "new" });
  }

  toProduct(prodId: any) {
    this.blockUI.start('讀取中');
    let request = new Request('JOLProductInfo', this.loginData.account, this.loginData.token, 'SELECT', { prodId: prodId });
    this.jolService.getData(environment.JOLSERVER, request).subscribe((res) => {
      if (res.code == 200) {
        console.log('toProduct,', res)
        this.blockUI.stop();
        var prod = res.productList[0]
        prod.img = prod.imgUrl.split(',');
        this.jolService.prod = prod;
        console.log('this.jolService.prod', this.jolService.prod)
        this.router.navigate(['/product'], { skipLocationChange: false });
      } else if (res.code == 666) {
        this.jolService.resetLoginData();
        this.router.navigate(['/login'], { skipLocationChange: false });
      }
    });
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
    this.deliverFee = this.deliveryOpt.filter((d: any) => d.viewValue == this.delivery)[0].fee;
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
  padZeros(value: number, length: number): string {
    return value.toString().padStart(length, '0');
  }
}
