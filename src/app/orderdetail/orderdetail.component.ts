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
  selector: 'app-orderdetail',
  templateUrl: './orderdetail.component.html',
  styleUrls: ['./orderdetail.component.scss']
})
export class OrderdetailComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  block = BlockuiComponent;
  loginData: any;
  orderData:any;
  detailList:any =[];
  panelOpenState = false;
  displayedColumns: string[] = ['prodId','img','prodName', 'qty', 'price', 'status','cancel'];
  dataSource:any;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private jolService: JolService, private router: Router, private dialog: MatDialog) { }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.loginData = this.jolService.loginData;
    this.orderData = this.jolService.orderData;
    this.detailList = this.orderData.orderDetail;
    this.detailList.forEach((d: any) => {
      d.img = [];
      d.img = d.imgUrl.split(',');
    });
    this.dataSource =new MatTableDataSource<any>(this.detailList);
    this.dataSource.paginator = this.paginator;
    console.log('orderData', this.orderData)
  }


  toOrderList(){
    this.router.navigate(['/orderlist'], { skipLocationChange: true });
  }

  padZeros(value: number, length: number): string {
    return value.toString().padStart(length, '0');
  }
}
