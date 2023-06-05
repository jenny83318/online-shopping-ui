import { Component, OnInit } from '@angular/core';
import { JolService } from './../service/JolService.service';
import { environment } from 'src/environments/environment';
import { Request } from '../model/Request';
import { Router } from '@angular/router';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MessageComponent } from '../message/message.component';
import {MatDialog} from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, ErrorStateMatcher {
  addressList:any = [];
  districtList:any = [];
  signUpData:any = {
    account:"",
    password:"",
    repassword:"",
    email:"",
    address:"",
    phone:"",
    userName:"",
    city:"",
    district:""
  }
  isRember: boolean = false;
  isSignUp: boolean = false;
  isCheck:boolean = false;
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  matcher = new MyErrorStateMatcher();
  loginData:any ={account:"", password:"", token:""};
  constructor(private jolService: JolService, private router: Router, private dialog: MatDialog, private http: HttpClient) { }
  ngOnInit() {
    this.http.get('assets/json/address.json').subscribe((res) => {
      this.addressList = res;
      this.districtList = this.addressList[1].district;
    });
    if(localStorage.getItem('rember') != undefined){
      var rember = JSON.parse(localStorage.getItem('rember'))
      console.log('rember',rember);
      if (rember.isRember) {
        this.loginData.account = rember.account;
        this.loginData.password = rember.password;
        this.isRember = rember.isRember;
      }
    }
    if(localStorage.getItem('loginData') != null){
      this.logOut();
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
    if (this.loginData.account == "" || this.loginData.account == "undefined") {
      alert('請輸入帳號')
    } else if (this.loginData.password == "" || this.loginData.password == "undefined") {
      alert('請輸入密碼')
    } else {
      var rember = {isRember: this.isRember, account: this.loginData.account, password: this.loginData.password}
      localStorage.setItem('rember', JSON.stringify(rember));
      const body = {
        password: this.loginData.password,
        token: this.loginData.token,
      };
      let request = new Request("LogIn", this.loginData.account,'', body);
      console.log('request', request)
      this.jolService.getData(environment.JOLSERVER, request).subscribe(res => {
        console.log('res', res);
        if (res.code == 200) {
          this.jolService.isLogin = true;
          this.loginData.token = res.token;
          this.jolService.loginData = this.loginData
          localStorage.setItem('loginData', JSON.stringify(this.loginData));
          this.router.navigate(['/']);
        } else {
          alert(res.msg);
          this.jolService.isLogin = false;
        }
      });
    }
  }

  logOut(){
    var data = JSON.parse(localStorage.getItem('loginData'));
    const body = {
      password: data.password,
      token: data.token,
    };
    let request = new Request( 'LogIn', data.account,'CLEAN', body);
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

  signUp(){
    console.log('signUp',this.signUpData);
    this.checkSignData();
    if(this.isCheck){

      const body =  {
        email:this.signUpData.email,
        password: this.signUpData.password,
        address: this.signUpData.address,
        name: this.signUpData.userName,
        phone:this.signUpData.phone,
        city: this.signUpData.city,
        district: this.signUpData.district,
        status:"1"
      }
      let request = new Request("JOLCustomerInfo",this.signUpData.account, 'ADD',body);
      console.log('request', request)
      this.jolService.getData(environment.JOLSERVER, request).subscribe(res => {
        console.log('res',res);
        if(res.code == 200){
          this.dialog.open(MessageComponent, { data: {msg:"註冊成功", fun:""} });
        }else{
          this.dialog.open(MessageComponent, { data: {msg:"註冊失敗", fun:""}});
        }
      });

    }
  }
  showSignUp() {
    this.isSignUp = this.isSignUp ? false : true;
  }

  checkSignData(){
    this.isCheck = false;
    if(this.signUpData.userName ==''){
      this.dialog.open(MessageComponent, { data:{msg:"姓名不可為空"}});
    } else if(this.signUpData.account ==''){
      this.dialog.open(MessageComponent, { data: {msg:"帳號不可為空" }});
    } else if(this.signUpData.password ==''){
      this.dialog.open(MessageComponent, { data:{msg: "密碼不可為空" }});
    }else if(this.signUpData.repassword ==''){
      this.dialog.open(MessageComponent, { data:{msg: "再次輸入密碼不可為空" }});
    }else if(this.signUpData.repassword != this.signUpData.password){
      this.dialog.open(MessageComponent, { data:{msg: "兩次密碼輸入不同，請重新輸入" }});
    }else if(this.signUpData.phone == ''){
      this.dialog.open(MessageComponent, { data:{msg:"手機不可為空" }});
    }else if(this.signUpData.address == ''){
      this.dialog.open(MessageComponent, { data:{msg:"地址不可為空" }});
    } else if(this.signUpData.city == ''){
      this.dialog.open(MessageComponent, { data:{msg:"請選擇縣市" }});
    } else if(this.signUpData.district == ''){
      this.dialog.open(MessageComponent, { data:{msg:"請選擇地區" }});
    }else{
      this.isCheck = true;
    }
  }
  changeCity() {
    this.districtList = this.addressList.filter(
      (a: any) => a.code ==  this.signUpData.city
    )[0].district;
  }
}


export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

