import { Component, OnInit } from '@angular/core';
import { JolService } from './../service/JolService.service';
import { environment } from 'src/environments/environment';
import { Request } from '../model/Request';
import { Router } from '@angular/router';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MessageComponent } from '../message/message.component';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, ErrorStateMatcher {
  addressList: any = [];
  districtList: any = [];
  loginData: any = {
    account: "",
    password: "",
    token: "",
    tokenExpired:"",
    email:""
  };
  signUpData: any = {
    account: "",
    password: "",
    repassword: "",
    email: "",
    address: "",
    phone: "",
    userName: "",
    city: "02",
    district: "100"
  }
  isRember: boolean = false;
  isSignUp: boolean = false;
  /**登入、註冊檢核 */
  isCheckSign: boolean = false;
  isCheckLogin: boolean = false;
  /**錯誤訊息區開關 */
  isLoginSwitch: boolean = false;
  isSignupSwitch: boolean = false;
  /**登入資訊檢核 */
  isLoginError: boolean = false
  loginMsg: string = ""
  isLoginPW: boolean = false;
  isLoginAcc: boolean = false;
  isAccount: boolean = false;
  /**註冊資訊檢核 */
  isName: boolean = false;
  isPassword: boolean = false;
  isRepassword: boolean = false;
  isAddress: boolean = false;
  isPhone: boolean = false;
  isCity: boolean = false;
  isDistrict: boolean = false;
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  matcher = new MyErrorStateMatcher();

  constructor(private jolService: JolService, private router: Router, private dialog: MatDialog, private http: HttpClient) { }

  ngOnInit() {
    window.scrollTo(0,0)
    this.http.get('assets/json/address.json').subscribe((res) => {
      this.addressList = res;
      this.districtList = this.addressList[1].district;
    });
    if (localStorage.getItem('rember') != undefined) {
      var rember = JSON.parse(localStorage.getItem('rember'))
      console.log('rember', rember);
      if (rember.isRember) {
        this.loginData.account = rember.account;
        this.loginData.password = rember.password;
        this.isRember = rember.isRember;
      }
    }
  }

  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
  remberMe() {
    this.isRember = true;
  }
  logIn() {
    this.isLoginSwitch = true;
    this.checkLoginData();
    if (!this.isCheckLogin) {
      var rember = { isRember: this.isRember, account: this.loginData.account, password: this.loginData.password }
      localStorage.setItem('rember', JSON.stringify(rember));
      var loginData = JSON.parse(localStorage.getItem('loginData'));
      var token  = loginData != null ? loginData.token : this.loginData.token
      const body = {
        password: this.loginData.password,
        token: token
      };
      let request = new Request("LogIn", this.loginData.account,'', '', body);
      console.log('loginReq', request)
      this.jolService.getData(environment.JOLSERVER, request).subscribe(res => {
        console.log('res', res);
        if (res.code == 200) {
          this.jolService.isLogin = true;
          this.loginData.token = res.token;
          this.loginData.email = res.email;
          this.loginData.tokenExpired = res.tokenExpired;
          this.jolService.loginData = this.loginData
          localStorage.setItem('loginData', JSON.stringify(this.loginData));
          this.router.navigate(['/']);
        }
        else {
          this.isLoginError = true;
          this.loginMsg = res.msg;
          this.jolService.isLogin = false;
          this.logOut();
        }
      });
    }
  }

  logOut() {
    var data = JSON.parse(localStorage.getItem('loginData'));
    const body = {
      password: data.password,
      token: data.token,
    };
    let request = new Request('LogIn', data.account,"" , 'CLEAN', body);
    console.log('request', request);
    this.jolService
      .getData(environment.JOLSERVER, request)
      .subscribe((res) => {
        if (res.code == 200) {
          localStorage.removeItem('loginData');
          this.jolService.isLogin = false;
        }
      });
  }

  signUp() {
    this.isSignupSwitch = true;
    console.log('signUp', this.signUpData);
    this.checkSignData();
    if (!this.isCheckSign) {
      const body = {
        email: this.signUpData.email,
        password: this.signUpData.password,
        address: this.signUpData.address,
        name: this.signUpData.userName,
        phone: this.signUpData.phone,
        city: this.signUpData.city,
        district: this.signUpData.district,
        status: "1"
      }
      let request = new Request("JOLCustomerInfo", this.signUpData.account, "",'ADD', body);
      console.log('request', request)
      this.jolService.getData(environment.JOLSERVER, request).subscribe(res => {
        console.log('res', res);
        if (res.code == 200) {
          this.dialog.open(MessageComponent, { data: { msg: "註冊成功", fun: "" } });
        } else {
          this.dialog.open(MessageComponent, { data: { msg: res.msg } });
        }
      });

    }
  }

  showSignUp() {
    this.isSignUp = this.isSignUp ? false : true;
  }

  checkLoginData() {
    this.isCheckLogin = false;
    if (this.isLoginSwitch) {
      this.isLoginAcc = this.loginData.account == "" || this.loginData.account == "undefined" ? true : false;
      this.isLoginPW = this.loginData.password == "" || this.loginData.password == "undefined" ? true : false;
      this.isCheckLogin = this.isLoginAcc || this.isLoginPW ? true : false;
    }
  }

  checkSignData() {
    if (this.isSignupSwitch) {
      this.isCheckSign = false;
      this.isAccount = this.signUpData.account == '' ? true : false;
      this.isName = this.signUpData.userName == '' ? true : false;
      this.isPassword = this.signUpData.password == '' ? true : false;
      this.isRepassword = this.signUpData.repassword != this.signUpData.password || this.signUpData.repassword == '' ? true : false;
      this.isPhone = this.signUpData.phone == "" ? true : false;
      this.isAddress = this.signUpData.address == '' ? true : false;
      this.isCity = this.signUpData.city == '' ? true : false;
      this.isDistrict = this.signUpData.district == '' ? true : false;
      if (this.isAccount || this.isName || this.isPassword || this.isRepassword
        || this.isPhone || this.isAddress || this.isCity || this.isDistrict) {
        this.isCheckSign = true;
      }
    }
  }
  changeCity() {
    this.checkSignData();
    this.districtList = this.addressList.filter((a: any) => a.code == this.signUpData.city)[0].district;
  }
}


export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

