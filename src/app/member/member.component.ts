import { Component, OnInit, NgZone } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Request } from '../model/Request';
import { StripeRequest } from '../model/StripeRequest';
import { JolService } from './../service/JolService.service';
import { Router } from '@angular/router';
import { BlockuiComponent } from './../blockui/blockui.component';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { HttpClient } from '@angular/common/http';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { loadStripe } from '@stripe/stripe-js';

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
  odr: any = {
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
  constructor(private jolService: JolService, private router: Router, private http: HttpClient, private ngZone: NgZone) { }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.loginData = this.jolService.loginData;
    this.getCustData();
    this.http.get('assets/json/address.json').subscribe((res) => {
      this.addressList = res;
      this.districtList = this.addressList[1].district;
    });
  }

  getCustData() {
    this.blockUI.start('讀取中');
    let request = new Request('JOLCustomerInfo', this.loginData.account, 'SELECT', {});
    this.jolService.getData(environment.JOLSERVER, request).subscribe((res) => {
      this.blockUI.stop();
      if (res.code == 200 && res.custList.length > 0) {
        this.custData = res.custList[0];
        this.odr.name = this.custData.name;
        this.odr.phone = this.custData.phone;
        this.odr.city = this.custData.city;
        this.odr.district = this.custData.district;
        this.odr.address = this.custData.address;
        this.odr.email = this.custData.email;
      }
      console.log('custData', this.custData);
    });
  }


  updateCustData() {
    const body = {
      email: this.odr.email,
      password: this.loginData.password,
      address: this.odr.address,
      name: this.odr.name,
      phone: this.odr.phone,
      city: this.odr.city,
      district: this.odr.district,
      status: "1"
    }
    let request = new Request("JOLCustomerInfo", this.loginData.account, 'UPDATE', body);
    console.log('request', request)
    this.jolService.getData(environment.JOLSERVER, request).subscribe(res => {
      if (res.code == 200 && res.custList.length > 0) {
        this.custData = res.custList[0];
        this.odr.name = this.custData.name;
        this.odr.phone = this.custData.phone;
        this.odr.city = this.custData.city;
        this.odr.district = this.custData.district;
        this.odr.address = this.custData.address;
        this.odr.email = this.custData.email;
      }
    });
  }

  changeCity() {
    this.districtList = this.addressList.filter(
     (a: any) => a.code == this.odr.city)[0].district;
  }

  checkForm() {
    this.isEmail = this.odr.email == "" ? true : false;
    this.isName = this.odr.name == "" ? true : false;
    this.isPhone = this.odr.orderPhone == "" ? true : false;
    this.isCity = this.odr.orderCity == "" || this.odr.orderCity == null ? true : false;
    this.isDistrict = this.odr.orderDistrict == "" || this.odr.orderDistrict == null ? true : false;
    this.isAddress = this.odr.orderAddress == "" ? true : false;
    if (this.isEmail || this.isName || this.isPhone || this.isCity || this.isDistrict
      || this.isAddress ) {
      this.isCheck = false;
    } else {
      this.isCheck = true;
    }
  }
}
