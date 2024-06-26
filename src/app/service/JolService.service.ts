import { Injectable, EventEmitter } from '@angular/core';
import { Request } from '../model/Request';
import { StripeRequest } from '../model/StripeRequest';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { CartblockComponent } from '../cartblock/cartblock.component';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MessageComponent } from '../message/message.component';

@Injectable({
  providedIn: 'root'
})
export class JolService {
  @BlockUI() blockUI!: NgBlockUI;
  block = CartblockComponent;
  cartChange = new EventEmitter<number>();
  wishChange = new EventEmitter<number>();
  prodListChange = new EventEmitter<any>();
  wishListChange = new EventEmitter<any>();
  orderUpdate = new EventEmitter<any>();
  isLogin: boolean = false;
  loginData: any = { account: "", password: "", token: "", tokenExpired: "", email: "" };
  prod: any;
  cartNum: number = 0
  cartStatus: boolean = false;
  wishNum: number = 0
  isHeaderCheck = false;
  totAmt: number = 0;
  delivery: any = "";
  payment: any = ""
  cartList: any = [];
  orderDetail: any = [];
  orderData: any;
  sum: number = 0;
  prodList: any = [];
  wishList: any = [];
  indexProd: any = [];
  allProds: any = [];
  toProductList: string = ''
  category: string = '';
  isToPay: boolean = false;
  routerPage: any = "";

  constructor(private httpClient: HttpClient, private router: Router, private dialog: MatDialog) { }

