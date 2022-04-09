import { Component } from '@angular/core';
import { AlertController, IonicPage, LoadingController, NavController, NavParams ,Platform} from 'ionic-angular';
import { BankDetailsPage } from '../bank-details/bank-details';
import { PaymentCollectionPage } from '../payment-collection/payment-collection';
import jsSHA from "jssha";
import { InAppBrowser, InAppBrowserEvent } from "@ionic-native/in-app-browser";
import { HomePage } from '../home/home';
import { SpineServiceProvider } from "../../providers/spine-service/spine-service";
import { Storage } from "@ionic/storage";
@IonicPage()
@Component({
  selector: 'page-payment-select',
  templateUrl: 'payment-select.html',
})
export class PaymentSelectPage {
amount:any;
payment_flag:string;
userInfo: any;
invoiceData:any=[];
language:any;
  constructor(
    public navCtrl: NavController,
     public navParams: NavParams,
     private iab: InAppBrowser,
     private platform: Platform,
     private storage: Storage,
     public SpineServiceProvider: SpineServiceProvider,
     public loadingCtrl: LoadingController,
     private alertCtrl: AlertController,) {
      this.storage.get('Language').then(val=>{ 
        this.language= val;
       });

       this.amount = parseFloat(this.navParams.get('amount')).toFixed(2);
       console.log('Payble amount' + this.amount);

       this.payment_flag=this.navParams.get('payment_flag');
       console.log('payment_flag' + this.payment_flag);

       this.invoiceData=this.navParams.get('invoiceData');
       console.log('invoiceData' + navParams.get("invoiceData"));

       this.storage.get("userInfo").then((val) => {
        this.userInfo = val;
        console.log("this.userInfo" +this.userInfo.USER_ID);
        console.log("CUST_CCY " +this.userInfo.CUST_CCY);
        this.setPayCredential();
      });
     
  }

  ionViewDidLoad() {
  //  console.log('ionViewDidLoad PaymentSelectPage');  
  }
  
  mode:any = 'online';
  proceedPayment:boolean=false
  selectModeBank(){
   // var data = document.getElementById('bank');
    console.log("selectModeBank ");
    this.mode = 'bank';
    this.proceedPayment = true;
  }
  selectModeCashCollection(){
    // var data = document.getElementById('online');
     console.log("selectModeCashCollection ");
     this.mode = 'cash';
     this.proceedPayment = true;
   }
  selectModeOnline(){
   // var data = document.getElementById('online');
    console.log("selectModeOnline ");
    this.mode = 'online';
    //this.pay();
    this.proceedPayment = true;
  }
  proceedToPayment(){
    if (this.mode == 'bank') {
      this.navCtrl.push(BankDetailsPage);
    }
    else if  (this.mode == 'cash') {
      this.navCtrl.push(PaymentCollectionPage);
    }
    else if(this.mode == 'online'  ){
      console.log("proceedToPayment " ,this.mode);
      
      this.getRefSysIdFromSpine();
      //this.pay();
    }

  }
  getCurrencyDecimalPoints(ccy_code) {
    let decimalPoint = 2;
    let arrCurrencies = [
      { code: 'JOD', decimal: 3 },
      { code: 'KWD', decimal: 3 },
      { code: 'OMR', decimal: 3 },
      { code: 'TND', decimal: 3 },
      { code: 'BHD', decimal: 3 },
      { code: 'LYD', decimal: 3 },
      { code: 'IQD', decimal: 3 },
    ];
    let filterValue = arrCurrencies.find(currArr => currArr.code === ccy_code);
    if (filterValue !== undefined) {
      return filterValue.decimal;
    }
    return decimalPoint;
  }
  convertFortAmount(amount, currencyCode) {
    let new_amount = 0;
    let decimalPoints = this.getCurrencyDecimalPoints(currencyCode);    
    new_amount = amount * Math.pow(10,decimalPoints);
    return new_amount;
}
  async getRefSysIdFromSpine() {
    let invoice_sys_id = [];
    if (this.payment_flag == 'INVOICE') {
      for (let i = 0; i < this.invoiceData.length; i++) {//substring(event.url.indexOf("fort_id=") + 8 , event.url.length)
      console.log("this.invoiceData[i] ",this.invoiceData[i]);
      let txn_no = this.invoiceData[i].IH_TXN_NO;
          txn_no = txn_no.substring(txn_no.indexOf("IN-")+3,txn_no.length);
        invoice_sys_id.push({
           id: this.invoiceData[i].IH_SYS_ID, 
           txn_code: 'IN',
           txn_no: txn_no,
           amount: this.invoiceData[i].IH_NET_VALUE });
      }
      //working here
    }
    let loading = this.loadingCtrl.create({
      content: 'Getting ID From Spine...'
    });
    loading.present();
    await this.SpineServiceProvider.GetFincPaymentLink_Ref_id(
      invoice_sys_id,
      this.amount ,
      this.payment_flag,
      this.userInfo.USER_ID,
      this.userInfo.USER_SYS_ID,
      this.userInfo.TOKEN,
      this.userInfo.USER_REF,
      this.userInfo.USER_TYPE,
      this.userInfo.menu_list.find(i => i.MENU_DESC === 'Make Payment').MENU_CODE
    ).then((result) => {
      let data = JSON.parse(result["_body"]);
      console.log(" Advance payment status : " + data);
      if (data.error_message == 'Success') {
        console.log("SysId", data.sysID);
        this.pay(data.sysID);
      }
      else {
        alert("getRefSysId " + data.error_message);
      }
    });
    loading.dismiss();
  }
  hash256(value) {
    let shaObj = new jsSHA("SHA-256", "TEXT");
    shaObj.update(value);
    let hash = shaObj.getHash("HEX");
    return hash;
  }

