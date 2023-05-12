import { Component, OnInit } from '@angular/core';
import { JolService } from './../service/JolService.service';
import { environment } from 'src/environments/environment';
import { Request } from '../model/Request';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  account: any;
  password: any;
  isRember: boolean = false;
  constructor(private jolService: JolService, private router: Router) { }

  ngOnInit() {
    // sessionStorage.setItem('token', 'ef8c1dad-ac81-42ec-8f29-f5ad7a357016');
    if (sessionStorage.getItem('isRember') == "true") {
      this.account = sessionStorage.getItem('account');
      this.password = sessionStorage.getItem('password');
      this.isRember = true;
    }
  }
  // getHomeData(){
  //   const body =  {type: "ALL"}
  //   let request = new Request("JOLCustomerInfo","jenny83318",body);
  //   console.log('request', request)
  //   this.jolService.getData(environment.JOLSERVER, request).subscribe(res => {
  //     console.log('res',res);
  //     this.custList = res.custList

  //   });
  // }
  remberMe() {
    this.isRember = true;
  }
  logIn() {
    if (this.account == "") {
      alert('請輸入帳號')
    } else if (this.password == "") {
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


}
