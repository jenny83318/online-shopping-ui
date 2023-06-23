import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { JolService } from '../service/JolService.service';
import { environment } from 'src/environments/environment';
import { Request } from '../model/Request';
import { MatDialog } from '@angular/material/dialog';
import { MessageComponent } from '../message/message.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  navbarOpen = false;
  title: any = {
    all: '全部商品',
    new: '最新商品',
    sales: '熱銷商品',
    sport: '運動系列',
  };
  logInData: any;
  isLogin: boolean = false;
  cartCount: number = 0;
  wishCount: number = 0;
  keyWord: any;
  isChange: boolean = false;
  changeType: string = '';
  header: any = {
    all: { title: '全部商品', change: 'SHOP ALL' },
    new: { title: '最新商品', change: 'NEW ARRIVAL' },
    sales: { title: '熱銷商品', change: 'RESOTCK' },
    sport: { title: '運動系列', change: 'sportswear' },
  };

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private jolService: JolService
  ) {}

  ngOnInit(): void {
    console.log('this.jolService.loginData', this.jolService.loginData);
    this.logInData = this.jolService.loginData;
    this.isLogin = this.jolService.isLogin;
    if (this.isLogin == false) {
      this.checkLogin();
    }
    if (this.isLogin) {
      this.getCartData();
      this.jolService.cartChange.subscribe((count) => {
        this.cartCount = count;
      });
      this.jolService.wishChange.subscribe((count) => {
        this.wishCount = count;
      });
    }
  }

  checkLogin() {
    if (localStorage.getItem('loginData') != null) {
      this.logInData = JSON.parse(localStorage.getItem('loginData'));
      console.log(' this.logInData', this.logInData);
      const body = {
        password: this.logInData.password,
        token: this.logInData.token,
      };
      let request = new Request('LogIn', this.logInData.account, '', body);
      console.log('request', request);
      this.jolService
        .getData(environment.JOLSERVER, request)
        .subscribe((res) => {
          console.log('res', res);
          if (res.code == 200) {
            this.isLogin = true;
            this.logInData.email = res.email;
            this.jolService.loginData = this.logInData;
            this.jolService.isLogin = true;
            this.getCartData();
            this.jolService.cartChange.subscribe((count) => {
              this.cartCount = count;
            });
            this.jolService.wishChange.subscribe((count) => {
              this.wishCount = count;
            });
          } else if (res.code == 777) {
            this.logOut();
          } else {
            this.toLogIn();
          }
        });
    }
  }

  setNavbarOpen() {
    this.navbarOpen = !this.navbarOpen;
  }

  logOut() {
    if (this.jolService.loginData.account != '') {
      const body = {
        password: this.logInData.password,
        token: this.logInData.token,
      };
      let request = new Request(
        'LogIn',
        this.jolService.loginData.account,
        'CLEAN',
        body
      );
      console.log('request', request);
      this.jolService
        .getData(environment.JOLSERVER, request)
        .subscribe((res) => {
          if (res.code == 200) {
            localStorage.removeItem('loginData');
            this.jolService.resetLoginData();
            this.logInData = this.jolService.loginData;
            this.jolService.isLogin = false;
            this.isLogin = false;
            console.log('res', res);
            this.dialog.open(MessageComponent, { data: { msg: '您已登出' } });
          } else {
            this.dialog.open(MessageComponent, { data: { msg: '登出異常' } });
          }
        });
    }
  }

  getCartData() {
    let request = new Request('JOLCartInfo', this.logInData.account, 'ALL', {});
    console.log('request', request);
    this.jolService.getData(environment.JOLSERVER, request).subscribe((res) => {
      this.jolService.cartNum = res.cartList.filter(
        (c: any) => c.cart == true
      ).length;
      this.jolService.wishNum = res.cartList.filter(
        (c: any) => c.cart == false
      ).length;
      this.cartCount = this.jolService.cartNum;
      this.wishCount = this.jolService.wishNum;
    });
  }
  search() {
    if (this.keyWord == undefined || this.keyWord.trim() == '') {
      this.dialog.open(MessageComponent, {
        data: { msg: '請輸入要搜尋的內容' },
      });
    } else {
      this.jolService.getProductData('OTHER', {
        selectType: 'keyWord',
        keyWord: this.keyWord,
      });
    }
  }
  changeName(type: any, isChange: boolean) {
    this.changeType = type;
    this.isChange = isChange;
    var header = this.header[type];
    if (isChange) {
      this.title[type] = header.change;
    } else {
      this.title[type] = header.title;
    }
  }

  toLogIn() {
    this.router.navigate(['/login'], { skipLocationChange: true });
  }

  toHome() {
    this.router.navigate(['/']);
  }
  toCartItem() {
    this.router.navigate(['/cartitem'], { skipLocationChange: true });
  }
  toWishItem() {
    this.router.navigate(['/wishitem'], { skipLocationChange: true });
  }
  toOrderList() {
    this.router.navigate(['/orderlist'], { skipLocationChange: true });
  }
  toProductList(selectType: any, keyWord: any) {
    this.jolService.getProductData('OTHER', {
      selectType: selectType,
      keyWord: keyWord,
    });
  }
  toMember() {
    this.router.navigate(['/member'], { skipLocationChange: true });
  }
}
