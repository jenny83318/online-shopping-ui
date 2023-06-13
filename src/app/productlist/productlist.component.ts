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
  constructor(private jolService: JolService,public dialog: MatDialog) { }

  ngOnInit() {
    console.log('this.prodList', this.jolService.prodList)
    this.prodList = this.jolService.prodList
    this.jolService.prodListChange.subscribe((prodList) => {
      this.prodList = prodList;
      console.log('this.prodList', this.prodList)
    });
  }
  loadImageFinish(msg: string) {
    if(msg == 'load'){
      this.blockUI.stop();
    }
  }
}
