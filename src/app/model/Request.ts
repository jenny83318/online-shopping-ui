export class Request {
  fun:string;
  account:string;
  token:string;
  type:string;
  body:any;
 constructor(fun:string, account:string,token:string, type:string, body:any) {
   this.fun = fun;
   this.account =account;
   this.token =token;
   this.body = body;
   this.type = type;
 }
}
