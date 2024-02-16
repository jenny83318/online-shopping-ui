import { JolService } from './../service/JolService.service';
import { Component, OnInit, ViewChild } from '@angular/core';
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
  styleUrls: ['./product.component.scss', './productExtra.component.scss'],
})
export class ProductComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  isBlock: boolean = true;
  @ViewChild('tabContent') tabContent: any;
  block = CartblockComponent;
  loginData: any;
  prod: any;
  qty: number = 1;
  size: any = '';
  sizeList: any;
  heartClass: any = 'far fa-heart';
  isWish: boolean = false;
  cart: any;
  isLogin: boolean = false;
  constructor(private dialog: MatDialog, private jolService: JolService, private router: Router) { }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.loginData = this.jolService.getLoginData();
    this.prod = this.jolService.prod;
    if (this.prod == undefined) {
      this.prod = localStorage.getItem('loginData') != null ? JSON.parse(localStorage.getItem('prod')) : this.prod;
      if (this.prod == null || this.prod == undefined) {
        this.router.navigate(['/']);
      }
    } else {
      localStorage.setItem('prod', JSON.stringify(this.prod))
    }
    this.sizeList = this.prod.sizeInfo.split(",");
    this.prod.img[0] = this.jolService.getImgUrl(this.prod.img[0]);
    this.prod.img[1] = this.jolService.getImgUrl(this.prod.img[1]);
    if (this.sizeList[0] == 'F') {
      this.size = 'F'
    }
    this.checkWish();
  }
  ngAfterViewInit() {
    this.tabContent.nativeElement.innerHTML = this.prod.descript;
    console.log('this.tabContent', this.tabContent.nativeElement)
  }
  ngOnDestroy() {
    if (this.heartClass == 'fa fa-heart') {
      this.addCartWish(false, false, true);
    }
    if (this.isWish == true && this.heartClass == 'far fa-heart') {
      this.deleteWishItem(this.cart.cartId);
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
      prodId: this.prod.prodId,
      qty: this.qty,
      size: this.size,
      isCart: false,
    };
    let request = new Request('JOLCartInfo', this.loginData.account, this.loginData.token, 'OTHER', body);
    console.log('request', request);
    this.jolService.getData(environment.JOLSERVER, request).subscribe((res) => {
      if (res.code == 200) {
        this.isLogin = true;
        if (res.cartList.length > 0) {
          this.cart = res.cartList[0];
          this.heartClass = 'fa fa-heart';
          this.isWish = true;
        } else {
          this.heartClass = 'far fa-heart';
          this.isWish = false;
        }
      } else if (res.code == 666) {
        this.isLogin = false;
      }
    });
  }
  addCartWish(isCart: boolean, isRouter: boolean, ischange: boolean) {
    if (this.loginData.account != '') {
      if (this.size == '' && isCart) {
        this.dialog.open(MessageComponent, {
          data: { msg: '請選擇尺寸' },
        });
      } else {
        this.jolService.addCartWish(this.prod.prodId, this.qty, this.size, isCart, isRouter, ischange);
      }

    } else {
      this.router.navigate(['/login']);
    }
  }

  deleteWishItem(cartId: any) {
    const body = {
      type: 'DELETE',
      isCart: true,
      cartId: cartId
    };
    let request = new Request('JOLCartInfo', this.loginData.account, this.loginData.token, 'DELETE', body);
    console.log('request', request);
    this.jolService
      .getData(environment.JOLSERVER, request)
      .subscribe((res) => {
        this.jolService.setWishList([]);
        if (res.code == 666) {
          this.jolService.reLogin();
        }
      });
  }

  changeIcon() {
    if (this.isLogin) {
      this.heartClass = this.heartClass == 'far fa-heart' ? 'fa fa-heart' : "far fa-heart"
      if (this.heartClass == 'far fa-heart') {
        this.jolService.setWishNum(this.jolService.wishNum - 1);
      } else {
        this.blockUI.start('wish');
        this.jolService.setWishNum(this.jolService.wishNum + 1);
        setTimeout(() => {
          this.blockUI.stop();
        }, 700);
      }
    } else {
      const dialogRef = this.dialog.open(MessageComponent, { data: { msg: '登入逾時，請重新登入' } });
        dialogRef.afterClosed().subscribe(() => {
          this.jolService.resetLoginData();
          this.router.navigate(['/login']);
        });
    }
  }
  tabChanged(event: any) {
    console.log('index', event.index)
    if (event.index === 2) {
      this.dialog.open(SizeComponent);
    }
  }
  toImage(url: any) {
    window.open(url, '_blank');
  }
}
