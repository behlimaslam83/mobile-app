import { Component} from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController,
  AlertController,
  ToastController,
  Events,
  MenuController,
  Platform,
} from "ionic-angular";
import { HomePage } from "../home/home";
import { SpineServiceProvider } from "../../providers/spine-service/spine-service";
import { Storage } from "@ionic/storage";
import { TranslateService } from "@ngx-translate/core";
import { ForgotPasswordPage } from "../forgot-password/forgot-password";
import { InAppBrowser } from "@ionic-native/in-app-browser";
import { AppVersion } from '@ionic-native/app-version';
import { Market } from "@ionic-native/market";

@IonicPage()
@Component({
  selector: "page-login",
  templateUrl: "login.html",
})
export class LoginPage {
  user_id: any ; //'rafeeq.mohamed@sedarglobal.com';"test.dealerksa@test.com"
  user_password: any ; //'rafeeq.mohamed';
  user_details: any;
  loading: boolean = false;
  language: string='';
  savePassword:boolean = true;
  updateMsg: boolean = false;
  constructor(
    public navCtrl: NavController,

    public navParams: NavParams,
    public toast: ToastController,
    public SpineServiceProvider: SpineServiceProvider,
    public loadingCtrl: LoadingController,
    private storage: Storage,
    private alertCtrl: AlertController,
    private ev: Events,
    public menuCtrl: MenuController,
    public translate: TranslateService,
    private iab: InAppBrowser,
    private appVersion: AppVersion,
    private market: Market,
    private platform: Platform
  ) {
    this.menuCtrl.enable(false);
    this.storage.get("user_id").then((val) => {
      if (val != null) {
        this.user_id = val;
      }
    });
    this.storage.get("user_password").then((val) => {
      if (val != null) {
        this.user_password = val;
      }
    });
  }

  ionViewDidLoad() {
    this.platform.ready().then(()=>{
      if (this.platform.is('cordova')) {
        this.checkInstalledVersion();
      }else{
        console.log("Running on browser");
      }
    });
  }

  ionViewWillEnter() {
    this.storage.get("Language").then((val) => {
      var Language = val;
      console.log("Language", val);
      if (Language == "ar") {
        this.language = "ar";
        this.translate.use("ar");
      }
      if (Language == "ur") {
        this.language = "ur";
        this.translate.use("ur");
      }
      if (Language == "en") {
        this.language = "en";
        this.translate.use("en");
      }
    });
  }
  async login() {
    let data: any;
    this.loading = true;
    await this.SpineServiceProvider.login(
      this.user_id,
      this.user_password
    ).then((result) => {
      data = JSON.parse(result["_body"]);
      //console.log("Result", data);
    });

    if (data.status == "success") {
      this.storage.set("userInfo", data.result.USER_DETAILS).then(() => {
        this.navCtrl.setRoot(HomePage, { userInfo: data.result.USER_DETAILS });
        this.menuCtrl.enable(true);
        this.ev.publish("branch", data.result.USER_DETAILS.EBR_BRANCH_TITLE);
        this.ev.publish("loggedIn", true);
      });
      // if savePassword true then store user id and password
      if (this.savePassword) {
        this.storage.set("user_id",this.user_id);
        this.storage.set("user_password",this.user_password);
      }else {
        this.storage.set("user_id",null);
        this.storage.set("user_password",null);
      }
    }
    else {
      const confirm = this.alertCtrl.create({
        title: data.status ,
        message:data.msg,
        buttons: [
          {
            text: "Cancel",
            handler: () => {
              //console.log("Agree clicked");
            },
          },
        ],
      });
      confirm.present();
    }
    this.loading = false;
  }
  chooseLanguage() {
    console.log("language",this.language);
      this.translate.use(this.language);
      this.storage.set("Language", this.language);
  }
  forgotPassword(){
    this.navCtrl.push(ForgotPasswordPage);
  }
  signUp(){
    this.iab.create("https://www.sedarglobal.com/register/btob", "_system");
    //this.iab.create('http://test.sedarglobal.com/register/btob','_system');
  }
  async checkInstalledVersion() {
    let appCurrentVersion;
    try {
      this.appVersion.getVersionNumber().then(data=>{
        appCurrentVersion = data;
        console.log("Installed Version "+ data);
        this.getServerVersion(appCurrentVersion);
      });

    } catch (error) {
      console.log("error "+error);
    }
  }

 async getServerVersion(appCurrentVersion){
    let data;
    await this.SpineServiceProvider.checkVersion(appCurrentVersion).then(
      (result) => {
        data = JSON.parse(result["_body"]);
        console.log("server version ", data.result);
      }
    );

    if (data.result.length > 0) {
      if (data.result[0].APP_LIVE_VERSION != appCurrentVersion) {
        this.showAlert(
          "New Update Available",
          "version " + data.result[0].APP_LIVE_VERSION,
          "Update Now"
        );
      }
    }
  }

  showAlert(title, message, btnMsg) {
    const confirm = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [
        {
          text: btnMsg,
          handler: () => {
            this.openNativeStore();
          },
        },
      ],
    });
    confirm.present();
  }
  openNativeStore() {
    let appId;

    if (this.platform.is("android")) {
      appId = "com.sedarglobal.dealer";
    } else {
      appId = "id1549380937";
    }

    this.market.open(appId).then((response) => {
        console.debug(response);
      })
      .catch((error) => {
        console.warn(error);
      });
  }
}
