import { Component, OnInit, NgZone,HostListener } from '@angular/core';
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
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss', './orderExtra.component.scss'],
})
export class OrderComponent implements OnInit {
  paymentHandler: any = null;
  @BlockUI() blockUI!: NgBlockUI;
  block = BlockuiComponent;
  loginData: any;
  cartList: any;
  ishidden: boolean = false;
  isUpdate: boolean = false;
  isSame: boolean = false;
  isPayPal: boolean = false;
  isStripe :boolean = false;
  isDisable:boolean = false;
  districtList: any = [];
  addressList: any = [];
  itemList: any = [];
  custData: any;
  orderNo:any ="";
  payPalConfig?: IPayPalConfig;
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
  isCheck: boolean = false;
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
  isShowElement: boolean = false;
  creditCardNo:any;
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
  stripePromise = loadStripe(environment.STRIPEKEY);
  constructor(private jolService: JolService, private router: Router, private http: HttpClient, private ngZone: NgZone) { }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.cartList = this.jolService.cartList;
    console.log('cartList', this.cartList);
    this.loginData = this.jolService.getLoginData();
    this.getCustData();
    this.http.get('assets/json/address.json').subscribe((res) => {
      this.addressList = res;
      this.districtList = this.addressList[1].district;
    });
  }



  getCustData() {
    this.blockUI.start('讀取中');
    let request = new Request('JOLCustomerInfo', this.loginData.account, this.loginData.token , 'SELECT', {});
    this.jolService.getData(environment.JOLSERVER, request).subscribe((res) => {
      this.blockUI.stop();
      if(res.code == 200){
        if (res.custList.length > 0) {
          this.custData = res.custList[0];
          this.odr.orderName = this.custData.name;
          this.odr.orderPhone = this.custData.phone;
          this.odr.orderCity = this.custData.city;
          this.odr.orderDistrict = this.custData.district;
          this.odr.orderAddress = this.custData.address;
          this.odr.email = this.custData.email;
        }
      }else if (res.code == 666){
        this.jolService.resetLoginData();
        this.router.navigate(['/login'], { skipLocationChange: false });
      }
      console.log('custData', this.custData);
    });
  }

  checkOut() {
    this.checkForm();
    // var statusName = status =="COMPLETED" ? "已付款" : "待付款"
    if (this.isCheck) {
      if (this.isUpdate) {
        this.updateCustData();
      }
      this.odr.totalAmt = this.jolService.totAmt;
      this.odr.deliveryWay = this.jolService.delivery;
      this.odr.vehicle = this.odr.vehicle == undefined ? "" : this.odr.vehicle
      this.odr.payBy = this.jolService.payment;
      this.odr.status = "待付款";
      const body = this.odr;
      let request = new Request(
        'JOLOrderInfo',
        this.loginData.account,
        this.loginData.token,
        'ADD',
        body
      );
      console.log('request', request);
      this.jolService.getData(environment.JOLSERVER, request).subscribe((rs) => {
        if (rs.code == 200) {
          if (rs.orderList.length > 0) {
            this.orderNo = rs.orderList[0].orderNo
            this.cartList.forEach((cart: any, index: any) => {
              const detailBody = {
                orderNo: rs.orderList[0].orderNo,
                prodId: cart.prodId,
                qty: cart.qty,
                price: cart.price,
                status: '準備中',
                size:cart.size
              };
              let request = new Request(
                'JOLOrderDetailInfo',
                this.loginData.account,
                this.loginData.token,
                'ADD',
                detailBody
              );
              console.log('requestdetail', request);
              this.jolService
                .getData(environment.JOLSERVER, request)
                .subscribe((res) => {
                  if (res.code == 666){
                    this.jolService.resetLoginData();
                    this.router.navigate(['/login'], { skipLocationChange: false });
                  }
                });
            });
            // 支付工具
            if (this.odr.payBy == 'Paypal') {
              this.isPayPal = true;
              this.isDisable = true;
              this.creditCardNo ="4111 1111 1111 1111"
              this.Paypal(rs.orderList[0].orderNo);
            }
            if (this.odr.payBy == 'Stripe Pay') {
              this.isStripe = true;
              this.creditCardNo ="4242 4242 4242 4242"
              this.isDisable = true;
            }
          }
        }else if (rs.code == 666){
          this.jolService.resetLoginData();
          this.router.navigate(['/login'], { skipLocationChange: false });
        }
        console.log('res', rs);
      });
    } else {

    }
  }

  deleteCart(cartId: number, isEnd: boolean) {
    const body = {
      isCart: true,
      cartId: cartId,
    };
    let request = new Request(
      'JOLCartInfo',
      this.loginData.account,
      this.loginData.token,
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
      let request = new Request('JOLCartInfo', this.loginData.account, this.loginData.token , 'SELECT', body);
      this.blockUI.start('讀取中');
      this.jolService
        .getData(environment.JOLSERVER, request)
        .subscribe((res) => {
          this.blockUI.stop();
          if(res.code == 200){
            this.cartList = res.cartList;
            console.log('this.cartList.length', this.cartList.length)
            this.jolService.setCartNum(this.cartList.length);
            this.jolService.orderDetail = this.cartList;
          }else if (res.code == 666){
            this.jolService.resetLoginData();
            this.router.navigate(['/login'], { skipLocationChange: false });
          }
        });
    } else {
      this.router.navigate(['/login'], { skipLocationChange: false });
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
    let request = new Request("JOLCustomerInfo", this.loginData.account, this.loginData.token ,'UPDATE', body);
    console.log('request', request)
    this.jolService.getData(environment.JOLSERVER, request).subscribe(res => {
     if (res.code == 666){
        this.jolService.resetLoginData();
        this.router.navigate(['/login'], { skipLocationChange: false });
      }
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
    this.isVehicle = this.odr.vehicle == '' ? true : false;
    if (this.isEmail || this.isOrderName || this.isOrderPhone || this.isOrderCity || this.isOrderDistrict
      || this.isOrderAddress || this.isSendName || this.isSendPhone || this.isSendCity || this.isSendDistrict
      || this.isSendAddress || this.isVehicle || this.isVehicleType) {
      this.isCheck = false;
    } else {
      this.isCheck = true;
    }
  }


  Paypal(orderNo: any) {
    console.log("this.jolService.totAmt", String(this.jolService.totAmt))
    var total = 0
    this.cartList.forEach((c: any,index:any) => {
      total += c.qty * c.price;
      this.itemList.push({
        name: c.prodName,
        quantity: c.qty,
        category: 'PHYSICAL_GOODS',
        unit_amount: {
          currency_code: 'USD',
          value: String(c.price),
        }
      })
      var isEnd = index == this.cartList.length - 1 ? true : false;
      this.deleteCart(c.cartId, isEnd);
    })
    this.payPalConfig = {
      currency: 'USD',
      clientId: 'AQ2bKcocci4jZXDPtc692oi00O44UDYhCI66EzlY13ls8gVhmNf5-Ai92GG4UcLBn0O-wZAcG4UdYgj8',
      createOrderOnClient: (data) => <ICreateOrderRequest>{
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'USD',
              value: String(this.jolService.totAmt),
              breakdown: {
                item_total: {
                  currency_code: 'USD',
                  value: String(total)
                },
                shipping: {
                  currency_code: 'USD',
                  value: String(this.jolService.totAmt - total)
                }
              }
            },
            items: this.itemList
          }
        ]
      },
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        layout: 'vertical'
      },
      onApprove: (data, actions) => {
        console.log('onApprove - transaction was approved, but not authorized', data, actions);
        actions.order.get().then(details => {
          console.log('onApprove - you can get full order details inside onApprove: ', details);
        });
      },
      onClientAuthorization: (data) => {
        this.blockUI.start('讀取中');
        console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
        console.log('orderStatus', data.status)
        this.ngZone.run(() => {
          localStorage.setItem('isToPay', this.orderNo);
          this.jolService.updateOrderStatus({ orderNo: orderNo, status: "已付款" });

        });
      },
      onCancel: (data, actions) => {
        this.blockUI.start('讀取中');
        console.log('OnCancel', data, actions);
        this.ngZone.run(() => {
          this.jolService.sendOrderEmail(orderNo);
          localStorage.setItem('isToPay', orderNo);
          localStorage.setItem('payStatus', 'cancel');
          this.router.navigate(['/orderlist'], { skipLocationChange: false });
        });
      },
      onError: err => {
        this.ngZone.run(() => {
        this.blockUI.start('讀取中');
        console.log('OnError', err);
        this.jolService.sendOrderEmail(orderNo);
        localStorage.setItem('isToPay', orderNo);
        localStorage.setItem('payStatus', 'fail');
        this.router.navigate(['/orderlist'], { skipLocationChange: false });
      });
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
      },
    };
  }

  async StripePay() {
    var prodName = "";
    this.cartList.forEach((c: any,index:any) => {
      prodName += c.prodName
      if(index != this.cartList.length -1){
        prodName +=  "、"
      }
      var isEnd = index == this.cartList.length - 1 ? true : false;
      this.deleteCart(c.cartId, isEnd);
    })

    const stripe = await this.stripePromise;
    let request = new StripeRequest(Math.round(this.jolService.totAmt * 100) , prodName , 'hkd', environment.Render_Succ, environment.Render_Fail, 1);
    console.log('StripePay req', request)
    this.blockUI.start('讀取中');
    this.jolService
      .getPaymentData(environment.STRIPE, request)
      .subscribe((res) => {
        this.blockUI.stop();
        localStorage.setItem('isToPay', this.orderNo);
        console.log('isToPay',this.orderNo )
        stripe.redirectToCheckout({
          sessionId: res.id,
        });
        console.log('StripePay res', res)
      });
  }

}
