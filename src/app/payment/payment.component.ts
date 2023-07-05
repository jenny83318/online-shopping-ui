import { Component, OnInit, NgZone, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { BlockuiComponent } from './../blockui/blockui.component';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Router } from '@angular/router';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { loadStripe } from '@stripe/stripe-js';
import { JolService } from './../service/JolService.service';
import { environment } from 'src/environments/environment';
import { StripeRequest } from '../model/StripeRequest';
import { Request } from '../model/Request';
@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  block = BlockuiComponent;
  stripePromise = loadStripe(environment.STRIPEKEY);
  detailList:any = [];
  itemList: any = [];
  loginData:any;
  payPalConfig?: IPayPalConfig;
  isPayPal:boolean = false;

  constructor(private jolService: JolService, public dialogRef: MatDialogRef<PaymentComponent>,
     @Inject(MAT_DIALOG_DATA) public order: any, private ngZone: NgZone, private router: Router) { }

  ngOnInit() {
    this.loginData = this.jolService.getLoginData();
    console.log('this.loginData', this.loginData)
    console.log('this.order', this.order)
    this.getOrderDetail(this.order.orderNo)
  }

  Paypal() {
    console.log("this.jolService.totAmt", String(this.jolService.totAmt))
    var total = 0
    this.detailList.forEach((c: any) => {
      total += c.qty * c.price;
      this.detailList.push({
        name: c.prodName,
        quantity: c.qty,
        category: 'PHYSICAL_GOODS',
        unit_amount: {
          currency_code: 'USD',
          value: String(c.price),
        }
      })
    })
    console.log('total without shipping ', total)
    console.log('total', total)
    this.payPalConfig = {
      currency: 'USD',
      clientId: 'AQ2bKcocci4jZXDPtc692oi00O44UDYhCI66EzlY13ls8gVhmNf5-Ai92GG4UcLBn0O-wZAcG4UdYgj8',
      createOrderOnClient: (data) => <ICreateOrderRequest>{
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'USD',
              value: String(this.order.totalAmt),
              breakdown: {
                item_total: {
                  currency_code: 'USD',
                  value: String(total)
                },
                shipping: {
                  currency_code: 'USD',
                  value: String(this.order.totalAmt - total)
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
        console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
        console.log('orderStatus', data.status)
        this.ngZone.run(() => {
          this.jolService.updateOrderStatus({ orderNo: this.order.orderNo, status: "已付款" });
          this.jolService.orderUpdate.subscribe((status) => {
            if(status == 'finish'){
              this.cancel();
            }
          });
          localStorage.setItem('isToPay', this.order.orderNo);
          window.location.reload();
        });
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
        this.ngZone.run(() => {
          this.jolService.orderUpdate.subscribe((status) => {
            if(status == 'finish'){
              this.cancel();
              this.router.navigate(['/'], { skipLocationChange: false });
            }
          });
        });
      },
      onError: err => {
        console.log('OnError', err);
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
      },
    };
  }


  async StripePay() {
    console.log('this.detailList', this.detailList)
    var prodName = "";
    this.detailList.forEach((c: any,index:any) => {
      prodName += c.prodName
      if(index != this.detailList.length -1){
        prodName +=  "、"
      }
    })
    const stripe = await this.stripePromise;
    let request = new StripeRequest(Math.round(this.order.totalAmt * 100) , prodName , 'hkd', environment.Render_Succ, environment.Render_Fail, 1);
    this.blockUI.start('讀取中');
    this.jolService
      .getPaymentData(environment.STRIPE, request)
      .subscribe((res) => {
        this.blockUI.stop();
        localStorage.setItem('isToPay', this.order.orderNo);
        stripe.redirectToCheckout({
          sessionId: res.id,
        });
        console.log('StripePay res', res)
        this.cancel();
      });
  }

  getOrderDetail(orderNo:any) {
    if (this.loginData.account != '') {
      this.blockUI.start("讀取中");
      const body = {orderNo:orderNo}
      let request = new Request('JOLOrderDetailInfo', this.loginData.account, this.loginData.token, 'SELECT', body);
      console.log('request', request)
      this.jolService
        .getData(environment.JOLSERVER, request)
        .subscribe((res) => {
          if(res.code == 200){

            console.log('res.detailList', res.detailList)
            if(res.detailList.length > 0){
              this.detailList = res.detailList;
              this.blockUI.stop();
              if(this.order.payBy == 'Paypal'){
                this.Paypal();
                this.isPayPal = true;
              }
            }else{
              this.blockUI.stop();
            }
          } else if (res.code == 666) {
            this.jolService.resetLoginData();
            this.router.navigate(['/login'], { skipLocationChange: false });
          }
        });
    }
  }

  cancel(){
    this.dialogRef.close();
  }
}
