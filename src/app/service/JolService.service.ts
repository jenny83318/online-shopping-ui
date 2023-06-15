import { Injectable, EventEmitter } from '@angular/core';
import { Request } from '../model/Request';
import { StripeRequest } from '../model/StripeRequest';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { CartblockComponent } from '../cartblock/cartblock.component';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class JolService {
  @BlockUI() blockUI!: NgBlockUI;
  block = CartblockComponent;
  cartChange = new EventEmitter<number>();
  wishChange = new EventEmitter<number>();
  prodListChange = new EventEmitter<any>();
  orderUpdate = new EventEmitter<any>();
  isLogin: boolean = false;
  loginData: any = { account: "", password: "", token: "" };
  prod: any;
  cartNum: number = 0
  wishNum: number = 0
  isHeaderCheck = false;
  totAmt:number = 0;
  delivery:any="";
  payment:any=""
  cartList:any=[];
  orderDetail:any =[];
  orderData:any;
  sum:number=0;
  prodList:any = [];
  isToPay:boolean = false;

  constructor(private httpClient: HttpClient, private router: Router) { }

  getData(url: string, request: Request) {
    var partnerKey = "partner_aqVYKm8K3d34f1uZhQDK0GZpXmsWaGlPtBhrnoGnpjiRXQGlvUQDeuWA";
    var httpHeaders = { headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' ,  "x-api-key": partnerKey }) };
    return this.httpClient.post<any>(url, request, httpHeaders);
  }
  getPaymentData(url: string, request: StripeRequest) {
    var httpHeaders = { headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8'}) };
    return this.httpClient.post<any>(url, request, httpHeaders);
  }

  resetLoginData() {
    this.loginData = { account: "", password: "", token: "" };
  }
  setCartNum(cartNum: number) {
    this.cartNum = cartNum;
    this.cartChange.emit(this.cartNum);
  }
  setWishNum(wishNum: number) {
    this.wishNum = wishNum;
    this.wishChange.emit(this.wishNum);
  }
  setProdList(prodList:any) {
    this.prodList = prodList;
    this.prodListChange.emit(this.prodList);
  }

  addCartWish(prodId: any, qty: number, size: any, isCart: boolean,) {
    if (isCart) {
      this.blockUI.start('cart');
    }
    const body = {
      prodId: prodId,
      qty: qty,
      size: size,
      isCart: isCart,
    };
    let request = new Request('JOLCartInfo', this.loginData.account, 'ADD', body);
    console.log('request', request);
    this.getData(environment.JOLSERVER, request).subscribe((res) => {
      console.log('res', res);
      if (isCart) {
        this.setCartNum(res.cartList.length);
      } else {
        this.setWishNum(res.cartList.length);
      }
    });
    setTimeout(() => {
      this.blockUI.stop();
    }, 700);
  }

  getProductData( type:any, body:any) {
    this.blockUI.start('讀取中');
    let request = new Request("JOLProductInfo", this.loginData.account, type, body);
    console.log('request', request)
    this.getData(environment.JOLSERVER, request).subscribe(res => {
      this.blockUI.stop();
      var prodList = res.productList
      console.log('prodList',this.prodList)
      prodList.forEach((prod: any) => {
        prod.img = [];
        prod.img = prod.imgUrl.split(',');
        prod.imgUrl =prod.img[0];
        prod.isOnload =false;
      });
      this.setProdList(prodList);
      this.router.navigate(['/productlist'], { skipLocationChange: true });
    });
  }

  updateOrderStatus(body:any){
    this.blockUI.start('讀取中');
    let request = new Request("JOLOrderInfo", this.loginData.account, "OTHER", body);
    console.log('request', request)
    this.getData(environment.JOLSERVER, request).subscribe(res => {
      this.blockUI.stop();
      this.orderUpdate.emit("finish");
    });
  }

  sortByKey(array: any, key: any, flag: boolean) {
    var sortArray = array.sort(function (a: any, b: any) {
      var x; var y;
      if (key != 'statusTime') {
        x = a[key];
        y = b[key];
      } else {
        a['statusDate'] =a['statusDate'].replaceAll('-', '/');
        b['statusDate'] = b['statusDate'].replaceAll('-', '/');
        x = new Date(a['statusDate'] + ' ' + a[key]).getTime();
        y = new Date(b['statusDate'] + ' ' + b[key]).getTime();
      }
      return flag ? ((x < y) ? 1 : ((x > y) ? -1 : 0)) : ((x > y) ? 1 : ((x < y) ? -1 : 0));
    });
    console.log('sortArray = ', sortArray)
    return sortArray;
  }
}
