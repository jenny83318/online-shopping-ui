import { Component, OnInit } from '@angular/core';
import { JolService } from './../service/JolService.service';
import { environment } from 'src/environments/environment';
import { Request } from '../model/Request';
import { Router } from '@angular/router';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MessageComponent } from '../message/message.component';
import {MatDialog} from '@angular/material/dialog';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, ErrorStateMatcher {

  account: any;
  password: any;
  signUpData:any = {
    account:"",
    password:"",
    repassword:"",
    email:"",
    address:"",
    phone:"",
    userName:""
  }
  isRember: boolean = false;
  isSignUp: boolean = false;
  isCheck:boolean = false;
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  matcher = new MyErrorStateMatcher();

  constructor(private jolService: JolService, private router: Router, private dialog: MatDialog) { }
  ngOnInit() {
    if(localStorage.getItem('rember') != undefined){
      var rember = JSON.parse(localStorage.getItem('rember'))
      console.log('rember',rember);
      if (rember.isRember) {
        this.account = rember.account;
        this.password = rember.password;
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
    if (this.account == "" || this.account == "undefined") {
      alert('請輸入帳號')
    } else if (this.password == "" || this.password == "undefined") {
      alert('請輸入密碼')
    } else {
      var json = {isRember: this.isRember, account: this.account, password: this.password}
      localStorage.setItem('rember', JSON.stringify(json));
      localStorage.setItem('account', this.account);
      localStorage.setItem('password', this.password);
      const body = {
        password: this.password,
        token: localStorage.getItem('token'),
        type: ""
      };
      let request = new Request("LogIn", this.account, body);
      console.log('request', request)
      this.jolService.getData(environment.JOLSERVER, request).subscribe(res => {
        console.log('res', res);
        if (res.code == 200) {
          this.jolService.loginData.account = this.account;
          this.jolService.loginData.password = this.password;
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

  signUp(){
    console.log('signUp',this.signUpData);
    this.checkSignData();
    if(this.isCheck){

      const body =  {
        type: "ADD",
        email:this.signUpData.email,
        password: this.signUpData.password,
        address: this.signUpData.address,
        name: this.signUpData.userName,
        phone:this.signUpData.phone,
        status:"1"
      }
      let request = new Request("JOLCustomerInfo",this.signUpData.account,body);
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
    }else{
      this.isCheck = true;
    }
  }
}


export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

