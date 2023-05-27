import { Component, OnInit, HostListener, Input } from '@angular/core';
import { Router } from '@angular/router';
import { JolService } from '../service/JolService.service';
import { environment } from 'src/environments/environment';
import { Request } from '../model/Request';
import { MatDialog } from '@angular/material/dialog';
import { MessageComponent } from '../message/message.component';
import { SearchComponent } from '../search/search.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  navbarOpen = false;
  title: any = '最新商品';
  logInData: any;
  isLogin: boolean = false;
  cartCount: number = 0;
  wishCount:number = 0;
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
      console.log(' this.logInData', this.logInData)
      const body = {
        password: this.logInData.password,
        token: this.logInData.token,
        type: '',
      };
      let request = new Request('LogIn', this.logInData.account, body);
      console.log('request', request);
      this.jolService
        .getData(environment.JOLSERVER, request)
        .subscribe((res) => {
          console.log('res', res);
          if (res.code == 200) {
            this.isLogin = true;
            this.jolService.loginData = this.logInData;
            this.jolService.isLogin = true;
            this.jolService.loginData.token = res.token;
            this.getCartData();
            this.jolService.cartChange.subscribe((count) => {
              this.cartCount = count;
            });
            this.jolService.wishChange.subscribe((count) => {
              this.wishCount = count;
            });
          } else if(res.code == 777) {
            this.logOut();
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
        type: 'CLEAN',
        password: this.logInData.password,
        token: this.logInData.token,
      };
      let request = new Request( 'LogIn', this.jolService.loginData.account, body);
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
    const body = {
      type: 'ALL'
    };
    let request = new Request('JOLCartInfo', this.logInData.account, body);
    console.log('request', request);
    this.jolService.getData(environment.JOLSERVER, request).subscribe((res) => {
      this.jolService.cartNum = res.cartList.filter((c:any)=>c.cart == true).length;
      this.jolService.wishNum = res.cartList.filter((c:any)=>c.cart == false).length;
      this.cartCount = this.jolService.cartNum;
      this.wishCount = this.jolService.wishNum;
      console.log('this.cartCount',this.cartCount)
      console.log('this.wishCount',this.wishCount)

      console.log('res', res);
    });
  }
  search() {
    this.dialog.open(SearchComponent);
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
  toWishItem(){
    this.router.navigate(['/wishitem'], { skipLocationChange: true });
  }
}
