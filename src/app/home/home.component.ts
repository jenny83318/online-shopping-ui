import { JolService } from './../service/JolService.service';
import { Component, OnInit,ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Request } from '../model/Request';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit
{
custList:any=[];
isOpen:boolean = false;
isSlide:boolean = false;
imageUrl: SafeUrl;
img:any;
base64Title:String="data:image/jpeg;base64,";
  constructor(private jolService: JolService, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    // this.getHomeData();
    // this.getProductData()
  }

  getHomeData(){
    const body =  {type: "ALL"}
    let request = new Request("JOLCustomerInfo","jenny83318",body);
    console.log('request', request)
    this.jolService.getData(environment.JOLSERVER, request).subscribe(res => {
      console.log('res',res);
      this.custList = res.custList

    });
  }
  getProductData(){
    const body =  {type: "ALL"}
    let request = new Request("JOLProductInfo","jenny83318",body);
    console.log('request', request)
    this.jolService.getData(environment.JOLSERVER , request).subscribe(res => {
      console.log('res',res);
      this.custList = res.productList
      let byteData = this.custList[0].byteArrayList[0];
      this.img=this.base64Title+byteData;
      // const binaryData = new TextEncoder().encode('your binary data here');
      // console.log('byteData',byteData)
      // const blob = new Blob([byteData], { type: 'image/png' }); // 創建 Blob 對象
      // this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(
      //   URL.createObjectURL(blob) // 創建圖片 URL
      // );
    });
  }
  showMenu(){
    this.isOpen = this.isOpen == false ? true : false;
  }
  showSlideBar(){
    this.isSlide = this.isSlide == false ?  true : false;

  }
}
