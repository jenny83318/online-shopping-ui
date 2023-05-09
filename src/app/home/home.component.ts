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
prodList:any=[];
isOpen:boolean = false;
isSlide:boolean = false;
imageUrl: SafeUrl;
img:any;
base64Title:String="data:image/jpeg;base64,";
  constructor(private jolService: JolService, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.getHomeData();
    this.getProductData()
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
      this.prodList = res.productList
      this.prodList.forEach((prod:any) => {
        prod.img =[];
        for(let i = 0; i < prod.imgList.length; i++){
          prod.img.push(this.base64Title + prod.imgList[i]);
        }
      });
    });
  }
  mouseOverImg(prodId:any) {
    this.prodList.forEach((prod:any) => {
    if(prod.prodId == prodId){
      let img = prod.img[0];
      prod.img[0] = prod.img[1];
      prod.img[1] = img;
    }
   });
  }

  mouseLeaveImg(prodId:any) {
    this.prodList.forEach((prod:any) => {
      if(prod.prodId == prodId){
        let img = prod.img[0];
        prod.img[0] = prod.img[1];
        prod.img[1] = img;
      }
     });
  }
  showMenu(){
    this.isOpen = this.isOpen == false ? true : false;
  }
  showSlideBar(){
    this.isSlide = this.isSlide == false ?  true : false;

  }
}
