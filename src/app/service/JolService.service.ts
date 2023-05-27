import { Injectable, EventEmitter } from '@angular/core';
import { Request } from '../model/Request';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class JolService {
  cartChange = new EventEmitter<number>();
  wishChange = new EventEmitter<number>();
  isLogin:boolean = false;
  loginData:any = {account:"", password:"", token:""};
  prod:any;
  cartNum:number = 0
  wishNum:number = 0
  isHeaderCheck = false;
  
  constructor(private httpClient: HttpClient) { }

  getData(url: string, request: Request) {
    var httpHeaders = { headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' }) };
    return this.httpClient.post<any>(url, request, httpHeaders);
  }
  resetLoginData(){
    this.loginData ={account:"", password:"", token:""};
  }
  setCartNum( cartNum:number) {
    this.cartNum = cartNum;
    this.cartChange.emit(this.cartNum);
  }
  setWishNum( wishNum:number) {
    this.wishNum = wishNum;
    this.wishChange.emit(this.wishNum);
  }
}
