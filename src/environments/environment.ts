// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  JOLSERVER: "/jolserver/api/json",
  STRIPE:"/jolserver/api/payment",
  Render_Succ:"https://jol-boutique.onrender.com/orderlist",
  Render_Fail:"https://jol-boutique.onrender.com",
  SUCCESS_URL:"https://ocean-hcz.com/orderlist",
  FAIL_URL:"https://ocean-hcz.com/",
  IMG_URL:"https://ocean-hcz.com",
  STRIPEKEY: 'pk_test_51NIikVB9Nt3grzHaDL44jSn6ycDrs74JlW1iVO7adgmHVJL8dHKSDdwv9athWLV5vya2uOXAP53td2q2eXlClsJL002FlT3ofK',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
