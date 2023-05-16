import { Component, OnInit, HostListener, Input } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { JolService } from '../service/JolService.service';
import { environment } from 'src/environments/environment';
import { Request } from '../model/Request';
import { MessageComponent } from '../message/message.component';
import { SearchComponent } from '../search/search.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  navbarOpen = false;
  title:any="最新商品"
  logInData:any
  isLogin:boolean = false;
  constructor(private dialog: MatDialog,  private router: Router, private jolService: JolService) {}

  ngOnInit(): void {
    console.log('this.jolService.loginData',this.jolService.loginData)
    this.logInData = this.jolService.loginData;
    this.isLogin = this.jolService.isLogin;
  }

  setNavbarOpen() {
    this.navbarOpen = !this.navbarOpen;
  }

  logIn(){
    console.log('this.jolService.loginData',this.jolService.loginData)
    if(this.jolService.loginData.account != ""){

    }else{
      this.router.navigate(['/login']);
    }
  }
  logOut() {
    if (this.jolService.loginData.account != "") {
      const body = {
        type: "CLEAN",
        password: this.jolService.loginData.password,
        token: sessionStorage.getItem('token')
      };
      let request = new Request("LogIn", this.jolService.loginData.account, body);
      console.log('request', request)
      this.jolService.getData(environment.JOLSERVER, request).subscribe(res => {
        if(res.code == 200){
          sessionStorage.removeItem('token');
          this.jolService.resetLoginData();
          this.logInData = this.jolService.loginData;
          this.jolService.isLogin = false;
          this.isLogin =false;
          console.log('res', res);
          this.dialog.open(MessageComponent, { data: {msg:"登出成功"}});
          // alert('您已登出')
        }else{
          this.dialog.open(MessageComponent, { data:{msg:"登出異常" }});
        }
      });
    }
  }

  search(){
    this.dialog.open(SearchComponent);
  }
}
