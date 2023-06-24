import { JolService } from './../service/JolService.service';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Request } from '../model/Request';
import { BlockuiComponent } from './../blockui/blockui.component';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  block = BlockuiComponent;

  isBlock: boolean = false;
  prodList: any = [];
  isOpen: boolean = false;
  isSlide: boolean = false;
  constructor(private jolService: JolService, public dialog: MatDialog) {}

  ngOnInit() {
    window.scrollTo(0,0)
    if (localStorage.getItem('isToPay') != null) {
      localStorage.removeItem('isToPay');
    }
    this.getProductData();
  }

  getProductData() {
    if (this.jolService.indexProd.length != 0) {
      this.prodList = this.jolService.indexProd;
    } else {
      this.blockUI.start('讀取中');
      let request = new Request('JOLProductInfo', 'jenny83318', 'ALL', {});
      console.log('request', request);
      this.jolService
        .getData(environment.JOLSERVER, request)
        .subscribe((res) => {
          this.prodList = res.productList.slice(0, 24);
          console.log('this.prodList', this.prodList);
          this.prodList.forEach((prod: any) => {
            prod.img = [];
            prod.img = prod.imgUrl.split(',');
            prod.imgUrl = prod.img[0];
            prod.isOnload = false;
          });
          this.jolService.indexProd = this.prodList;
        });
    }
  }
  loadImageFinish(msg: string) {
    if (msg == 'load') {
      this.blockUI.stop();
    }
  }
}
