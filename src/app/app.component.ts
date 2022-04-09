import { Component, ViewChild } from "@angular/core";
import {
  Platform,
  Nav,
  App,
  AlertController,
  Events,
} from "ionic-angular";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";

import { LoginPage } from "../pages/login/login";
import { HomePage } from "../pages/home/home";
import { Network } from "@ionic-native/network/ngx";
import { StockPage } from "../pages/stock/stock";
import { CreditPage } from "../pages/credit/credit";
import { AccountPage } from "../pages/account/account";
import { PendingBillsPage } from "../pages/pending-bills/pending-bills";
import { OrdersPage } from "../pages/orders/orders";
import { PaymentPage } from "../pages/payment/payment";
//import { Storage } from '@ionic/storage';
import { TranslateService } from "@ngx-translate/core";
import { InAppBrowser } from "@ionic-native/in-app-browser";
import { CallNumber } from "@ionic-native/call-number";
import { ProfilePage } from "../pages/profile/profile";
import { Storage } from "@ionic/storage";
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { ResultPage } from "../pages/result/result";
import { ManagerPage } from "../pages/manager/manager";
@Component({
  templateUrl: "app.html",
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any = LoginPage;
  branch: string = "";
  loggedIn: boolean = false;
  pages: Array<{
    title: string;
    component: any;
    id: any;
    script: string;
    logo: string;
    enable: boolean;
    menu_access_code:string;
  }> =[];
  salesmanInfo: any;
  isHideFooter:boolean = false;
  isUserAdmin:boolean = false;
  disableStockCheck:boolean = true;
  constructor(
    public platform: Platform,
    public network: Network,
    statusBar: StatusBar,
    public alertCtrl: AlertController,
    public app: App,
    splashScreen: SplashScreen,
    private iab: InAppBrowser,
    private callNumber: CallNumber,
    private storage: Storage,
    private ev: Events,
    public translate: TranslateService,
    private keyboard: Keyboard
  ) {
    platform.ready().then(() => {
      translate.setDefaultLang("en");
      this.storage.set("Language", "en");
      statusBar.styleDefault();
      splashScreen.hide();
      platform.registerBackButtonAction(() => {
        let navs = app.getActiveNavs()[0];
        let activeView = navs.getActive();
        if (activeView.name === "HomePage" || activeView.name === "LoginPage") {
          if (navs.canGoBack()) {
            //Can we go back?
            navs.pop();
          } else {
            const alert = this.alertCtrl.create({
              title: "Close App",
              message: "Do you want to exit?",
              buttons: [
                {
                  text: "Cancel",
                  role: "cancel",
                  handler: () => {
                    console.log("Application exit prevented!");
                  },
                },
                {
                  text: "Close App",
                  handler: () => {
                    this.platform.exitApp(); // Close this application
                  },
                },
              ],
            });
            alert.present();
          }
        }
      });
      try {
        
      
      this.keyboard.onKeyboardShow().subscribe(()=>{
        this.isHideFooter=true;
        console.log("isHideFooter ",this.isHideFooter);
        
      })
    
      this.keyboard.onKeyboardHide().subscribe(()=>{
        this.isHideFooter=false;
        console.log("isHideFooter ",this.isHideFooter);
      })
    } catch (error) {
        console.log("Key board ",error);
        
    }
    });
    this.ev.subscribe("branch", (name) => {
      this.branch = name;
      //console.log("Branch Event " + name);
    });
    this.ev.subscribe("loggedIn", (name) => {
      this.loggedIn = name;
      //console.log("loggedIn Event subscribe" + name);
      this.storage.get('userInfo').then(val=>{
        this.pages = [
          {
            title: "Dashboard",
            component: HomePage,
            id: 0,
            script: "PAGES.Home",
            logo: "apps",
            enable:true,
            menu_access_code:''
          },
          {
            title: "Orders",
            component: OrdersPage,
            id: 1,
            script: "PAGES.Orders",
            logo: "custom-orders",
            enable:false,
            menu_access_code:''
          },
          {
            title: "Stock Check",
            component: StockPage,
            id: 2,
            script: "PAGES.Stock Check",
            logo: "custom-stock",
            enable:false,
            menu_access_code:''
          },
          {
            title: "Credit Limit",
            component: CreditPage,
            id: 3,
            script: "PAGES.Credit Limit",
            logo: "custom-credit",
            enable:false,
            menu_access_code:''
          },
          {
            title: "Account Statement",
            component: AccountPage,
            id: 4,
            script: "PAGES.Account",
            logo: "custom-account",
            enable:false,
            menu_access_code:''
          },
          {
            title: "Outstanding Bills",
            component: PendingBillsPage,
            id: 5,
            script: "PAGES.Outstanding Bills",
            logo: "custom-outstanding",
            enable:false,
            menu_access_code:''
          },
          {
            title: "Make Payment",
            component: PaymentPage,
            id: 6,
            script: "PAGES.Make Payment",
            logo: "custom-payment",
            enable:false,
            menu_access_code:''
          },
          {
            title: "Manage Access",
            component: ManagerPage,
            id: 6,
            script: "PAGES.ManageAccess",
            logo: "person-add",
            enable:false,
            menu_access_code:''
          },
        ];
        // console.log("recved menu",val.menu_list );  
        // console.log("this.pages",this.pages);
        let menu = val.menu_list;
        
        for (let i = 0; i < menu.length; i++) {
          if (menu[i].MENU_DESC=='Stock Check') {
            this.disableStockCheck = false;
            console.log('disableStockCheck 1',this.disableStockCheck);
          }
          let objIndex = this.pages.findIndex((obj => obj.title == menu[i].MENU_DESC));
          if (objIndex > 0) {         
            console.log(menu[i].MENU_DESC , objIndex , this.pages[objIndex].title );
            this.pages[objIndex].enable = true;
            this.pages[objIndex].menu_access_code = menu[i].MENU_CODE;
          }          
        }
      });
    });
    this.ev.subscribe("salesmanInfo", (data) => {
      this.salesmanInfo = data;
      this.storage.set('salesmanPhone',this.salesmanInfo.SR_CELL_PHONE)
    });
  }
  logout() {
    this.loggedIn = false;
    this.disableStockCheck = true;
    this.storage.remove('userInfo');
    this.nav.setRoot(LoginPage);
  }
  openPage(page) {
    // console.log('page component'+page.component);
    if (page.title == 'Dashboard') {
      this.nav.setRoot(page.component, { page_id: page.id , menu_access_code:page.menu_access_code });
    }else{
      this.nav.push(page.component, { page_id: page.id , menu_access_code:page.menu_access_code });
    }
  }
  openStockCheck() {
    this.nav.push(StockPage);
  }
  openManager() {
    this.nav.push(ManagerPage);
  }
  ionViewDidEnter() {
    let connectSubscription = this.network.onConnect().subscribe(() => {
      console.log("network connected!");
      // We just got a connection but we need to wait briefly
      // before we determine the connection type. Might need to wait.
      // prior to doing any api requests as well.
      setTimeout(() => {
        if (this.network.type === "wifi") {
          console.log("we got a wifi connection, woohoo!");
        }
      }, 3000);
    });

    // stop connect watch
    connectSubscription.unsubscribe();

  }
  goToCall() {
    const confirm = this.alertCtrl.create({
      title: "Call Sales Consultant ?",
      message:
        "Mr. " +
        this.salesmanInfo.SR_FIRST_NAME +
        " " +
        this.salesmanInfo.SR_LAST_NAME +
        " will attend your call.",
      buttons: [
        {
          text: "Call",
          handler: () => {
            console.log("Disagree clicked");
            this.callNumber
              .callNumber(this.salesmanInfo.SR_CELL_PHONE, true)
              .then((res) => console.log("Launched dialer!", res))
              .catch((err) => console.log("Error launching dialer", err));
          },
        },
        {
          text: "Cancel",
          handler: () => {
            console.log("Agree clicked");
          },
        },
      ],
    });
    confirm.present();
  }
  goToChats() {
    let path =
      "https://api.whatsapp.com/send?phone=" + this.salesmanInfo.SR_CELL_PHONE;
    this.iab.create(path, "_system");
  }
  goToProfile(){
    this.nav.setRoot(ProfilePage);
  }
  goToContact(){
    this.nav.setRoot(ResultPage);
  }
  lang:string='';
  changeLanguage(){
    console.log("language",this.lang);
    this.translate.use(this.lang);
    this.storage.set("Language", this.lang);
    // this.storage.get("Language").then((val) => {
    //   var Language = val;
    //   console.log("Language", val);
    //   if (Language == "ar") {
    //     this.translate.use("en");
    //     this.storage.set("Language", "en");
    //   } else {
    //     this.translate.use("ar");
    //     this.storage.set("Language", "ar");
    //   }
    // });
  }
  
  
  openTwitter() {
    let path =   "https://twitter.com/sedarglobal?lang=en" ;
   this.iab.create(path,'_system');
  }
  
  openFacebook() {
    let path =   "https://www.facebook.com/Sedar.Global/" ;
  this.iab.create(path,'_system');
  }
  openInsta() {
    let path =   "https://www.instagram.com/sedarglobal/?hl=en" ;
   this.iab.create(path,'_system');
  }
}
