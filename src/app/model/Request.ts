export class Request {
  fun:string;
  account:string;
  type:string;
  body:any;
 constructor(fun:string, account:string, type:string, body:any) {
   this.fun = fun;
   this.account =account;
   this.body = body;
   this.type = type;
 }
}
