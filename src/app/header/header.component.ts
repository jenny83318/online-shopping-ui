import { Component, OnInit } from '@angular/core';
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
    sport: { title: '運動系列', change: 'SPORTS' },
  };

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private jolService: JolService
  ) { }

  ngOnInit(): void {
    this.logInData = this.jolService.getLoginData();
    console.log('HOME == this.logInData', this.logInData)
    this.isLogin = this.jolService.isLogin;
    if (!this.isLogin) {
      this.checkLogin();
    } else {
      this.getCartData();
    }
  }

  checkLogin() {
    if (this.logInData.account != "") {
      const body = {
        password: this.logInData.password,
        token: this.logInData.token,
      };
      let request = new Request('LogIn', this.logInData.account, '', 'CHECK', body);
      console.log('request', request);
      this.jolService
        .getData(environment.JOLSERVER, request)
        .subscribe((res) => {
          console.log('res', res);
          if (res.code == 200 && this.logInData.token === res.token) {
            this.isLogin = true;
            this.logInData.email = res.email;
            this.logInData.tokenExpired = res.tokenExpired;
            this.jolService.loginData = this.logInData;
            this.jolService.isLogin = true;
            this.getCartData();
          } else {
            this.jolService.resetLoginData();
          }
        });
    }
  }

  setNavbarOpen() {
    this.navbarOpen = !this.navbarOpen;
  }
  setNavbarClose() {
    this.navbarOpen = false;
  }

  logOut() {
    this.setNavbarClose();
    if (this.jolService.loginData.account != '') {
      const body = {
        password: this.logInData.password,
        token: this.logInData.token,
      };
      let request = new Request(
        'LogIn',
        this.jolService.loginData.account, '',
        'CLEAN',
        body
      );
      console.log('request', request);
      this.jolService
        .getData(environment.JOLSERVER, request)
        .subscribe((res) => {
          if (res.code == 200) {
            this.jolService.resetLoginData();
            this.logInData = this.jolService.loginData;
            this.isLogin = false;
            console.log('res', res);
            const dialogRef = this.dialog.open(MessageComponent, { data: { msg: '您已登出' } });
            dialogRef.afterClosed().subscribe(isConfirm => {
              window.location.reload();
              this.router.navigate(['/']);
            })
          } else {
            this.dialog.open(MessageComponent, { data: { msg: '登出異常' } });
          }
        });
    }
  }

  getCartData() {
    if (this.jolService.cartStatus) {
      this.cartCount = this.jolService.cartNum;
      this.jolService.cartChange.subscribe((count) => {
        this.cartCount = count;
      });
    } else {
      let request = new Request('JOLCartInfo', this.logInData.account, this.logInData.token, 'ALL', {});
      console.log('request', request);
      this.jolService.getData(environment.JOLSERVER, request).subscribe((res) => {
        if (res.code == 200) {
          this.jolService.cartStatus = true;
          this.jolService.cartNum = res.cartList.filter((c: any) => c.cart == true).length;
          this.jolService.wishNum = res.cartList.filter((c: any) => c.cart == false).length;
          this.cartCount = this.jolService.cartNum;
          this.wishCount = this.jolService.wishNum;
        } else if (res.code == 666) {
          this.jolService.resetLoginData();
          this.router.navigate(['/login']);
        }
      });
    }
  }
  search() {
    this.setNavbarClose();
    if (this.keyWord == undefined || this.keyWord.trim() == '') {
      this.dialog.open(MessageComponent, {
        data: { msg: '請輸入要搜尋的內容' },
      });
    } else {
      this.jolService.toProductList = 'search'
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
    this.setNavbarClose();
    this.router.navigate(['/login']);
  }

  toHome() {
    this.setNavbarClose();
    this.router.navigate(['/']);
  }

  toCartItem() {
    this.setNavbarClose();
    this.redirectPage("cartitem");
  }

  toWishItem() {
    this.setNavbarClose();
    this.redirectPage("wishitem");
  }

  toOrderList() {
    this.setNavbarClose();
    this.redirectPage("orderlist");
  }

  toMember() {
    this.setNavbarClose();
    this.redirectPage("member");
  }

  toProductList(selectType: any, keyWord: any) {
    this.setNavbarClose();
    if (selectType == 'category') {
      this.jolService.toProductList = 'all'
    } else {
      this.jolService.toProductList = keyWord
    }
    this.jolService.getProductData('OTHER', {
      selectType: selectType,
      keyWord: keyWord,
    });
  }

  redirectPage(path: any) {
    if (this.isLogin == false) {
      this.router.navigate(['/login']);
    } else {
      this.router.navigate(['/' + path]);
    }
  }
}
