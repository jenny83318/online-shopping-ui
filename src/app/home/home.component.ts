import { JolService } from './../service/JolService.service';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Request } from '../model/Request';
import { BlockuiComponent } from './../blockui/blockui.component';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  @BlockUI() blockUI!: NgBlockUI;
  block = BlockuiComponent;

  isBlock:boolean = false;
  prodList: any = [];
  isOpen: boolean = false;
  isSlide: boolean = false;
  constructor(private jolService: JolService,public dialog: MatDialog) { }

  ngOnInit() {
    this.getProductData()
  }

  getProductData() {
    this.blockUI.start('讀取中');
    const body = { type: "ALL" }
    let request = new Request("JOLProductInfo", "jenny83318", body);
    console.log('request', request)
    this.jolService.getData(environment.JOLSERVER, request).subscribe(res => {
      this.prodList = res.productList
      this.prodList.forEach((prod: any) => {
        prod.img = [];
        prod.img = prod.imgUrl.split(',');
        prod.imgUrl =prod.img[0];
        prod.isOnload =false;
      });
    });
  }
  loadImageFinish(msg: string) {
    if(msg == 'load'){
      this.blockUI.stop();
    }
  }
}
