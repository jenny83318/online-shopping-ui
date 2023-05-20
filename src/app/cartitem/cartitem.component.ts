import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Request } from '../model/Request';
import { JolService } from './../service/JolService.service';
import { Router } from '@angular/router';
import { BlockuiComponent } from './../blockui/blockui.component';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-cartitem',
  templateUrl: './cartitem.component.html',
  styleUrls: ['./cartitem.component.scss'],
})
export class CartitemComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  block = BlockuiComponent;
  loginData: any;
  cartList:any;
  sum:number =0;
  constructor(private jolService: JolService, private router: Router) {}

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.loginData = this.jolService.loginData;
    this.getCartData();
  }

  getCartData() {
    if (this.loginData.account != '') {
      const body = {
        type: 'SELECT',
        isCart: true,
      };
      let request = new Request('JOLCartInfo', this.loginData.account, body);
      console.log('request', request);
      this.jolService
        .getData(environment.JOLSERVER, request)
        .subscribe((res) => {
          this.blockUI.start('讀取中');
          this.cartList = res.cartList;
          this.cartList.forEach((cart: any) => {
            cart.img = [];
            cart.img = cart.imgUrl.split(',');
            cart.isOnload =false;
            this.sum += cart.qty* cart.price;
          });
        });
    } else {
      this.router.navigate(['/login'], { skipLocationChange: true });
    }
  }

  onLoadImg(index:any){
    if(index == this.cartList.length-1){
      this.blockUI.stop();

    }
  }
}
