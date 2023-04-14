export class ReqHeader {
  ch: string ;
  reqNo: string;
  fun!:string;
  type: string;
  bid!: string;
  uid!: string;
  ver: string;
  token: string;

  constructor() {
    this.ch = "isp";
    this.reqNo = "";
    this.type = "";
    this.ver = "";
    this.token = "";
  }
}
