import { Component, OnInit, ViewChild,HostListener } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Request } from '../model/Request';
import { JolService } from './../service/JolService.service';
import { Router } from '@angular/router';
import { BlockuiComponent } from './../blockui/blockui.component';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator,PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { PaymentComponent } from '../payment/payment.component';
import { MessageComponent } from '../message/message.component';


@Component({
  selector: 'app-orderlist',
  templateUrl: './orderlist.component.html',
  styleUrls: ['./orderlist.component.scss', './orderlistExtra.component.scss'],
})
export class OrderlistComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  block = BlockuiComponent;
  loginData: any;
  orderList: any = [];
  cartList: any = [];
  ishidden: boolean = false;
  isShowElement: boolean = false;
  panelOpenState = false;
  displayedColumns: string[] = ['orderNo', 'orderTime', 'totalAmt', 'status', 'payBy', 'deliveryWay', 'repay', 'cancel'];
  dataSource: any;
  paymentOpt: any = [
    { value: 'creditCard', viewValue: '信用卡刷卡' },
    { value: 'bank', viewValue: '銀行轉帳' },
    { value: 'electric', viewValue: '電子支付' },
  ];
  paginatedOrderList: any[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  paginatorPageSize = 5; // 每页显示的项目数量
  paginatorPageSizeOptions = [5, 10, 20]; // 可供选择的页大小选项
  oddRowIndexes: number[] = [];

  pageSize = 5;
  pageIndex = 0;

  constructor(private jolService: JolService, private router: Router, private dialog: MatDialog) { }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.blockUI.stop();
    this.loginData = this.jolService.getLoginData();
    if(localStorage.getItem('payStatus') != null && localStorage.getItem('payStatus') != "undefined"){
      if(localStorage.getItem('payStatus') == 'cancel'){
        this.dialog.open(MessageComponent, { data: { msg: '取消付款，訂單編號: #JOL' + this.padZeros(parseInt(localStorage.getItem('isToPay')),5)} })
      }
      if(localStorage.getItem('payStatus') == 'fail'){
        this.dialog.open(MessageComponent, { data: { msg: '付款失敗，訂單編號: #JOL' + this.padZeros(parseInt(localStorage.getItem('isToPay')),5)} })
      }
      localStorage.removeItem('payStatus');
      localStorage.removeItem('isToPay');
      this.getOrderData();
    }
    else if (localStorage.getItem('isToPay') != null && localStorage.getItem('isToPay') != "undefined") {
      this.blockUI.stop();
      console.log('isToPay', localStorage.getItem('isToPay'))
      this.jolService.updateOrderStatus({ orderNo: Number(localStorage.getItem('isToPay')), status: "已付款" });
      this.dialog.open(MessageComponent, { data: { msg: '付款成功，訂單編號: #JOL' + this.padZeros(parseInt(localStorage.getItem('isToPay')),5)} })
      localStorage.removeItem('isToPay');
      this.jolService.orderUpdate.subscribe((status) => {
        if (status == 'finish') {
          this.getOrderData();
        }
      });
    } else {
      this.getOrderData();
    }
    this.updateElementVisibility()
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize(event: Event) {
    this.updateElementVisibility();
  }
  updateElementVisibility() {
    const screenWidth = window.innerWidth;
    if (screenWidth < 862) {
      this.isShowElement = true;
    } else {
      this.isShowElement = false;
    }
  }


  getOrderData() {
    if (this.loginData.account != '') {
      this.blockUI.start('讀取中');
      let request = new Request('JOLOrderInfo', this.loginData.account, this.loginData.token, 'SELECT', {});
      this.jolService
        .getData(environment.JOLSERVER, request)
        .subscribe((res) => {
          console.log('res', res)
          this.blockUI.stop();
          if (res.code == 200) {
            if (res.orderList.length > 0) {
              this.orderList = res.orderList;
              console.log ('orderList', this.orderList)
              this.dataSource = new MatTableDataSource<any>(this.orderList);
              this.dataSource.paginator = this.paginator;
              this.updatePaginatedOrderList();
            } else {
              this.ishidden = true
            }
          } else if (res.code == 666) {
           this.jolService.reLogin();
          }
        });
    } else {
      this.router.navigate(['/login']);
    }
  }

  cancelOrder(orderNo: any) {
    const dialogRef = this.dialog.open(MessageComponent, { data: { msg: '您確定要取消訂單?', isConfirm: true } });
    dialogRef.afterClosed().subscribe(isConfirm => {
      if (isConfirm) {
        this.jolService.updateOrderStatus({ orderNo: orderNo, status: "已取消" });
      }
      this.jolService.orderUpdate.subscribe((status) => {
        if (status == 'finish') {
          this.getOrderData();
        }
      });
    });
  }

  repay(order: any) {
    this.dialog.open(PaymentComponent, { data: order });
  }

  toOrderDrtail(orderNo: number) {
    this.jolService.orderData = this.orderList.filter((o: any) => o.orderNo == orderNo)[0];
    this.router.navigate(['/orderdetail'], { skipLocationChange: true });
  }

  padZeros(value: number, length: number): string {
    return value.toString().padStart(length, '0');
  }


// 加载当前页面数据
onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.updatePaginatedOrderList();
  }

  updatePaginatedOrderList() {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedOrderList = this.orderList.slice(startIndex, endIndex);
    this.oddRowIndexes = this.paginatedOrderList.map((_, i) => i).filter(index => index % 2 !== 0);
  }
  isOddRow(index: number): boolean {
    console.log('index',index);
    return index % 2 !== 0;
  }
}