  fort_id:any=null;
  merchant_reference = Math.floor(Math.random() * 100000);
  // merchantIdentifierLive ='UxaZIDzR';
  // accessCodeLive = 'HeKFKJ1VncDPgavpr68O';
  // SHARequestPhraseLive='$2y$10$nZQ2D40Tg';
  async pay(ref_sys_id) {  
    let fortAmount =  this.convertFortAmount(this.amount,this.userInfo.CUST_CCY);
    console.log("payfort amount "+ fortAmount);
    let merchant_extra1 = '';
    if (this.payment_flag=='ADVANCE_PAYMENT') {
      merchant_extra1 = 'ADVANCE_PAYMENT';
    }else {
      merchant_extra1 = this.invoiceData[0].IH_TXN_NO;
    }
    console.log();
    
    let formHtml: string = "";
    //define('merchantIdentifier', 'UxaZIDzR');
    //define('accessCode', 'HeKFKJ1VncDPgavpr68O');
    //define('SHARequestPhrase', '$2y$10$nZQ2D40Tg');
    //define('SHAResponsePhrase', '$2y$10$Pn0kI.ENY');
    let arr: Array<[string, any]> = [];
    arr.push(["command", "PURCHASE"]);
    arr.push(["access_code", this.payCredential.access_code]);
    arr.push(["merchant_identifier", this.payCredential.merchant_identifier]);
    arr.push(["merchant_reference", this.merchant_reference]);
    arr.push(["amount", fortAmount]);
    arr.push(["currency", this.userInfo.CUST_CCY]);
    arr.push(["language", "en"]);
    arr.push(["customer_email", this.userInfo.USER_ID]);
    arr.push(["order_description", "Dealer App "]);
    arr.push(["merchant_extra", "MOBILE_APP"]);//this flag create entry in database
    arr.push(["merchant_extra1", merchant_extra1]);
    arr.push(["merchant_extra2", ref_sys_id]);
    arr.push(["return_url", "https://www.sedarglobal.com/"]);
    arr.sort();
    console.log("arr", arr);

    let hashString = "";
    for (var val of arr) {
      hashString += val[0] + "=" + val[1];
    }
    console.log(hashString);

    let signature = this.hash256(
      this.payCredential.SHARequestPhrase + hashString + this.payCredential.SHARequestPhrase
    );
    console.log("signature", signature);
    for (var key of arr) {
      formHtml +=
        '<input type="hidden" value="' +
        key[1] +
        '" id="' +
        key[0] +
        '" name="' +
        key[0] +
        '"/>';
    }

    formHtml +=
      '<input type="hidden" value="' +
      signature +
      '" id="' +
      "signature" +
      '" name="' +
      "signature" +
      '"/>';
    //console.log(formHtml);

    
    let payScript =
      "var form = document.getElementById('ts-app-payment-form-redirect'); ";
    payScript += "form.innerHTML = '" + formHtml + "';";
    payScript += "form.action = '" + this.payCredential.checkout_url + "';";
    payScript += "form.method = 'POST';";
    payScript += "form.submit();";

    if (this.platform.is("cordova")) {
      let browser = this.iab.create("redirect.html", "_blank", "location=no");
      //browser.show();
      browser.on("loadstart").subscribe(
        (event: InAppBrowserEvent) => {
          console.log("loadstop -->", event);
          var closeUrl = "https://www.sedarglobal.com/";

          if(this.fort_id==null){
            console.log("this.fort_id==null ", this.fort_id==null);
            if(event.url.includes('fort_id=')){
              this.fort_id = event.url.substring(event.url.indexOf("fort_id=") + 8 , event.url.length);//event.url.substr((event.url.length - 18));
              console.log("fortId ", this.fort_id);
             // browser.close();
              
            }
          }
          if (event.url == closeUrl) {
            // if (event.url.iOf("some error url") > -1) {
              console.log("event.url == closeUrl",event.url == closeUrl);
            browser.close();
            this.checkPaymentStatus();
            this.navCtrl.setRoot(HomePage, { success: false });
          }
        },
        (err) => {
          console.log("InAppBrowser loadstart Event Error: " + err);
        }
      );
      //on url load stop
      browser.on("loadstop").subscribe(
        (event) => {          
          //here we call executeScript method of inappbrowser and pass object
          //with attribute code and value script string which will be executed in the inappbrowser
          browser.executeScript({
            code: payScript,
          });
          console.log("loadstop -->", event);
        },
        (err) => {
          console.log("InAppBrowser loadstop Event Error: " + err);
        }
      );
      //on closing the browser
      browser.on("exit");
      //     .subscribe(
      //       console.log("exit -->", event);
      // },
      // err => {
      //   console.log("InAppBrowser loadstart Event Error: " + err);
      // });
    }
  }
 
