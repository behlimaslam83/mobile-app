import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SpineServiceProvider } from '../../providers/spine-service/spine-service';
import { Storage } from "@ionic/storage";


@IonicPage()
@Component({
  selector: 'page-bank-details',
  templateUrl: 'bank-details.html',
})
export class BankDetailsPage {
  userInfo:any;
  menu_access_code:string;
  constructor(public navCtrl: NavController,
     public navParams: NavParams,
     public SpineServiceProvider: SpineServiceProvider,
     private storage: Storage,) {
      this.storage.get("userInfo").then((val) => {
        this.userInfo = val;
        this.menu_access_code = this.userInfo.menu_list.find(i => i.MENU_DESC === 'Make Payment').MENU_CODE;
        this.getBankDetails();
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BankDetailsPage');
  }
  loading: boolean;
  bankData:any =null;
  async getBankDetails(){
    this.loading = true;
    // console.log(" User Info", this.userInfo.USER_ID, this.userInfo.USER_SYS_ID);
    await this.SpineServiceProvider.getBankDetails(
      this.userInfo.USER_ID,
      this.userInfo.USER_SYS_ID,
      this.userInfo.TOKEN,
      this.userInfo.USER_REF,
      this.userInfo.USER_TYPE,
      this.menu_access_code,
    ).then((result) => {
      let data = JSON.parse(result["_body"]);
     
     this.bankData = data[0];
       console.log("bankDetails ",data);
    });
    this.loading = false;
    }
  
}
