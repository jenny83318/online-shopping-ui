import { Injectable } from '@angular/core';
import { ReqHeader } from '../model/ReqHeader';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class JolService {

constructor(private httpClient: HttpClient) { }

getData(url: string, request: Request) {
  var httpHeaders = { headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' }) };
  return this.httpClient.post<any>(url, request, httpHeaders);
  // return this.httpClient.get(url);

}
}
// export class Request {
//   header: ReqHeader;
//   body: Object;
//   constructor(fun: string, uid:string, object: Object) {
//     this.header = new ReqHeader();
//     this.header.fun = fun;
//     this.header.uid = uid;
//     this.body = object;
//   }
// }

export class Request {
   account:string;
   body:any;
  constructor(account:string, body:any) {
    this.account =account;
    this.body = body
  }
}
