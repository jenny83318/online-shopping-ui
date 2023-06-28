import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Request } from '../model/Request';
import { JolService } from './../service/JolService.service';
import { Router } from '@angular/router';
import { BlockuiComponent } from './../blockui/blockui.component';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-orderdetail',
  templateUrl: './orderdetail.component.html',
  styleUrls: ['./orderdetail.component.scss']
})
export class OrderdetailComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  block = BlockuiComponent;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  sum: number = 0;
  loginData: any;
  orderData: any;
  detailList: any = [];
  panelOpenState = false;
  displayedColumns: string[] = ['prodId', 'img', 'prodName', 'size', 'qty', 'price', 'subTotal', 'status'];
  dataSource: any;
  cityData: any = [];
  districtList: any = [];
  city: any;
  district: any;
  shipNo: any;


  constructor(private jolService: JolService, private router: Router, private dialog: MatDialog, private http: HttpClient) { }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.loginData = this.jolService.loginData;
    this.orderData = this.jolService.orderData;
    this.getShippingNo();
    this.http.get('assets/json/address.json').subscribe((res: any) => {
      this.cityData = res.filter((a: any) => a.code == this.orderData.sendCity)[0];
      this.city = this.cityData.name;
      this.districtList = this.cityData.district;
      console.log('this.districtList', this.districtList)
      this.district = this.districtList.filter((d: any) => d.code == this.orderData.sendDistrict)[0].name;
    });
    this.getOrderDetail(this.orderData.orderNo);
  }

  getOrderDetail(orderNo: any) {
    if (this.loginData.account != '') {
      this.blockUI.start("讀取中");
      const body = { orderNo: orderNo }
      let request = new Request('JOLOrderDetailInfo', this.loginData.account, 'SELECT', body);
      console.log('request', request)
      this.jolService
        .getData(environment.JOLSERVER, request)
        .subscribe((res) => {
          console.log('res.detailList', res.detailList)
          if (res.detailList.length > 0) {
            this.detailList = res.detailList;
            this.sum = 0;
            this.detailList.forEach((d: any) => {
              this.sum += d.price * d.qty;
              d.img = [];
              d.img = d.imgUrl.split(',');
            });
            this.orderData.deliveryFee = this.orderData.totalAmt - this.sum;
            this.dataSource = new MatTableDataSource<any>(this.detailList);
            this.dataSource.paginator = this.paginator;
            this.blockUI.stop();
          } else {
            this.blockUI.stop();
          }
        });
    } else {
      this.router.navigate(['/login'], { skipLocationChange: true });
    }
  }

  toProduct(prodId: any) {
    this.blockUI.start('讀取中');
    let request = new Request('JOLProductInfo', this.loginData.account, 'SELECT', { prodId: prodId });
    this.jolService.getData(environment.JOLSERVER, request).subscribe((res) => {
      console.log('toProduct,',res)
        this.blockUI.stop();
        var prod = res.productList[0]
        prod.img = prod.imgUrl.split(',');
        this.jolService.prod = prod;
        console.log('this.jolService.prod',this.jolService.prod)
        this.router.navigate(['/product'], { skipLocationChange: true });
      });
  }

  toOrderList() {
    this.router.navigate(['/orderlist'], { skipLocationChange: true });
  }

  padZeros(value: number, length: number): string {
    return value.toString().padStart(length, '0');
  }

  onLoadImg(index: any) {
    console.log('index', index)
    if (index == this.detailList.length - 1) {
      this.blockUI.stop();

    }
  }


  getShippingNo() {
    this.shipNo = Math.floor(Math.random() * 90000000) + 10000000;
  }
}
