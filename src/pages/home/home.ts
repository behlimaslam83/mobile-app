import { Component, Directive } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController,
  Events,
} from "ionic-angular";
import { LoginPage } from "../login/login";
import { SpineServiceProvider } from "../../providers/spine-service/spine-service";
import { FormBuilder, FormGroup } from "@angular/forms";
import { OrdersPage } from "../orders/orders";
import { StockPage } from "../stock/stock";
import { CreditPage } from "../credit/credit";
import { AccountPage } from "../account/account";
import { PaymentPage } from "../payment/payment";
import { PendingBillsPage } from "../pending-bills/pending-bills";
import { Storage } from '@ionic/storage';
import { ProductListPage } from "../product-list/product-list";

@IonicPage()
@Component({
  selector: "page-home",
  templateUrl: "home.html",
})
@Directive({
  selector: "[credit-card]",
})
export class HomePage {
  public form: FormGroup;
  page_id: any;
  userInfo: any;
  salesmanInfo: any;
  loading: boolean = false;
  branch:string ='';
  language='';
  disableOrders:boolean = true;
  disableStockCheck:boolean = true;
  disableCreditLimit:boolean = true;
  disableAccounts:boolean = true;
  disableOutstanding:boolean = true;
  disablePayment:boolean = true;
  disableGallery:boolean = true;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public fb: FormBuilder,
    public SpineServiceProvider: SpineServiceProvider,
    public loadingCtrl: LoadingController,
    private storage: Storage,
    private ev: Events
  ) 

  {
    this.storage.get('userInfo').then(val=>{ 
      this.userInfo = val;
      this.branch = this.userInfo.EBR_BRANCH_TITLE;
      let menu = val.menu_list;
      menu.forEach(element => {
       // console.log("element ",element);
                
        if (element.MENU_DESC=='Orders') {
          this.disableOrders = false;
        }
        if (element.MENU_DESC=='Stock Check') {
          this.disableStockCheck = false;
        }
        if (element.MENU_DESC=='Credit Limit') {
          this.disableCreditLimit = false;
        }
        if (element.MENU_DESC=='Account Statement') {
          this.disableAccounts = false;
        }
        if (element.MENU_DESC=='Outstanding Bills') {
          this.disableOutstanding = false;
        }
        if (element.MENU_DESC=='Make Payment') {
          this.disablePayment = false;
        }
        if (element.MENU_DESC=='Gallery') {
          this.disableGallery = false;
        }
      });
      this.getSalesManInfo();
     });
    this.storage.get('Language').then(val=>{ 
      this.language= val;
     });
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad HomePage');
  }
  goToOrders() {
    this.navCtrl.push(OrdersPage);
  }
  goToStock() {
    this.navCtrl.push(StockPage);
  }
  goToCredit() {
    this.navCtrl.push(CreditPage);
  }
  goToAccount() {
    this.navCtrl.push(AccountPage);
  }
  goToPendingBills() {
    this.navCtrl.push(PendingBillsPage);
  }
  goToPayment() {
    this.navCtrl.push(PaymentPage);
  }
 
  async getSalesManInfo() {
   // this.loading = true;
    let loading = this.loadingCtrl.create({
      content: 'Loading menu...'
    });
  
    loading.present();
    await this.SpineServiceProvider.getSalesmanInfo(
      this.userInfo.USER_ID,
      this.userInfo.USER_SYS_ID,
      this.userInfo.TOKEN,
      this.userInfo.USER_REF,
      this.userInfo.USER_TYPE
    ).then((result) => {
      let data = JSON.parse(result["_body"]);
      this.salesmanInfo = data[0];
      this.ev.publish('salesmanInfo', this.salesmanInfo);
      //console.log("salesManInfo", data);
    });
   // this.loading = false;
    loading.dismiss();
  }
  async goToProductList() {
    this.navCtrl.push(ProductListPage);
  }
  logout() {
    this.ev.publish('loggedIn', false);
    this.navCtrl.setRoot(LoginPage);
  }
}
