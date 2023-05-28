import { JolService } from './../service/JolService.service';
import { Component, Input, OnInit } from '@angular/core';
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
  block = CartblockComponent;
  loginData: any;
  prod: any;
  qty: number = 1;
  size: any = '';
  sizeList: any;
  heartClass: any = 'far fa-heart';
  isWish: boolean = false;
  cart:any;
  constructor(private dialog: MatDialog, private jolService: JolService, private router: Router) { }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.loginData = this.jolService.loginData;
    this.prod = this.jolService.prod;
    this.sizeList = this.prod.size.split(",");
    console.log('this.sizeList', this.sizeList)
    console.log('this.prod', this.prod);
    this.checkWish();
  }

  ngOnDestroy() {
    if (this.heartClass == 'fa fa-heart') {
      this.addCartWish(false);
    }
    if (this.isWish == true && this.heartClass == 'far fa-heart') {
      this.deleteWishItem(this.cart.cartId)
    }
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

  checkWish() {
    const body = {
      type: 'OTHER',
      prodId: this.prod.prodId,
      qty: this.qty,
      size: this.size,
      isCart: false,
    };
    let request = new Request('JOLCartInfo', this.loginData.account, body);
    console.log('request', request);
    this.jolService.getData(environment.JOLSERVER, request).subscribe((res) => {
      if (res.cartList.length > 0) {
        this.cart = res.cartList[0];
        this.heartClass = 'fa fa-heart';
        this.isWish = true;
      } else {
        this.heartClass = 'far fa-heart';
        this.isWish = false;
      }
      console.log('wish', res)
    });
  }
  addCartWish(isCart: boolean) {
    if (this.loginData.account != '') {
      if (this.size == '' && isCart) {
        this.dialog.open(MessageComponent, {
          data: { msg: '請選擇尺寸' },
        });
      } else {
        this.blockUI.start(isCart ? 'cart' : 'wish');
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
          this.heartClass = res.code == 333 ? 'far fa-heart' : "fa fa-heart"
          console.log('res', res);
          if (isCart) {
            this.jolService.setCartNum(res.cartList.length);
          } else {
            this.jolService.setWishNum(res.cartList.length);
          }
        });
        setTimeout(() => {
          this.blockUI.stop();
        }, 700);
      }

    } else {
      this.router.navigate(['/login'], { skipLocationChange: true });
    }
  }

  deleteWishItem(cartId: any) {
    const body = {
      type: 'DELETE',
      isCart: true,
      cartId: cartId
    };
    let request = new Request('JOLCartInfo', this.loginData.account, body);
    console.log('request', request);
    this.jolService
      .getData(environment.JOLSERVER, request)
      .subscribe((res) => {
      });
  }

  changeIcon() {
    this.heartClass = this.heartClass == 'far fa-heart' ? 'fa fa-heart' : "far fa-heart"
    if (this.heartClass == 'far fa-heart') {
      this.jolService.setWishNum(this.jolService.wishNum - 1);
    } else {
      this.jolService.setWishNum(this.jolService.wishNum + 1);
    }
  }
  tabChanged(event: any) {
    console.log('index', event.index)
    if (event.index === 2) {
      this.dialog.open(SizeComponent);
    }
  }
}
