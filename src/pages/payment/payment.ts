import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
} from "ionic-angular";
import { SpineServiceProvider } from "../../providers/spine-service/spine-service";
import { Http, Headers, RequestOptions } from "@angular/http";
import { Storage } from "@ionic/storage";
import { PaymentSelectPage } from "../payment-select/payment-select";

@IonicPage()
@Component({
  selector: "page-payment",
  templateUrl: "payment.html",
})
export class PaymentPage {
  paymethods: any;
  options: any;
  userInfo: any;
  paymentType:string= 'advance';
  disableAdvancePay:boolean;
  menu_access_code:string;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public service: SpineServiceProvider,
    public http: Http,
    private alertCtrl: AlertController,
    private storage: Storage,
    public SpineServiceProvider: SpineServiceProvider,
  ) {
    this.paymethods = "creditcard";

    let headers = new Headers({
      "Content-Type": "application/json",
    });

    this.options = new RequestOptions({ headers: headers });

    this.storage.get("userInfo").then((val) => {
      this.userInfo = val;
      this.menu_access_code = this.userInfo.menu_list.find(i => i.MENU_DESC === 'Make Payment').MENU_CODE;
      //console.log("this.userInfo" + this.userInfo.USER_ID);
    });

    //console.log(" selected invoice", navParams.get("invoiceData"));
    if (navParams.get("invoiceData")) {
      this.disableAdvancePay=true;
      this.paymentType='invoice';
      this.invoiceData = navParams.get("invoiceData");
      this.calculateTotalAmount();
    }
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad PaymentPage");
  }

  

  loading: boolean=false;
  invoice_no: any;
  invoiceData: any[] = [];
  totalAmount = 0;
  amount: any;
  async getInvoiceDetails() {
    let allowSearch = true;
    this.invoiceData.forEach(element => {
      console.log('element ',element.IH_TXN_NO.substring(element.IH_TXN_NO.indexOf("-")+1));
      let invoice = element.IH_TXN_NO.substring(element.IH_TXN_NO.indexOf("-")+1)
      if (invoice == this.invoice_no) {
        allowSearch = false;
        console.log("Invoice Already there");
        let alert = this.alertCtrl.create({
          title: "Duplicate Invoice",
          subTitle: "IN-"+this.invoice_no+" already added to list ",
          buttons: ["Ok"],
        });
        alert.present();
      }
    });
    
    if (allowSearch) {
        this.loading = true;
      await this.SpineServiceProvider.getInvoicedDetails(
        this.invoice_no,
        this.userInfo.USER_ID,
        this.userInfo.USER_SYS_ID,
        this.userInfo.TOKEN,
        this.userInfo.USER_REF,
        this.userInfo.USER_TYPE,
        this.menu_access_code
      ).then((result) => {
        try {
          let data = JSON.parse(result["_body"]);
          //push new invoice to array of invoice
          data[0].IH_TXN_NO = "IN-" + data[0].IH_TXN_NO;
          this.invoiceData.push(data[0]);
          console.log("this.invoiceData ", this.invoiceData);
        } catch (error) {
          let alert = this.alertCtrl.create({
            title: "Invoice Not Found",
            subTitle: "Please enter valid invoice numbers",
            buttons: ["Ok"],
          });
          alert.present();
          
        }

      });
      this.calculateTotalAmount();
      this.invoice_no = "";
      this.loading = false;
    }
    

  }
  calculateTotalAmount() {
    for (let i = 0; i < this.invoiceData.length; i++) {
      const element = this.invoiceData[i];
      this.totalAmount = this.totalAmount + Number(element.IH_NET_VALUE);
      console.log("total amount", this.totalAmount);
    }
    this.amount = this.totalAmount;
  }
  goToPaymentSelection(payment_flag) {
    this.navCtrl.push(PaymentSelectPage,{amount:this.amount,payment_flag:payment_flag,invoiceData:this.invoiceData});
  }

  amountChecker(data) {
    console.log("amount checker " + data);
    if (Number(data) > 1000000) {
      let alert = this.alertCtrl.create({
        title: "Amount not allowed",
        subTitle: "Amount can not be more then 1,000,000.",
        buttons: ["Ok"],
      });
      alert.present();
    }
  }
}
