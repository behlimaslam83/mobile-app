import { Component ,ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController} from 'ionic-angular';
import { SpineServiceProvider } from '../../providers/spine-service/spine-service';
import { Storage } from '@ionic/storage';
import { PaymentPage } from '../payment/payment';
import { PdfProvider } from "../../providers/pdf/pdf";
import moment from 'moment';
declare var cordova:any;
@IonicPage()
@Component({
  selector: 'page-pending-bills',
  templateUrl: 'pending-bills.html',
})

export class PendingBillsPage {
  @ViewChild("pdfEl") pdfEl;
  userInfo: any;
  pendingBills:any[];
  loading:boolean ;
  menu_access_code:string;
  constructor(public navCtrl: NavController,
     public navParams: NavParams,
     public SpineServiceProvider: SpineServiceProvider,
     private storage: Storage,
     private pdf : PdfProvider,
     private alertCtrl : AlertController
     ) {
      this.storage.get('userInfo').then(val=>{ 
        this.userInfo = val;
        this.menu_access_code = this.userInfo.menu_list.find(i => i.MENU_DESC === 'Outstanding Bills').MENU_CODE;
        this.getPendingBills();
       });
     // this.userInfo = this.navParams.get('userInfo');
      
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PendingBillsPage');
  }
  total:number = 0;
  valueLabel:any;
  async getPendingBills(){
    this.loading=true;
    console.log(" User Info", this.userInfo.USER_ID,this.userInfo.USER_SYS_ID);
   await this.SpineServiceProvider.getPendingBills(
     this.userInfo.USER_ID,
     this.userInfo.USER_SYS_ID,
     this.userInfo.TOKEN,
     this.userInfo.USER_REF,
     this.userInfo.USER_TYPE,
     this.menu_access_code
     ).then((result)=>{
      this.pendingBills = JSON.parse(result['_body']);
      this.pendingBills.reverse();
      //console.log('Orders ',this.pendingBills );
      for (let i = 0; i < this.pendingBills.length; i++) {
        const e = this.pendingBills[i];
        if(e.VL_DC_FLAG == 'Cr'){
          this.total = this.total - Number(e.PENDING_AMOUNT);
        }else {
          this.total = this.total + Number(e.PENDING_AMOUNT);
        }
      }
      console.log("Total " + this.total);
      if (this.total > 0 ) {
        this.valueLabel = ' Dr'
      }else{
        this.total=Math.abs(this.total);
        this.valueLabel = ' Cr'
      }
    });
    this.loading=false;
  }

  invoiceData:any[]=[];
  selectInvoice(pb,isChecked: boolean){
    console.log("pb ", pb , isChecked);
    
    if (isChecked == true) {
     this.invoiceData.push({
       'IH_TXN_DT':pb.DATED,
       'IH_CUST_AC_DESC':this.userInfo.EBR_BRANCH_TITLE,
       'IH_TXN_NO':pb.VOUCHER_NO,
       'IH_NET_VALUE':pb.PENDING_AMOUNT,
       'IH_SYS_ID':pb.IH_SYS_ID
      });
    }
    else {
      let index = this.invoiceData.findIndex(d => d.IH_TXN_NO === pb.IH_TXN_NO); //find index in your array
      this.invoiceData.splice(index, 1);//remove element from array
    }
    console.log("invoice Data "+this.invoiceData);
    
  }

  goToPayment(){
    this.navCtrl.push(PaymentPage,{invoiceData:this.invoiceData});
  }
  today:any = moment().format("DD/MMM/YYYY");
  getPDF(){
    var logoBase64 = this.pdf.getLogoString();
    let logo   = '<img style="float: right;" src="'+ logoBase64 +'"/>'; 
    let customerInfo = this.userInfo.EBR_BRANCH_TITLE;
    let customerId =  " ID - "+ this.userInfo.EBR_CUST_ID; 
    document.addEventListener('deviceready', () => {
        cordova.plugins.pdf.htmlToPDF({
                data: '<html> <p> <b> Outstanding Bills</b> '+logo+'</p> '+'<p> '+customerInfo +' </p> '+ '<p> '+customerId +' </p>'+'<p> As On Date '+this.today +'</p>'+this.pdfEl.nativeElement.innerHTML+' </html>',
                documentSize: "A4",
                landscape: "portrait",
                type: "base64"
            },
            (sucess) => {
              //console.log('sucess: ', sucess);
              this.pdf.saveAndOpenPdf(sucess,'OutStanding Bills');
            },
            (error) => console.log('error:', error));
    });
  }
  invoiceInfo:any;
 async getInvoiceDetails(invoice){
 // this.loading=true;
 try {
  await this.SpineServiceProvider.invoiceRefDetails(
    invoice.substring(3),
    this.userInfo.USER_ID,
    this.userInfo.USER_SYS_ID,
    this.userInfo.TOKEN,
    this.userInfo.USER_REF,
    this.userInfo.USER_TYPE,
    this.menu_access_code
    ).then((result)=>{
    this.invoiceInfo = JSON.parse(result['_body']);
     console.log("invoiceInfo "+ this.invoiceInfo );
     // console.log("this.invoiceInfo[0] "+ this.invoiceInfo[0] );
     // console.log("this.invoiceInfo.doc "+ this.invoiceInfo.doc );
     let lpo  = this.invoiceInfo[0].LPO_NO;
     let lpoDate = this.invoiceInfo[0].LPO_DATE;
     if (this.invoiceInfo[0].LPO_NO == null) {
      
      const confirm = this.alertCtrl.create({
       title: "LPO not received or uploaded",
       message: "",
       buttons: [
         {
           text: "OK",
           handler: () => {
             console.log("ok clicked");
           },
         }
       ],
     });
     confirm.present();
     }
     else {
       this.lpoAlert(lpo,lpoDate);
     }
   });
 } catch (error) {
   console.log(error);
 }

    //this.loading=false;
  }
  lpoAlert(lpo,lpoDate){
    const confirm = this.alertCtrl.create({
      title: "LPO No : "+lpo,
      message: "LPO Date : "+lpoDate,
      buttons: [
        {
          text: "OK",
          handler: () => {
            console.log("ok clicked");
          },
        },
        {
          text: "View Doc",
          handler: () => {
            console.log("View Doc clicked " + this.invoiceInfo.doc[0].CPODOC_FILE_NAME);
            this.viewDoc(this.invoiceInfo.doc[0].CPODOC_FILE_NAME);
            ;
          },
        }
      ],
    });
    confirm.present();
    
  }
 async viewDoc(filePath){
    await this.SpineServiceProvider.viewDoc(
      filePath,
      this.userInfo.USER_ID,
      this.userInfo.USER_SYS_ID,
      this.userInfo.TOKEN,
      this.userInfo.USER_REF,
      this.userInfo.USER_TYPE,
      this.menu_access_code).then((result)=>{
      let doc = JSON.parse(result['_body']);
       console.log("doc ", doc.IMAGE_PATH);
       this.pdf.saveAndOpenPdf(doc.IMAGE_PATH,'LPO Details');
     });
  }
}
