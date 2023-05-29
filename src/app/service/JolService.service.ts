import { Injectable, EventEmitter } from '@angular/core';
import { Request } from '../model/Request';
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
  isLogin: boolean = false;
  loginData: any = { account: "", password: "", token: "" };
  prod: any;
  cartNum: number = 0
  wishNum: number = 0
  isHeaderCheck = false;
  cartList:any=[];
  sum:number=0;
  constructor(private httpClient: HttpClient, private router: Router) { }

  getData(url: string, request: Request) {
    var httpHeaders = { headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' }) };
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

  // deleteCartWish(cartId :any){
  //       const body = {
  //         isCart: true,
  //         cartId:cartId
  //       };
  //       let request = new Request('JOLCartInfo', this.loginData.account,'DELETE', body);
  //       console.log('request', request);
  //       this.getData(environment.JOLSERVER, request)
  //         .subscribe((res) => {
  //           if(res.code == 200){
  //             this.getCartData();
  //           }
  //         });
  //     }

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
