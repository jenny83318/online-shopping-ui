import { Component, OnInit, HostListener, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { JolService } from '../service/JolService.service';
import { environment } from 'src/environments/environment';
import { Request } from '../model/Request';
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
  constructor(
    private dialog: MatDialog,
    private router: Router,
    private jolService: JolService
  ) {}

  ngOnInit(): void {
    console.log('this.jolService.loginData', this.jolService.loginData);
    this.logInData = this.jolService.loginData;
    this.isLogin = this.jolService.isLogin;
    if(this.isLogin == false){
      if(localStorage.getItem('account')!= undefined){
        const body = {
        password:  localStorage.getItem('password'),
        token: localStorage.getItem('token'),
        type: ""
      };
      let request = new Request("LogIn", localStorage.getItem('account'), body);
      console.log('request', request)
      this.jolService.getData(environment.JOLSERVER, request).subscribe(res => {
        console.log('res', res);
        if (res.code == 200) {
          this.logInData.account = localStorage.getItem('account');
          this.logInData.password = localStorage.getItem('password');
          this.logInData.token = localStorage.getItem('token');
          this.isLogin = true;
          this.jolService.loginData = this.logInData;
          this.jolService.isLogin = true;
          this.jolService.loginData.token = res.token;
          localStorage.setItem('token', res.token);
          this.router.navigate(['/']);
        } else {
          alert(res.msg);
          this.jolService.isLogin = false;
        }
      });
    }
    }
    if (this.isLogin) {
      this.getCartData();
      this.jolService.cartChange.subscribe((count) => {
        this.cartCount = count;
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
        password: this.jolService.loginData.password,
        token: localStorage.getItem('token'),
      };
      let request = new Request(
        'LogIn',
        this.jolService.loginData.account,
        body
      );
      console.log('request', request);
      this.jolService
        .getData(environment.JOLSERVER, request)
        .subscribe((res) => {
          if (res.code == 200) {
            localStorage.removeItem('token');
            localStorage.removeItem('account');
            localStorage.removeItem('password');
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
      type: 'SELECT',
      isCart: true,
    };
    let request = new Request('JOLCartInfo', this.logInData.account, body);
    console.log('request', request);
    this.jolService.getData(environment.JOLSERVER, request).subscribe((res) => {
      this.jolService.cartNum = res.cartList.length;
      this.cartCount = this.jolService.cartNum;
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
    this.router.navigate(['/cartitem'] ,{ skipLocationChange: true });
  }
}
