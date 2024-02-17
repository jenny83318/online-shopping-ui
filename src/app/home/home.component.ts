import { JolService } from './../service/JolService.service';
import { Component, OnInit } from '@angular/core';
import { BlockuiComponent } from './../blockui/blockui.component';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { MatDialog } from '@angular/material/dialog';
import { MessageComponent } from '../message/message.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  block = BlockuiComponent;
  loginData: any;
  isBlock: boolean = false;
  prodList: any = [];
  isOpen: boolean = false;
  isSlide: boolean = false;
  constructor(private jolService: JolService, public dialog: MatDialog) { }

  ngOnInit() {
    window.scrollTo({top:0, behavior:'smooth'});
    if(!(localStorage.getItem("isNotShow") == 'true')){
      const dialogRef = this.dialog.open(MessageComponent, { data: { msg: '本網站純屬個人作品，無任何商業用途，網站內的支付工具皆串接測試環境，不會真實扣款，請安心瀏覽。', isShow:true } });
      dialogRef.afterClosed().subscribe(isNotShow => {
        localStorage.setItem("isNotShow", String(isNotShow));
      });
    }
    this.loginData = this.jolService.getLoginData();
    if (localStorage.getItem('isToPay') != null) {
      localStorage.removeItem('isToPay');
    }
    this.getProductData();
  }

  getProductData() {
    if (this.jolService.indexProd.length != 0) {
      this.prodList = this.jolService.indexProd;
    } else {
      this.jolService.getProductData("ALL", {});
      this.jolService.prodListChange.subscribe((prodList) => {
        window.scrollTo(0,0)
        this.prodList = prodList;
      });
    }
  }
  loadImageFinish(msg: string) {
    if (msg == 'load') {
      this.blockUI.stop();
    }
  }
}
