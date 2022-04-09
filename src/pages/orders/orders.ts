import { Component,ViewChild } from "@angular/core";
import { AlertController, IonicPage, LoadingController, NavController, NavParams } from "ionic-angular";
import { SpineServiceProvider } from "../../providers/spine-service/spine-service";
import { Storage } from '@ionic/storage';
import moment from "moment";
import { PdfProvider } from "../../providers/pdf/pdf";
declare var cordova:any;
@IonicPage()
@Component({
  selector: "page-orders",
  templateUrl: "orders.html",
})
export class OrdersPage {
  @ViewChild("pdfEl") pdfEl;
  userInfo: any;
  orders: any;
  loading: boolean;

  fromDate: any = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  uptoDate: any = new Date().toISOString(); //moment();
  today: any = new Date().toISOString();
  menu_access_code:string;
  constructor(
    public navCtrl: NavController,
    public SpineServiceProvider: SpineServiceProvider,
    public navParams: NavParams,
    private storage: Storage,
    private pdf : PdfProvider,
    private alertCtrl: AlertController,
    public loadingCtrl: LoadingController
  ) {
    this.storage.get('userInfo').then(val=>{ 
      this.userInfo = val;
      this.menu_access_code = this.userInfo.menu_list.find(i => i.MENU_DESC === 'Orders').MENU_CODE;
      this.getOrders();
     });
    //this.userInfo = this.navParams.get("userInfo");
  }

  ionViewDidLoad() {
    //console.log("ionViewDidLoad OrdersPage");
    
  }

  async getOrders() {
    if ( this.fromDate > this.uptoDate  ) {
      const confirm = this.alertCtrl.create({
        title: "Wrong Date !" ,
        message:"From Date should be less than Upto Date",
        buttons: [
          {
            text: "ok",
            handler: () => {
              //console.log("Agree clicked");
            },
          },
        ],
      });
      confirm.present();
    } else{
    this.loading = true;
    console.log(" User Info", this.userInfo.USER_ID, this.userInfo.USER_SYS_ID);
    await this.SpineServiceProvider.getOrderListing(
      this.userInfo.USER_ID,
      this.userInfo.USER_SYS_ID,
      this.userInfo.TOKEN,
      this.userInfo.USER_REF,
      this.userInfo.USER_TYPE,
      this.menu_access_code,
      moment(this.fromDate).format("DD-MMM-YYYY"),
      moment(this.uptoDate).format("DD-MMM-YYYY")
    ).then((result) => {
      this.orders = JSON.parse(result["_body"]);
      console.log("Orders ", this.orders);
    });
    this.loading = false;
  }
  }
 async showStatus(orderID){
  let msj;
  let loading = this.loadingCtrl.create({
    content: 'Please wait...'
  });

  loading.present();
  this.SpineServiceProvider.GetOrderDetails(
    this.userInfo.USER_ID,
    this.userInfo.USER_SYS_ID,
    this.userInfo.TOKEN,
    this.userInfo.USER_REF,
    this.userInfo.USER_TYPE,
    this.menu_access_code,
    orderID
  ).then((result) => {
     msj = JSON.parse(result["_body"]);
    console.log("msj ", msj);
    let lpo = '';
    if (msj[0].LPO_NO != null) {
       lpo = "LPO No "+msj[0].LPO_NO+" Date "+msj[0].LPO_DATE;
    }
    loading.dismiss();
    const confirm = this.alertCtrl.create({
      title: "Order "+msj[0].ORDER_STATUS  ,
      message:lpo,
      buttons: [
        {
          text: "ok",
          handler: () => {
            //console.log("Agree clicked");
          },
        },
      ],
    });
    confirm.present();
  });

  }
  getPDF(){
    var logoBase64 = this.pdf.getLogoString();
    let logo   = '<img style="float: right;" src="'+ logoBase64 +'"/>'; 
    let customerInfo = this.userInfo.EBR_BRANCH_TITLE;
    let customerId =  " ID - "+ this.userInfo.EBR_CUST_ID; 
    document.addEventListener('deviceready', () => {
        cordova.plugins.pdf.htmlToPDF({
                data: "<html> <p> <b> Orders</b> "+logo+" </p> "+"<p> "+customerInfo +" </p> "+ "<p> "+customerId +" </p> "+"<p> From "+moment(this.fromDate).format("DD-MMM-YYYY") +" To "+moment(this.uptoDate).format("DD-MMM-YYYY") +"</p> "+this.pdfEl.nativeElement.innerHTML+" </html>",
                documentSize: "A4",
                landscape: "portrait",
                type: "base64"
            },
            (sucess) => {
              //console.log('sucess: ', sucess);
              this.pdf.saveAndOpenPdf(sucess,'Orders_From_'+moment(this.fromDate).format("DD-MMM-YYYY") +"_To_"+moment(this.uptoDate).format("DD-MMM-YYYY"));
            },
            (error) => console.log('error:', error));
    });
  }
}
