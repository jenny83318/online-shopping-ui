import { Component, OnInit, ViewChild,HostListener } from '@angular/core';
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
  styleUrls: ['./orderdetail.component.scss', './orderdetailExtra.component.scss']
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
  isShowElement:boolean =false;


  constructor(private jolService: JolService, private router: Router, private dialog: MatDialog, private http: HttpClient) { }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.loginData = this.jolService.getLoginData();
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
    this.updateElementVisibility()
  }
  @HostListener('window:resize', ['$event'])
  onWindowResize(event: Event) {
    this.updateElementVisibility();
  }
  updateElementVisibility() {
    const screenWidth = window.innerWidth;
    if (screenWidth < 768) {
      this.isShowElement = true;
    } else {
      this.isShowElement = false;
    }
  }


  getOrderDetail(orderNo: any) {
    if (this.loginData.account != '') {
      this.blockUI.start("讀取中");
      const body = { orderNo: orderNo }
      let request = new Request('JOLOrderDetailInfo', this.loginData.account, this.loginData.token, 'SELECT', body);
      console.log('request', request)
      this.jolService
        .getData(environment.JOLSERVER, request)
        .subscribe((res) => {
          if (res.code == 200) {
            console.log('res.detailList', res.detailList)
            if (res.detailList.length > 0) {
              this.detailList = res.detailList;
              this.sum = 0;
              this.detailList.forEach((d: any) => {
                this.sum += d.price * d.qty;
                d.img = [];
                d.img = d.imgUrl.split(',');
                d.img[0] = this.jolService.getImgUrl(d.img[0]);
                d.img[1] = this.jolService.getImgUrl(d.img[1]);
              });
              this.orderData.deliveryFee = this.orderData.totalAmt - this.sum;
              this.dataSource = new MatTableDataSource<any>(this.detailList);
              this.dataSource.paginator = this.paginator;
              this.blockUI.stop();
            } else {
              this.blockUI.stop();
            }
          } else if (res.code == 666) {
            this.jolService.resetLoginData();
            this.router.navigate(['/login']);
          }
        });
    } else {
      this.router.navigate(['/login']);
    }
  }

  toProduct(prodId: any) {
    this.jolService.prod = this.jolService.allProds.filter((prod: any) => prod.prodId == prodId)[0];
    this.router.navigate(['/product']);
  }

  toOrderList() {
    this.router.navigate(['/orderlist']);
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
