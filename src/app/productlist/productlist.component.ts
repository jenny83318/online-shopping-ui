import { JolService } from './../service/JolService.service';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Request } from '../model/Request';
import { BlockuiComponent } from './../blockui/blockui.component';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-productlist',
  templateUrl: './productlist.component.html',
  styleUrls: ['./productlist.component.scss']
})
export class ProductlistComponent implements OnInit {

  @BlockUI() blockUI!: NgBlockUI;
  block = BlockuiComponent;
  isBlock:boolean = false;
  prodList: any = [];
  isOpen: boolean = false;
  isSlide: boolean = false;
  isHover:boolean = false;
  type:string ='';
  category:string='';
  item:any ={all:[{category:'1', name: "上身"},
  {category:'2', name: "下身"},
  {category:'3', name: "連身"},
  {category:'4', name: "鞋包配件"}]
  , new:['最新商品'], sales:['熱銷商品'],sport:['運動系列'], search:['搜尋商品結果']}
  constructor(private jolService: JolService,public dialog: MatDialog) { }

  ngOnInit() {
    window.scrollTo(0,0)
    this.type = this.jolService.toProductList;
    this.category = this.jolService.category;
    console.log('this.prodList', this.jolService.prodList)
    this.prodList = this.jolService.prodList
    this.isHover =  this.prodList.length > 3 ? true : false;
    this.jolService.prodListChange.subscribe((prodList) => {
      window.scrollTo(0,0)
      this.type = this.jolService.toProductList;
      this.category = this.jolService.category;
      this.prodList = prodList;
      this.isHover =  this.prodList.length > 3 ? true : false;
      console.log('this.prodList', this.prodList)
    });
  }
  loadImageFinish(msg: string) {
    if(msg == 'load'){
      this.blockUI.stop();
    }
  }

  toProductList(selectType: any, keyWord: any) {
    this.jolService.getProductData('OTHER', {
      selectType: selectType,
      keyWord: keyWord,
    });
  }
}
