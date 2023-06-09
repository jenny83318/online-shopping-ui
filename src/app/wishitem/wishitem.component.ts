import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Request } from '../model/Request';
import { JolService } from './../service/JolService.service';
import { Router } from '@angular/router';
import { CartblockComponent } from '../cartblock/cartblock.component';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { MatDialog } from '@angular/material/dialog';
import { MessageComponent } from '../message/message.component';
import { CartdetailComponent } from '../cartdetail/cartdetail.component';
@Component({
  selector: 'app-wishitem',
  templateUrl: './wishitem.component.html',
  styleUrls: ['./wishitem.component.scss', './wishitemExtra.component.scss']
})
export class WishitemComponent implements OnInit {
  @BlockUI() blockUI!: NgBlockUI;
  block =CartblockComponent;
  loginData: any;
  wishList:any;
  sum:number =0;
  ishidden:boolean = false;
  flag:number =1;
  constructor(private jolService: JolService, private router: Router, private dialog: MatDialog) {}

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.loginData = this.jolService.getLoginData();
    this.getWishData(0);
    this.jolService.wishListChange.subscribe(() => {
      this.getWishData(this.flag);
    });
  }

  getWishData(flag:number) {
    if( flag == 0 || this.flag <= 1){
      if (this.loginData.account != '') {
        const body = {
        isCart: false,
      };
      let request = new Request('JOLCartInfo', this.loginData.account, this.loginData.token, 'SELECT', body);
      console.log('request', request);
      this.jolService
      .getData(environment.JOLSERVER, request)
      .subscribe((res) => {
        this.flag = flag ==  1 ? 2 : 1;
        if(res.code == 200){
            this.blockUI.start('讀取中');
            this.wishList = res.cartList;
            console.log('this.wishList',this.wishList)
            if(this.wishList.length == 0){
              this.sum == 0;
              this.ishidden = true;
              this.blockUI.stop();
            }else{
              this.ishidden = false;
            }
            this.jolService.setWishNum(this.wishList.length);
            this.sum = 0
            this.wishList.forEach((wish: any) => {
              wish.img = [];
              wish.img = wish.imgUrl.split(',');
              wish.isOnload =false;
              console.log('cart.qty* cart.price',wish.qty* wish.price)
              this.sum += wish.qty* wish.price;
            });
          }else if (res.code == 666) {
            this.jolService.resetLoginData();
            this.router.navigate(['/login'], { skipLocationChange: false });
          }
        });
      } else {
        this.router.navigate(['/login'], { skipLocationChange: false });
      }
    }
  }

  deleteWishItem(wishId :any){
    const dialogRef = this.dialog.open(MessageComponent, { data: { msg: '您確定要刪除?', isConfirm:true } });
    dialogRef.afterClosed().subscribe(isConfirm => {
      if (isConfirm) {
        const body = {
          isCart: true,
          cartId:wishId
        };
        let request = new Request('JOLCartInfo', this.loginData.account, this.loginData.token ,'DELETE' ,body);
        console.log('request', request);
        this.jolService
          .getData(environment.JOLSERVER, request)
          .subscribe((res) => {
            if(res.code == 200){
              this.getWishData(0);
            } else if (res.code == 666) {
              this.jolService.resetLoginData();
              this.router.navigate(['/login'], { skipLocationChange: false });
            }
            console.log('res',res)
          });
      }
    });
  }

  addCart(cart:any) {
    const dialogRef = this.dialog.open(CartdetailComponent,{ data:cart.sizeInfo})
    dialogRef.afterClosed().subscribe(order => {
      if(order.isConfirm){
        if(this.loginData.account != ''){
          this.jolService.addCartWish(cart.prodId, order.qty, order.size, true, false,false);
        }else{
          this.router.navigate(['/login'], { skipLocationChange: false });
        }
      }
    });
  }


  changeQty(isPlus: boolean, cartId:any) {
    this.wishList.forEach((wish: any) =>{
      if(wish.cartId == cartId){
        wish.qty = isPlus ? (wish.qty += 1) : wish.qty <= 1 ? 1 : (wish.qty -= 1);
        this.countSum();
      }
    })
  }

  toProductList() {
    this.jolService.getProductData("OTHER", { selectType: "series", keyWord: "new" });
  }
  toProduct(prodId: any) {
    this.blockUI.start('讀取中');
    let request = new Request('JOLProductInfo', this.loginData.account, this.loginData.token, 'SELECT', { prodId: prodId });
    this.jolService.getData(environment.JOLSERVER, request).subscribe((res) => {
      if (res.code == 200) {
        console.log('toProduct,', res)
        this.blockUI.stop();
        var prod = res.productList[0]
        prod.img = prod.imgUrl.split(',');
        this.jolService.prod = prod;
        console.log('this.jolService.prod', this.jolService.prod)
        this.router.navigate(['/product'], { skipLocationChange: false });
      } else if (res.code == 666) {
        this.jolService.resetLoginData();
        this.router.navigate(['/login'], { skipLocationChange: false });
      }
    });
  }
  countSum(){
    this.sum = 0;
    this.wishList.forEach((wish: any) => {
      this.sum += wish.qty* wish.price;
    })
  }
  onLoadImg(index:any){
    if(index == this.wishList.length-1){
      this.blockUI.stop();

    }
  }

  padZeros(value: number, length: number): string {
    return value.toString().padStart(length, '0');
  }
}
