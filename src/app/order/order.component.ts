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
  styleUrls: ['./order.component.scss'],
})
export class OrderComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  block = BlockuiComponent;
  loginData: any;
  cartList: any;
  sum: number = 0;
  checkBox: any = 'black';
  ishidden: boolean = false;
  isSame: boolean = false;
  custData: any = { name: '', phone: '', address: '' };
  odr: any = {
    name: '',
    phone: '',
    city: '',
    district: '',
    address: '',
    email: '',
    vehicle: '',
    vehicleType: '',
  };
  send: any = { name: '', phone: '', city: '', district: '', address: '' };
  order: any;
  addressList: any = [];
  districtList: any = [];
  city: any = '02';
  vehicleOpt: any = [
    { value: 'eInvoice', viewValue: '電子發票 E-invoice' },
    { value: 'phone', viewValue: '電子發票 手機載具' },
    { value: 'donate', viewValue: '捐贈發票' },
    { value: 'company', viewValue: '統編發票(公司戶)' },
  ];
  constructor(
    private jolService: JolService,
    private router: Router,
    private dialog: MatDialog,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.cartList = this.jolService.cartList;
    console.log('cartList', this.cartList);
    this.loginData = this.jolService.loginData;
    this.getCustData();
    this.http.get('assets/json/address.json').subscribe((res) => {
      this.addressList = res;
      this.districtList = this.addressList[1].district;
    });
  }

  getCustData() {
    let request = new Request(
      'JOLCustomerInfo',
      this.loginData.account,
      'SELECT',
      {}
    );
    console.log('request', request);
    this.jolService.getData(environment.JOLSERVER, request).subscribe((res) => {
      this.custData = res.custList[0];
      this.odr = this.custData;
      console.log('custData', this.custData);
    });
  }
  checkOut() {
    const body = {
      email: this.odr.email,
      totalAmt: this.jolService.totAmt,
      status: '確認中',
      deliveryWay: this.jolService.delivery,
      deliveryNo: '',
      orderName: this.odr.name,
      orderPhone: this.odr.phone,
      orderCity: this.odr.city,
      orderDistrict: this.odr.district,
      orderAddress: this.odr.address,
      sendName: this.send.name,
      sendCity: this.send.city,
      sendAddress: this.send.address,
      vehicle: this.odr.vehicle,
      vehicleType: this.odr.vehicleType,
      payBy: this.jolService.payment,
    };
    let request = new Request(
      'JOLOrderInfo',
      this.loginData.account,
      'ADD',
      body
    );
    console.log('request', request);
    this.jolService.getData(environment.JOLSERVER, request).subscribe((res) => {
      if (res.code == 200) {
        if (res.orderList.length > 0) {
          this.cartList.forEach((cart: any, index:any) => {
            const detailBody = {
              orderNo: res.orderList[0].orderNo,
              prodId: cart.prodId,
              qty: cart.qty,
              price: cart.price,
              status: '待確認',
            };
            let request = new Request(
              'JOLOrderDetailInfo',
              this.loginData.account,
              'ADD',
              detailBody
            );
            console.log('requestdetail', request);
            this.jolService
              .getData(environment.JOLSERVER, request)
              .subscribe((res) => {
               if(res.code == 200){
                var isEnd =index == this.cartList.length -1 ? true :false;
                this.deleteCart(cart.cartId, isEnd);
              }
              });
          });
        }
      }
      console.log('res', res);
    });
  }

  deleteCart(cartId:number, isEnd:boolean) {
    const body = {
      isCart: true,
      cartId: cartId,
    };
    let request = new Request(
      'JOLCartInfo',
      this.loginData.account,
      'DELETE',
      body
    );
    this.jolService.getData(environment.JOLSERVER, request).subscribe((res) => {
      if(isEnd){
        this.getCartData();
      }
    });
  }

  getCartData() {
    if (this.loginData.account != '') {
      const body = {
        isCart: true
      };
      let request = new Request('JOLCartInfo', this.loginData.account, 'SELECT', body);
      this.blockUI.start('讀取中');
      this.jolService
        .getData(environment.JOLSERVER, request)
        .subscribe((res) => {
          this.blockUI.stop();
          this.cartList = res.cartList;
          console.log('this.cartList.length',this.cartList.length)
          this.jolService.setCartNum(this.cartList.length);
        });
    } else {
      this.router.navigate(['/login'], { skipLocationChange: true });
    }
  }

  setSendData() {
    console.log('isSame', this.isSame);
    if (this.isSame) [(this.send = this.odr)];
  }
  changeCity() {
    this.districtList = this.addressList.filter(
      (a: any) => a.code == this.city
    )[0].district;
    console.log('city', this.city);
  }
}
