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
  displayedColumns: string[] = ['orderNo', 'orderTime', 'totalAmt', 'status','payBy', 'deliveryWay'];
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
    this.getOrderData();
  }

  getOrderData() {
    if (this.loginData.account != '') {
      let request = new Request('JOLOrderInfo', this.loginData.account, 'SELECT', {});
      this.jolService
        .getData(environment.JOLSERVER, request)
        .subscribe((res) => {
          console.log('order',res.orderList)
          this.orderList = res.orderList;
          this.dataSource =new MatTableDataSource<any>(this.orderList);
          this.dataSource.paginator = this.paginator;
        });
    } else {
      this.router.navigate(['/login'], { skipLocationChange: true });
    }
  }

  onLoadImg(index: any) {
    if (index == this.orderList.length - 1) {
      this.blockUI.stop();

    }
  }
}
