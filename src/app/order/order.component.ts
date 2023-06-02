import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Request } from '../model/Request';
import { JolService } from './../service/JolService.service';
import { Router } from '@angular/router';
import { BlockuiComponent } from './../blockui/blockui.component';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { MatDialog } from '@angular/material/dialog';
import { MessageComponent } from '../message/message.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

  @BlockUI() blockUI!: NgBlockUI;
  block = BlockuiComponent;
  loginData: any;
  cartList: any;
  sum: number = 0;
  ishidden: boolean = false;
  custData:any={name:"", phone:"", address:""};
  odr:any = {name:"", phone:"", city:"", district:"", address:"", email:"", vehicle:""};
  send:any = {name:"", phone:"", city:"", district:"", address:""};
  order:any;
  addressList:any=[];
  districtList:any =[];
  city:any ="02"
  constructor(private jolService: JolService, private router: Router, private dialog: MatDialog, private http: HttpClient)  { }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.loginData = this.jolService.loginData;
    this.getCustData();
    this.http.get('assets/json/address.json').subscribe((res) => {
      this.addressList = res;
      this.districtList = this.addressList[1].district;
    });
  }

  getCustData(){
    let request = new Request('JOLCustomerInfo', this.loginData.account, 'SELECT', {});
    console.log('request', request);
    this.jolService
      .getData(environment.JOLSERVER, request)
      .subscribe((res) => {
        this.custData = res.custList[0];
        this.odr = this.custData;
        console.log('custData',this.custData);
      });
  }
  checkOut(){
    
  }

  changeCity(){
    this.districtList = this.addressList.filter((a:any)=>a.code == this.city)[0].district;
    console.log('city',this.city)
  }

  onLoadImg(index: any) {
    if (index == this.cartList.length - 1) {
      this.blockUI.stop();

    }
  }

}
