import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Request } from '../model/Request';
import { JolService } from './../service/JolService.service';
import { Router } from '@angular/router';
import { BlockuiComponent } from './../blockui/blockui.component';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient,HttpHeaders } from '@angular/common/http';
declare const TPDirect: any;

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
  ishidden: boolean = false;
  isUpdate: boolean = false;
  isSame: boolean = false;
  districtList: any = [];
  addressList: any = [];
  custData: any;
  odr: any = {
    email: "",
    totalAmt: 0,
    status: '確認中',
    deliveryWay: "",
    deliveryNo: '',
    orderName: "",
    orderPhone: "",
    orderCity: "",
    orderDistrict: "",
    orderAddress: "",
    sendName: "",
    sendPhone: "",
    sendCity: "",
    sendDistrict: "",
    sendAddress: "",
    vehicle: "",
    vehicleType: "",
    payBy: "",
  }
  //check
  isCheck: boolean = true;
  isEmail: boolean = false;
  isOrderName: boolean = false;
  isOrderPhone: boolean = false;
  isOrderCity: boolean = false;
  isOrderDistrict: boolean = false;
  isOrderAddress: boolean = false;
  isSendName: boolean = false;
  isSendPhone: boolean = false;
  isSendCity: boolean = false;
  isSendDistrict: boolean = false;
  isSendAddress: boolean = false;
  isVehicleType: boolean = false;
  isVehicle: boolean = false;
  vehicleOpt: any = [
    { viewValue: '電子發票 E-invoice' },
    { viewValue: '電子發票 手機載具' },
    { viewValue: '捐贈發票' },
    { viewValue: '統編發票(公司戶)' },
  ];

  donateOpt: any = [
    { viewValue: '財團法人創世社會福利基金會' },
    { viewValue: '財團法人癌症關懷基金會' },
    { viewValue: '財團法人台灣兒童暨家庭扶助基金會' }

  ];
  constructor(private jolService: JolService, private router: Router, private http: HttpClient) { }

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
    this.blockUI.start('讀取中');
    let request = new Request('JOLCustomerInfo', this.loginData.account, 'SELECT', {});
    this.jolService.getData(environment.JOLSERVER, request).subscribe((res) => {
      this.blockUI.stop();
      if (res.custList.length > 0) {
        this.custData = res.custList[0];
        this.odr.orderName = this.custData.name;
        this.odr.orderPhone = this.custData.phone;
        this.odr.orderCity = this.custData.city;
        this.odr.orderDistrict = this.custData.district;
        this.odr.orderAddress = this.custData.address;
        this.odr.email = this.custData.email;
      }
      console.log('custData', this.custData);
    });
  }

  checkOut() {
    this.checkForm();
    if (this.isCheck) {
      if (this.isUpdate) {
        this.updateCustData();
      }
      this.odr.totalAmt = this.jolService.totAmt;
      this.odr.deliveryWay = this.jolService.delivery;
      this.odr.vehicle = this.odr.vehicle == undefined ? "" : this.odr.vehicle
      this.odr.payBy = this.jolService.payment;
      const body = this.odr;
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
            this.toLinepay(this.jolService, this.http);
            this.cartList.forEach((cart: any, index: any) => {
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
                  if (res.code == 200) {
                    var isEnd = index == this.cartList.length - 1 ? true : false;
                    this.deleteCart(cart.cartId, isEnd);
                  }
                });
            });
          }
        }
        console.log('res', res);
      });
    } else {

    }
  }

  toLinepay( jolService:JolService, http:HttpClient) {
    var account = this.loginData.account;
    TPDirect.linePay.getPrime(function (result:any) {
      console.log("result : ", result)
      console.log('prime', result.prime)
      var partnerKey = "partner_aqVYKm8K3d34f1uZhQDK0GZpXmsWaGlPtBhrnoGnpjiRXQGlvUQDeuWA";
      var prime = result.prime;
      if (result.status == 0) {
        var pay = {
          prime: prime,
          partner_key: partnerKey,
          merchant_id: "jenny83318_LINEPAY",
          details: "TapPay Test",
          amount: 1000,
          cardholder: {
            phone_number: "+886911788163",
            name: "王小明",
            email: "jenny83318@gmail.com",
            zip_code: "100",
            address: "台北市天龍區芝麻街1號1樓",
            national_id: "A123456789"
          },
          remember: true
        }
        console.log('payData', pay)

        const body = pay
        let request = new Request(
          'JOLPayInfo',
          account,
          'SELECT',
          body
        );
        console.log('PAY request', request);
        // var url = "https://sandbox.tappaysdk.com:443/tpc/payment/pay-by-prime";
        // var partnerKey = "partner_aqVYKm8K3d34f1uZhQDK0GZpXmsWaGlPtBhrnoGnpjiRXQGlvUQDeuWA";
        // var httpHeaders = { headers: new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8'). set(  "x-api-key", partnerKey )};
        // http.post<any>(url, pay, httpHeaders).subscribe((res:any) => {
        //     console.log('Pay res', res)

        //   });
        jolService.getData(environment.JOLSERVER, request).subscribe((res:any) => {
          console.log('Pay res', res)
        });
      }
    })
  }
  deleteCart(cartId: number, isEnd: boolean) {
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
      if (isEnd) {
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
          console.log('this.cartList.length', this.cartList.length)
          this.jolService.setCartNum(this.cartList.length);
          this.router.navigate(['/orderlist'], { skipLocationChange: true });
        });
    } else {
      this.router.navigate(['/login'], { skipLocationChange: true });
    }
  }

  updateCustData() {
    const body = {
      email: this.odr.email,
      password: this.loginData.password,
      address: this.odr.orderAddress,
      name: this.odr.orderName,
      phone: this.odr.orderPhone,
      city: this.odr.orderCity,
      district: this.odr.orderDistrict,
      status: "1"
    }
    let request = new Request("JOLCustomerInfo", this.loginData.account, 'UPDATE', body);
    console.log('request', request)
    this.jolService.getData(environment.JOLSERVER, request).subscribe(res => {
      console.log('updateCustData', res);
    });
  }
  setSendData() {
    console.log('isSame', this.isSame);
    if (this.isSame) {
      this.odr.sendName = this.odr.orderName;
      this.odr.sendPhone = this.odr.orderPhone;
      this.odr.sendCity = this.odr.orderCity;
      this.odr.sendDistrict = this.odr.orderDistrict;
      this.odr.sendAddress = this.odr.orderAddress;
    } else {
      this.odr.sendName = "";
      this.odr.sendPhone = "";
      this.odr.sendCity = "";
      this.odr.sendDistrict = "";
      this.odr.sendAddress = "";
    };
  }
  changeCity(type: string) {
    var city = type == 'order' ? this.odr.orderCity : this.odr.sendCity;
    this.districtList = this.addressList.filter(
      (a: any) => a.code == city
    )[0].district;
  }

  checkForm() {
    this.isEmail = this.odr.email == "" ? true : false;
    this.isOrderName = this.odr.orderName == "" ? true : false;
    this.isOrderPhone = this.odr.orderPhone == "" ? true : false;
    this.isOrderCity = this.odr.orderCity == "" || this.odr.orderCity == null ? true : false;
    this.isOrderDistrict = this.odr.orderDistrict == "" || this.odr.orderDistrict == null ? true : false;
    this.isOrderAddress = this.odr.orderAddress == "" ? true : false;
    this.isSendName = this.odr.sendName == "" ? true : false;
    this.isSendPhone = this.odr.sendPhone == "" ? true : false;
    this.isSendCity = this.odr.sendCity == "" || this.odr.sendCity == null ? true : false;
    this.isSendDistrict = this.odr.sendDistrict == "" || this.odr.sendDistrict == null ? true : false;
    this.isSendAddress = this.odr.sendAddress == "" ? true : false;
    this.isVehicleType = this.odr.vehicleType == "" ? true : false;
    this.isVehicle = this.odr.vehicleType != "捐贈發票" && this.odr.vehicle == '' ? true : false;
    if (this.isEmail || this.isOrderName || this.isOrderPhone || this.isOrderCity || this.isOrderDistrict
      || this.isOrderAddress || this.isSendName || this.isSendPhone || this.isSendCity || this.isSendDistrict
      || this.isSendAddress || this.isVehicle || this.isVehicleType) {
      this.isCheck = false;
    } else {
      this.isCheck = true;
    }
  }

}
