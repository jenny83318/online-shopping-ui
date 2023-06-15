export class StripeRequest {
  amount:number
  name:string
  currency:string
  successUrl:string
  cancelUrl:string
  quantity:number
  constructor(amount:number, name:string, currency:string, successUrl:string,cancelUrl:string, quantity:number ) {
    this.amount = amount;
    this.name =name;
    this.currency = currency;
    this.successUrl = successUrl;
    this.cancelUrl = cancelUrl;
    this.quantity = quantity;
  }
}
