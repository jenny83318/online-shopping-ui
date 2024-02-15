import { Component, OnInit, NgZone } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Request } from '../model/Request';
import { JolService } from './../service/JolService.service';
import { Router } from '@angular/router';
import { BlockuiComponent } from './../blockui/blockui.component';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { HttpClient } from '@angular/common/http';
import { IPayPalConfig} from 'ngx-paypal';
import { MatDialog } from '@angular/material/dialog';
import { MessageComponent } from '../message/message.component';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.scss']
})
export class MemberComponent implements OnInit {
  paymentHandler: any = null;
  @BlockUI() blockUI!: NgBlockUI;
  block = BlockuiComponent;
  loginData: any;
  cartList: any;
  ishidden: boolean = false;
  isUpdate: boolean = false;
  isSame: boolean = false;
  isDisable:boolean = false;
  districtList: any = [];
  addressList: any = [];
  itemList: any = [];
  custData: any;
  orderNo:any ="";
  payPalConfig?: IPayPalConfig;
  member: any = {
    email: "",
    name: "",
    phone: "",
    city: "",
    district: "",
    address: "",
  }
  //check
  isCheck: boolean = false;
  isEmail: boolean = false;
  isName: boolean = false;
  isPhone: boolean = false;
  isCity: boolean = false;
  isDistrict: boolean = false;
  isAddress: boolean = false;
  constructor(private jolService: JolService, private router: Router, private http: HttpClient,  private dialog: MatDialog) { }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.loginData = this.jolService.getLoginData();
    if(this.loginData.account != ''){
      this.http.get('assets/json/address.json').subscribe((res) => {
        this.addressList = res;
        this.districtList = this.addressList[1].district;
        this.getCustData();
      });
    }else {
      this.router.navigate(['/login']);
    }
  }

  getCustData() {
    this.blockUI.start('讀取中');
    let request = new Request('JOLCustomerInfo', this.loginData.account, this.loginData.token , 'SELECT', {});
    this.jolService.getData(environment.JOLSERVER, request).subscribe((res) => {
      this.blockUI.stop();
      if (res.code == 200 && res.custList.length > 0) {
        this.custData = res.custList[0];
        this.member.name = this.custData.name;
        this.member.phone = this.custData.phone;
        this.member.city = this.custData.city;
        this.member.district = this.custData.district;
        this.member.address = this.custData.address;
        this.member.email = this.custData.email;
        this.changeCity();
      }else if (res.code == 666){
        this.jolService.resetLoginData();
        this.router.navigate(['/login']);
      }
      console.log('custData', this.custData);
    });
  }

  updateCustData() {
    this.checkForm();
    if(this.isCheck){
      const body = {
        email: this.member.email,
      password: this.loginData.password,
      address: this.member.address,
      name: this.member.name,
      phone: this.member.phone,
      city: this.member.city,
      district: this.member.district,
      tokenExpired: this.loginData.tokenExpired,
      status: "1"
    }
    let request = new Request("JOLCustomerInfo", this.loginData.account, this.loginData.token, 'UPDATE', body);
    console.log('request', request)
    this.jolService.getData(environment.JOLSERVER, request).subscribe(res => {
      if (res.code == 200 && res.custList.length > 0) {
        this.custData = res.custList[0];
        this.member.name = this.custData.name;
        this.member.phone = this.custData.phone;
        this.member.city = this.custData.city;
        this.member.district = this.custData.district;
        this.member.address = this.custData.address;
        this.member.email = this.custData.email;
        this.loginData.email = this.custData.email;
        this.loginData.tokenExpired = this.custData.tokenExpired;
        localStorage.setItem('loginData', JSON.stringify(this.loginData));
        this.dialog.open(MessageComponent, { data: { msg: '會員資料修改成功' } });
      }else if (res.code == 666){
        this.jolService.resetLoginData();
        this.router.navigate(['/login']);
      }
    });
  }
}

  changeCity() {
    this.districtList = this.addressList.filter(
     (a: any) => a.code == this.member.city)[0].district;
  }

  checkForm() {
    this.isEmail = this.member.email == "" ? true : false;
    this.isName = this.member.name == "" ? true : false;
    this.isPhone = this.member.phone == "" ? true : false;
    this.isCity = this.member.city == "" || this.member.city == null ? true : false;
    this.isDistrict = this.member.district == "" || this.member.district == null ? true : false;
    this.isAddress = this.member.address == "" ? true : false;
    if (this.isEmail || this.isName || this.isPhone || this.isCity || this.isDistrict
      || this.isAddress ) {
      this.isCheck = false;
    } else {
      this.isCheck = true;
    }
    console.log('this.isCheck', this.isCheck)
  }
}
