import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { SpineServiceProvider } from '../../providers/spine-service/spine-service';
import { Storage } from "@ionic/storage";
import moment from "moment";
@IonicPage()
@Component({
  selector: 'page-payment-collection',
  templateUrl: 'payment-collection.html',
})
export class PaymentCollectionPage {
  userInfo: any;
  BILL_CN_DESC: any;
  BILL_CT_DESC: any;
  BILL_ST_DESC: any;
  CUST_BILL_ADD1:any;
  CUST_BILL_ADD2:any;
  CUST_BILL_ADD3:any;
  CUST_BILL_ADD4:any;
  address:any;
  menu_access_code:string;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private alertCtrl: AlertController,
    public SpineServiceProvider: SpineServiceProvider,
    private storage: Storage,
    ) {
      this.storage.get("userInfo").then((val) => {
        this.userInfo = val;
        console.log("this.userInfo" +this.userInfo.USER_ID);
        this.menu_access_code = this.userInfo.menu_list.find(i => i.MENU_DESC === 'Make Payment').MENU_CODE;
       // console.log("PROFILE_DETAIL ",this.userInfo.PROFILE_DETAIL[0]);
        let data = this.userInfo.PROFILE_DETAIL[0];
        this.address =  this.removeNullAddress(data.CUST_BILL_ADD1) +
                        this.removeNullAddress(data.CUST_BILL_ADD2) +
                        this.removeNullAddress(data.CUST_BILL_ADD3) +
                        this.removeNullAddress(data.CUST_BILL_ADD4) +
                        data.BILL_CT_DESC +', '+
                        data.BILL_ST_DESC 
      });
  }
  removeNullAddress(add){
    if (add==null) {
      return ' ';
    }
    else{
      return add +' ' ;
    }

  }
  allowEdit:boolean=false;
  editAddress(allowEdit){
    if (allowEdit) {
      this.allowEdit = true;
      this.getCities();
    }
    else {
      this.allowEdit = false;
    }
  }
  newAddress:any=null;
  cities:any;
  ct_st_code:any;
  selectedCity:any=null;
  areas:any;
  selectedArea:any=null;
  async getCities(){
    this.loading = true;
    // console.log(" User Info", this.userInfo.USER_ID, this.userInfo.USER_SYS_ID);
    await this.SpineServiceProvider.getCities(
      this.userInfo.USER_ID,
      this.userInfo.USER_SYS_ID,
      this.userInfo.TOKEN,
      this.userInfo.USER_REF,
      this.userInfo.USER_TYPE,
      this.menu_access_code
    ).then((result) => {
      let data = JSON.parse(result["_body"]);
       console.log("cities ",data[0]);
       this.cities = data;
    });
    this.loading = false;
  }
  changeCity(ct_st_code,selectedCity){
    this.selectedCity  = selectedCity;
    console.log("city code", this.selectedCity);
    console.log("ct_st_code", ct_st_code);
    this.ct_st_code = ct_st_code;
    this.getAreaList(this.selectedCity);
  }
  selectArea(){
    console.log("selectedArea", this.selectedArea);
  }
  async getAreaList(city_code){
    this.loading = true;
    await this.SpineServiceProvider.GetAreaList(
      city_code,
      this.userInfo.USER_ID,
      this.userInfo.USER_SYS_ID,
      this.userInfo.TOKEN,
      this.userInfo.USER_REF,
      this.userInfo.USER_TYPE,
      this.menu_access_code
    ).then((result) => {
      let data = JSON.parse(result["_body"]);
       console.log("area ",data[0]);
       this.areas = data;
    });
    this.loading = false;
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad PaymentCollectionPage');
    this.minDate = new Date().toISOString();
  }
  collectionDate:any;
  minDate : any;
  selectPaymentMode(){
  }

  loading: boolean;
  remarks:any;
  
   // Cash Collection request 
 async  cashRequest(){
    console.log("collectionDate",this.collectionDate);
    
    if (this.newAddress==null) {
      this.newAddress = this.address;
      this.selectedCity = this.userInfo.PROFILE_DETAIL[0].CUST_BILL_CT_CODE;
      this.ct_st_code = this.userInfo.PROFILE_DETAIL[0].CUST_BILL_ST_CODE;
    }
    let mobile = this.userInfo.PROFILE_DETAIL[0].CUST_BILL_PHONE;

    this.loading = true;
    // console.log(" User Info", this.userInfo.USER_ID, this.userInfo.USER_SYS_ID);
    await this.SpineServiceProvider.requestPaymentCollection(
      moment(this.collectionDate).format("DD-MMM-YYYY"),
      this.ct_st_code,
      this.newAddress,
      this.selectedCity,
      this.selectedArea,
      this.remarks,
      mobile,
      this.userInfo.USER_ID,
      this.userInfo.USER_SYS_ID,
      this.userInfo.TOKEN,
      this.userInfo.USER_REF,
      this.userInfo.USER_TYPE,
      this.menu_access_code
    ).then((result) => {
      let data = JSON.parse(result["_body"]);
    
     // this.navCtrl.push(ResultPage,{result: this.resultArray});
       console.log("data ",data[0]);
    });
    this.loading = false;

    let alert = this.alertCtrl.create({
      title: 'Payment collection requested.',
      subTitle: 'Our team member will contact you.',
      buttons: ['ok']
    });
    alert.present();
  }

}
