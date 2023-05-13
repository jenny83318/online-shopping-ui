import { JolService } from './../service/JolService.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Request } from '../model/Request';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { BlockuiComponent } from './../blockui/blockui.component';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

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
  imageUrl: SafeUrl;
  img: any;
  base64Title: String = "data:image/jpeg;base64,";
  filePath:string="file://D:/Develop/Projects/JOLUI/prodImg/prod"
  constructor(private jolService: JolService, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.getProductData()
  }

  getProductData() {

    this.blockUI.start('讀取中');
    const body = { type: "ALL" }
    let request = new Request("JOLProductInfo", "jenny83318", body);
    console.log('request', request)
    this.jolService.getData(environment.JOLSERVER, request).subscribe(res => {
      // this.blockUI.stop();
      console.log('res', res);
      this.prodList = res.productList
      this.prodList.forEach((prod: any) => {
        prod.img = [];
        prod.img = prod.imgUrl.split(',');
        prod.imgUrl =prod.img[0];
        prod.isOnload =false;
      });
    });
  }
  mouseOverImg(prodId: any) {
    this.prodList.forEach((prod: any) => {
      if (prod.prodId == prodId) {
        const img = new Image();
        img.src = prod.img[1];
        img.onload = () => {
          prod.imgUrl = prod.img[1];
        };
      }
    });
  }

  mouseLeaveImg(prodId: any) {
    this.prodList.forEach((prod: any) => {
      if (prod.prodId == prodId) {
        const img = new Image();
        img.src = prod.img[0];
        img.onload = () => {
          prod.imgUrl = prod.img[0];
        };
      }
    });
  }
  showMenu() {
    this.isOpen = this.isOpen == false ? true : false;
  }
  showSlideBar() {
    this.isSlide = this.isSlide == false ? true : false;

  }
  onImageLoad(){
    this.blockUI.stop();
  }
  receiveMessage(msg: string) {
    if(msg == 'load'){
      this.blockUI.stop();
    }
  }
}