  /**
   * checkPaymentStatus() validate payment with payfort and save in spine
   *  */ 
  access_codeSandBox:any='wXM8qpBYUw2tmJpZceFD';
  merchant_identifier:any='IcywLPmc';
  async checkPaymentStatus() {
    let loading = this.loadingCtrl.create({
      content: 'Checking Payment Status...'
    });
  
    loading.present();
    console.log(" checkPaymentStatus Started*****");
    let arr: Array<[string, any]> = [];
    arr.push(["query_command", "CHECK_STATUS"]);
    arr.push(["access_code", this.payCredential.access_code]);
    arr.push(["merchant_identifier", this.payCredential.merchant_identifier]);
    arr.push(["merchant_reference", this.merchant_reference]);
    arr.push(["language", "en"]);
    //arr.push(["fort_id", this.fort_id]);
    arr.sort();
    console.log("arr", arr);
    let hashString = "";
    for (var val of arr) {
      hashString += val[0] + "=" + val[1];
    }
    let signature = this.hash256(
      this.payCredential.SHARequestPhrase + hashString +  this.payCredential.SHARequestPhrase
    );
    
    
    // Validate transenction with fort_id and merchant refference
    
    await this.SpineServiceProvider.checkPaymentStatus(
    this.payCredential.access_code,
    this.payCredential.merchant_identifier,
    this.merchant_reference,
    signature,
    this.fort_id,
    this.payCredential.statusCheck_url
    ).subscribe(data => {
      console.log('Amazon Status 1 :',data);
            /**
             * access_code: "wXM8qpBYUw2tmJpZceFD"
        authorized_amount: "120900"
        captured_amount: "0"
        fort_id: "169996200000784906"
        language: "en"
        merchant_identifier: "IcywLPmc"
        merchant_reference: "2705"
        query_command: "CHECK_STATUS"
        refunded_amount: "0"
        response_code: "12000"
        response_message: "Success"
        signature: "5d2d763541cebb25c9b71bd3fb4f3798c3028640618e3a1ef40e3ad6abd5ad80"
        status: "12"
        transaction_code: "02000"
        transaction_message: "Success"
        transaction_status: "02"
        */
        if (data.status=='12') {
          console.log("Check status success.");
          if (data.transaction_status=='14') {
            console.log("Purchase Success.");
            let alert = this.alertCtrl.create({
              title: 'Payment Success',
              subTitle: 'Amount '+this.amount+' '+this.userInfo.CUST_CCY,
              buttons: ['ok']
            });
            alert.present();
          }else{
            let alert = this.alertCtrl.create({
              title: 'Payment Failed ! '+data.transaction_message,
              subTitle: 'Amount '+this.amount,
              buttons: ['ok']
            });
            alert.present();
          } 
          this.navCtrl.setRoot(HomePage);
        }else {
          alert("Payment Status "+data.response_message);
        }
    }, 
     error => {
       console.log(JSON.stringify(error.json()));
      }
    );
    
    loading.dismiss();
    this.navCtrl.setRoot(HomePage);
  }
  sandbox:boolean =this.SpineServiceProvider.sandbox ;
  payCredential:any;
  setPayCredential(){
    //UAE and other currency
    if (this.userInfo.CUST_CCY != 'SAR') {
      if (this.sandbox == false) {
         //Live paramenter for UAE n other country
        this.payCredential = {
          access_code: 'HeKFKJ1VncDPgavpr68O',
          merchant_identifier: 'UxaZIDzR',
          SHARequestPhrase: '$2y$10$nZQ2D40Tg',
          SHAResponsePhrase: '$2y$10$Pn0kI.ENY',
          checkout_url: 'https://checkout.payfort.com/FortAPI/paymentPage',
          statusCheck_url: 'https://paymentservices.payfort.com/FortAPI/paymentApi'
        }
      }
      else {
         //sandbox parameter for UAE n other country
        this.payCredential = {
          access_code: 'wXM8qpBYUw2tmJpZceFD',
          merchant_identifier: 'IcywLPmc',
          SHARequestPhrase: '$2y$10$18DmYn67L',
          SHAResponsePhrase: '',
          checkout_url: 'https://sbcheckout.PayFort.com/FortAPI/paymentPage',
          statusCheck_url: 'https://sbpaymentservices.payfort.com/FortAPI/paymentApi'
        }
      }
    }

    // KSA currency case
    if (this.userInfo.CUST_CCY == 'SAR') {
      if (this.sandbox == false) {
        //Live paramenter for KSA
        this.payCredential = {
          access_code: 'ZmydsT4OzSkZaTqS9r1h',
          merchant_identifier: 'UxaZIDzR',
          SHARequestPhrase: '21Jv2L2CaQclA1yatuoQAr}]',
          SHAResponsePhrase: '89jEpOXaHFqroA.SIwK0NT#}',
          checkout_url: 'https://checkout.payfort.com/FortAPI/paymentPage',
          statusCheck_url: 'https://paymentservices.payfort.com/FortAPI/paymentApi'
        }
      }
      else {
        //sandbox parameter for KSA
        this.payCredential = {
          access_code: 'g2IyvZ9IsOsbl2g9OG6v',
          merchant_identifier: 'IcywLPmc',
          SHARequestPhrase: 'UIqd/eG04fTaH1Lji9l8',
          SHAResponsePhrase: 'OnquooaOdLlv1wm3/zz.',
          checkout_url: 'https://sbcheckout.PayFort.com/FortAPI/paymentPage',
          statusCheck_url: 'https://sbpaymentservices.payfort.com/FortAPI/paymentApi'
        }
      }
    }
  }
}
