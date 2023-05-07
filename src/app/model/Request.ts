export class Request {
  fun:string;
  account:string;
  body:any;
 constructor(fun:string, account:string, body:any) {
   this.fun = fun;
   this.account =account;
   this.body = body
 }
}
