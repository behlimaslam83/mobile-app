import { Component, ViewChild } from "@angular/core";
import { AlertController, IonicPage, NavController, NavParams } from "ionic-angular";
import { SpineServiceProvider } from "../../providers/spine-service/spine-service";
import moment from "moment";
import { Storage } from '@ionic/storage';
import { PdfProvider } from "../../providers/pdf/pdf";
declare var cordova:any;
@IonicPage()
@Component({
  selector: "page-account",
  templateUrl: "account.html",
})
export class AccountPage {
  @ViewChild("pdfEl") pdfEl;
  userInfo: any;
  loading: boolean;
  accountStatement: any;
  //date = new Date();
  //Dates
  uptoDate: any = new Date().toISOString(); //moment();
  fromDate: any = new Date(new Date().setDate(1)).toISOString() ;//moment().startOf('month').format("DD-MMM-YYYY");
  today:any = new Date().toISOString();// new Date(new Date().setFullYear(new Date().getFullYear()+ 2)).toISOString();
  
  acStatement:any;
  menu_access_code:string;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public SpineServiceProvider: SpineServiceProvider,
    private storage: Storage,
    private pdf : PdfProvider,
    private alertCtrl: AlertController
    
  ) {
    this.menu_access_code = this.navParams.get('menu_access_code');
    this.storage.get('userInfo').then(val=>{
      // console.log("val",val );  
     this.userInfo = val;
     this.menu_access_code = this.userInfo.menu_list.find(i => i.MENU_DESC === 'Account Statement').MENU_CODE;
     this.getAccountStatement();
    });
    
     //this.userInfo = this.navParams.get("userInfo");
  }
  ionViewDidLoad() {
  }

  async getAccountStatement() {
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
    await this.SpineServiceProvider.getAccountStatement(
      this.userInfo.USER_ID,
      this.userInfo.USER_SYS_ID,
      this.userInfo.TOKEN,
      this.userInfo.USER_REF,
      this.userInfo.USER_TYPE,
      this.menu_access_code,
      moment(this.fromDate).format("DD-MMM-YYYY"),
      moment(this.uptoDate).format("DD-MMM-YYYY")
    ).then((result) => {
      this.acStatement = JSON.parse(result["_body"]);
      console.log("AccountStatementLength", this.acStatement.length);
    });
    this.loading = false;

  let mainBalance : number;
    for (let i = 0; i < this.acStatement.length; i++) {
      const e = this.acStatement[i];
      if (i == 0) {
        mainBalance = Number(e.BALANCE) // this.acStatement[0]
      }else { 
        if(Number(e.DEBIT) > 0 ){
          e.BALANCE = mainBalance - Number(e.DEBIT);
          mainBalance = e.BALANCE;
        }
        else if(Number(e.CREDIT) > 0 ){
          e.BALANCE = mainBalance + Number(e.CREDIT);
          mainBalance = e.BALANCE;
        }

      }

      //console.log("Debit ", this.acStatement[i].DEBIT, "Credit ", this.acStatement[i].CREDIT , "Balance ", this.acStatement[i].BALANCE);

    }
    console.log("AccountStatementData ", this.acStatement);
    }
  }
  isNegitive(val: number): boolean {
    if (val < 0) {
     return true;
    } else {
     return false
    }
   }
   getPDF(){
    document.addEventListener('deviceready', () => {
    var logoBase64 = this.pdf.getLogoString();
    let logo   = '<img style="float: right;" src="'+ logoBase64 +'"/>'; 
    let customerInfo = this.userInfo.EBR_BRANCH_TITLE;
    let customerId =  " ID - "+ this.userInfo.EBR_CUST_ID;   
        cordova.plugins.pdf.htmlToPDF({
                data: "<html> <p> <b> Statement of account </b>"+logo+" </p> "+"<p> "+customerInfo +" </p> "+ "<p> "+customerId +" </p> "+"  <p> From "+moment(this.fromDate).format("DD-MMM-YYYY") +" To "+moment(this.uptoDate).format("DD-MMM-YYYY") +"</p> "+this.pdfEl.nativeElement.innerHTML+" </html>",
                documentSize: "A4",
                landscape: "portrait",
                type: "base64"
            },
            (sucess) => {
              //console.log('sucess: ', sucess);
              this.pdf.saveAndOpenPdf(sucess,'Statement Of Account');
            },
            (error) => console.log('error:', error));
    });
  }
}
