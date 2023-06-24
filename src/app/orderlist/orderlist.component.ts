import { Component, OnInit,ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Request } from '../model/Request';
import { JolService } from './../service/JolService.service';
import { Router } from '@angular/router';
import { BlockuiComponent } from './../blockui/blockui.component';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { MatDialog } from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { PaymentComponent } from '../payment/payment.component';
import { MessageComponent } from '../message/message.component';


@Component({
  selector: 'app-orderlist',
  templateUrl: './orderlist.component.html',
  styleUrls: ['./orderlist.component.scss'],
})
export class OrderlistComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  block = BlockuiComponent;
  loginData: any;
  orderList: any = [];
  cartList:any = [];
  ishidden: boolean = false;
  panelOpenState = false;
  displayedColumns: string[] = ['orderNo', 'orderTime', 'totalAmt', 'status','payBy', 'deliveryWay','repay', 'cancel'];
  dataSource:any;
  paymentOpt: any = [
    { value: 'creditCard', viewValue: '信用卡刷卡' },
    { value: 'bank', viewValue: '銀行轉帳' },
    { value: 'electric', viewValue: '電子支付' },
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private jolService: JolService, private router: Router, private dialog: MatDialog) { }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.loginData = this.jolService.loginData;
    if(this.loginData.account == '' && localStorage.getItem('loginData') != null){
      this.loginData = JSON.parse(localStorage.getItem('loginData')) ;
      this.jolService.loginData = this.loginData;
    }
    if(localStorage.getItem('isToPay') != null && localStorage.getItem('isToPay') != "undefined" ){
      this.jolService.updateOrderStatus({orderNo:Number(localStorage.getItem('isToPay')), status:"已付款"});
      localStorage.removeItem('isToPay');
      this.jolService.orderUpdate.subscribe((status) => {
        if(status == 'finish'){
          this.getOrderData();
        }
      });
    }else{
      this.getOrderData();
    }
  }

  getOrderData() {
    if (this.loginData.account != '') {
      this.blockUI.start('讀取中');
      let request = new Request('JOLOrderInfo', this.loginData.account, 'SELECT', {});
      this.jolService
        .getData(environment.JOLSERVER, request)
        .subscribe((res) => {
          this.blockUI.stop();
          if(res.orderList.length > 0){
            this.orderList = res.orderList;
            this.dataSource =new MatTableDataSource<any>(this.orderList);
            this.dataSource.paginator = this.paginator;
          }else{
            this.ishidden = true
          }
        });
    } else {
      this.router.navigate(['/login'], { skipLocationChange: true });
    }
  }

  cancelOrder(orderNo:any){
    const dialogRef = this.dialog.open(MessageComponent, { data: { msg: '您確定要取消訂單?', isConfirm: true } });
    dialogRef.afterClosed().subscribe(isConfirm => {
      if (isConfirm) {
        this.jolService.updateOrderStatus({orderNo:orderNo, status:"已取消"});
      }
      this.jolService.orderUpdate.subscribe((status) => {
        if(status == 'finish'){
          this.getOrderData();
        }
      });
    });
  }

  repay( order:any){
    this.dialog.open(PaymentComponent, { data: order });
  }

  toOrderDrtail(orderNo:number){
    this.jolService.orderData = this.orderList.filter((o:any)=> o.orderNo == orderNo)[0];
    this.router.navigate(['/orderdetail'], { skipLocationChange: true });
  }

  toProductList(){
      this.jolService.getProductData("OTHER",{selectType: "series", keyWord:"new"});
  }

  padZeros(value: number, length: number): string {
    return value.toString().padStart(length, '0');
  }
}