  getData(url: string, request: Request) {
    var partnerKey = "partner_aqVYKm8K3d34f1uZhQDK0GZpXmsWaGlPtBhrnoGnpjiRXQGlvUQDeuWA";
    var httpHeaders = { headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', "x-api-key": partnerKey }) };
    return this.httpClient.post<any>(url, request, httpHeaders);
  }

  /**Stripe Pay*/
  getPaymentData(url: string, request: StripeRequest) {
    var httpHeaders = { headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' }) };
    return this.httpClient.post<any>(url, request, httpHeaders);
  }

  /**取登入資料 */
  getLoginData() {
    if (this.loginData.account == "" && localStorage.getItem('loginData') != null) {
      this.loginData = JSON.parse(localStorage.getItem('loginData'));
    }
    return this.loginData;
  }

  /**重設登入資料 */
  resetLoginData() {
    this.loginData = { account: "", password: "", token: "", email: "" };
    localStorage.removeItem('loginData');
    this.isLogin = false;
  }

  /**設購物車數量 */
  setCartNum(cartNum: number) {
    this.cartNum = cartNum;
    this.cartChange.emit(this.cartNum);
  }

  /**設願望清單數量 */
  setWishNum(wishNum: number) {
    this.wishNum = wishNum;
    this.wishChange.emit(this.wishNum);
  }

  /**存當前產品列 */
  setProdList(prodList: any) {
    this.prodList = prodList;
    this.prodListChange.emit(this.prodList);
  }

  /**設願望清單列 */
  setWishList(wishList: any) {
    this.wishList = wishList;
    this.wishListChange.emit(this.wishList);
  }

  /**新增購物車或願望清單 */
  addCartWish(prodId: any, qty: number, size: any, isCart: boolean, isToPay: boolean, isChange: boolean, isWishPage?: boolean) {
    const body = {
      prodId: prodId,
      qty: qty,
      size: size,
      isCart: isCart,
    };
    let request = new Request('JOLCartInfo', this.loginData.account, this.loginData.token, 'ADD', body);
    console.log('request', request);
    this.getData(environment.JOLSERVER, request).subscribe((res) => {
      if (res.code == 200) {
        this.blockUI.start('cart');
        setTimeout(() => {
          this.blockUI.stop();
        }, 700);
        this.setCartNum(res.cartList.length);
        if (isChange) {
          this.setWishList([]);
        }
        if (isToPay) {
          this.router.navigate(['/cartitem']);
        }
      } else if (res.code == 666) {
        this.routerPage = isWishPage ? "wishitem" : "product";
        this.reLogin();
      }
    });
  }

  /**查商品 */
  getProductData(type: any, body: any) {
    if (type == 'OTHER') {
      if (body.selectType == 'category') {
        this.category = body.keyWord;
      }
    }
    if (this.allProds.length > 0) {
      if(type == 'OTHER'){
        var productList = [];
        if(body.selectType === 'category'){
          productList = this.allProds.filter((prod:any)=>prod.category === body.keyWord);
        } else if(body.selectType === 'series'){
          productList = this.allProds.filter((prod:any)=>prod.series == body.keyWord);
        } else if(body?.selectType === 'keyWord'){
          productList = this.allProds.filter((prod:any)=>prod.name.includes(body.keyWord));
        }
        this.setProdList(productList);
        this.router.navigate(['/productlist'], { skipLocationChange: true });
      }
    } else {
      this.blockUI.start('讀取中');
      let request = new Request("JOLProductInfo", this.loginData.account, this.loginData.token, type, body);
      console.log('request', request)
      this.getData(environment.JOLSERVER, request).subscribe(res => {
        this.blockUI.stop();
        if (res.code == 200) {
          var prodList = res.productList
          console.log('prodList', this.prodList)
          prodList.forEach((prod: any) => {
            prod.img = [];
            prod.img = prod.imgUrl.split(',');
            prod.imgUrl = this.getImgUrl(prod.img[0]);
            prod.isOnload = false;
          });
          if(type == "ALL"){
            this.allProds = prodList;
            this.indexProd = prodList.slice(0, 24);
            this.setProdList(this.indexProd);
          } else{
            this.setProdList(prodList);
            this.router.navigate(['/productlist'], { skipLocationChange: true });
          }
        }
      });
    }
  }

  /**更新訂單狀態 */
  updateOrderStatus(body: any) {
    this.blockUI.start('讀取中');
    let request = new Request("JOLOrderInfo", this.loginData.account, this.loginData.token, "OTHER", body);
    console.log('request', request)
    this.getData(environment.JOLSERVER, request).subscribe(res => {
      console.log('updateOrderStatus res', res)
      this.blockUI.stop();
      if (res.code == 200) {
        this.orderUpdate.emit("finish");
        this.sendOrderEmail(body.orderNo);
        this.router.navigate(['/orderlist'])
      } else if (res.code == 666) {
        this.reLogin();
      }
    });
  }

  /**寄送訂單通知信 */
  sendOrderEmail(orderNo: any) {
    this.getLoginData();
    console.log('sendEmail===> ', orderNo, this.loginData.email)
    const body = {
      orderNo: orderNo,
      toEmail: this.loginData.email,
      subject: "訂單確認通知",
      content1: "<!DOCTYPE html><html lang='en'><head><meta charset='UTF-8'><meta http-equiv='X-UA-Compatible' content='IE=edge'><meta name='viewport' content='width=device-width,initial-scale=1'><title>JOL Boutique 訂單確認通知信</title></head><body style='padding: 10px;max-width: 500px;'><div><img style='width: 100px;' src='cid:image'></div><p>感謝您訂購JOL Boutique的商品，我們將再確認訂單後盡快為您出貨。<br>以下是您訂購的資料:</p><table style='padding-left:10px;width:360px;'><tr><td colspan='2' style='font-size:20px;font-weight:700;color:#bd6c3d'>訂單資訊</td></tr><tr><td colspan='2'><hr></td></tr><tr><td style='width:40%'>訂單編號:&nbsp;</td><td>#JOL-#OrderNo</td></tr><tr><td>訂單日期:&nbsp;</td><td>#OrderDate</td></tr><tr><td>訂單運費:&nbsp;</td><td>$ #DeliveryFee</td></tr><tr><td>訂單金額:&nbsp;</td><td>$ #OrderAmt</td></tr><tr><td>付款方式:&nbsp;</td><td>#PayBy</td></tr><tr><td>訂單狀態:&nbsp;</td><td>#Status</td></tr><tr><td>寄貨方式:&nbsp;</td><td>#Shipment</td></tr></table><br><br><table style='padding-left: 10px; width: 360px;'><tr><td style='font-size:20px; font-weight:bold; color: rgb(189, 108, 61);'> 訂單明細</td></tr>",
      content2: "<tr><td colspan='2'><hr></td></tr><tr><td colspan='2'><img class='image' src='#ProdImg' style='width:40%'></td></tr><tr><td style='width: 40%;'>商品編號:</td><td>#QUE-#ProdNo</td></tr><tr><td>商品名稱:</td><td>#ProdName</td></tr><tr><td>訂購尺寸:</td><td>#Size</td></tr><tr><td>訂購數量:</td><td>#Qty</td></tr><tr><td>商品價格:</td><td>$ #Price</td></tr><tr><td>小計:</td><td>$ #SubTotal</td></tr>",
      content3: "</table><br><br><p>更詳細的資訊進到JOL Boutique 的會員訂單管理查看，若您有任何需要協助的地方，請與我們<a href='mailto:JOLservice@gmail.com'>客服團隊</a>聯繫。<br><br><br>謝謝您，JOL Boutique團隊 敬上。</p></body></html>"
    }
    let request = new Request("JOLEmailInfo", this.loginData.account, this.loginData.token, 'UPDATE', body);
    console.log('sendEmail request', request)
    this.getData(environment.JOLSERVER, request).subscribe(res => {
      console.log('sendEmail response', res)

    });
  }

  /**圖片URL */
  getImgUrl(imgPath: any) {
    return !imgPath.includes(environment.IMG_URL) ? environment.IMG_URL + imgPath : imgPath
  }

  /**token無效導回登入 */
  reLogin() {
    const dialogRef = this.dialog.open(MessageComponent, { data: { msg: '登入逾時，請重新登入' } });
    dialogRef.afterClosed().subscribe(() => {
      this.resetLoginData();
      this.router.navigate(['/login']);
    });
  }
}
