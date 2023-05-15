import { Component, OnInit } from '@angular/core';
import { JolService } from './../service/JolService.service';
import { environment } from 'src/environments/environment';
import { Request } from '../model/Request';
import { Router } from '@angular/router';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

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
    name:""
  }
  isRember: boolean = false;
  isSignUp: boolean = false;
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  matcher = new MyErrorStateMatcher();

  constructor(private jolService: JolService, private router: Router) { }
  ngOnInit() {
    // sessionStorage.setItem('token', 'ef8c1dad-ac81-42ec-8f29-f5ad7a357016');
    if (sessionStorage.getItem('isRember') == "true") {
      this.account = sessionStorage.getItem('account');
      this.password = sessionStorage.getItem('password');
      this.isRember = true;
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
      sessionStorage.setItem('isRember', this.isRember.toString());
      if (this.isRember) {
        sessionStorage.setItem('account', this.account);
        sessionStorage.setItem('password', this.password);
      }
      const body = {
        password: this.password,
        token: sessionStorage.getItem('token'),
        type: ""
      };
      let request = new Request("LogIn", this.account, body);
      console.log('request', request)
      this.jolService.getData(environment.JOLSERVER, request).subscribe(res => {
        console.log('res', res);
        if (res.code == 200) {
          this.jolService.loginData.account = this.account;
          this.jolService.loginData.password = this.password;
          this.jolService.loginData.token = res.token;
          sessionStorage.setItem('token', res.token);
          this.router.navigate(['/']);
        } else {
          alert(res.msg);
        }
      });
    }
  }

  signUp(){
    console.log('signUp',this.signUpData);
    const body =  {
      type: "ADD",
      email:this.signUpData.email,
      password: this.signUpData.password,
      address: this.signUpData.address,
      name: this.signUpData.name,
      phone:this.signUpData.phone
  }
    let request = new Request("JOLCustomerInfo",this.signUpData.account,body);
    console.log('request', request)
    this.jolService.getData(environment.JOLSERVER, request).subscribe(res => {
      console.log('res',res);
      if(res.code == 200){
        alert('註冊成功')
      }else{
        alert('註冊失敗')
      }
      // this.custList = res.custList
    });

  }
  showSignUp() {
    this.isSignUp = this.isSignUp ? false : true;
  }

}
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
