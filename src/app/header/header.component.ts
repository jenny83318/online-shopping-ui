import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { JolService } from '../service/JolService.service';
import { environment } from 'src/environments/environment';
import { Request } from '../model/Request';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  navbarOpen = false;
  title:any="最新商品"
  constructor(public dialog: MatDialog,  private router: Router, private jolService: JolService) {}

  ngOnInit(): void {}

  setNavbarOpen() {
    this.navbarOpen = !this.navbarOpen;
  }

  logIn(){
    this.router.navigate(['/login']);
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
          console.log('res', res);
        }else{
          alert("系統異常")
        }
      });
    }
  }
}
