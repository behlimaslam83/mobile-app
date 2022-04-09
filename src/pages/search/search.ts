import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { SpineServiceProvider } from "../../providers/spine-service/spine-service";

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {
  @ViewChild('input') myInput ;
  userInfo:any;
  loading:boolean;
  products:any;
  filteredProduct:any=[];
  menu_access_code:string;
  constructor(public navCtrl: NavController,
     public navParams: NavParams,
     private storage: Storage,
     public viewCtrl: ViewController,
     public SpineServiceProvider: SpineServiceProvider) {
      this.storage.get('userInfo').then(val=>{ 
        this.userInfo = val;
        this.menu_access_code = this.userInfo.menu_list.find(i => i.MENU_DESC === 'Stock Check').MENU_CODE;
       });
  
   if (this.navParams.get('filteredProduct')) {
    this.filteredProduct = this.navParams.get('filteredProduct');
   }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchPage');
    setTimeout(() => {
      this.myInput.setFocus();
    },1000);
  }
searchData:string='';
trim(value){
this.searchData = value.replace(/\s/g, "");
//console.log(this.searchData);
}
async  search(){
 // console.log("searchData " + searchData);
  let ECI_CODE;
  let ECI_DESC;
  if(this.filteredProduct.length){
    ECI_CODE= this.filteredProduct[0].ECI_CODE,
    ECI_DESC= this.filteredProduct[0].ECI_DESC
  }
  else {
     ECI_CODE ='';
     ECI_DESC ='';
  }
    this.loading = true;
   // console.log(" User Info", this.userInfo.USER_ID, this.userInfo.USER_SYS_ID);
    await this.SpineServiceProvider.searchProduct (
      this.userInfo.USER_ID,
      this.userInfo.USER_SYS_ID,
      this.userInfo.TOKEN,
      this.userInfo.USER_REF,
      this.userInfo.USER_TYPE,
      this.menu_access_code,
      this.searchData,
      ECI_CODE,
      ECI_DESC,
    ).then((result) => {
      this.products = JSON.parse(result["_body"]);
      console.log("Products ", this.products);
    });
    this.loading = false;
  }
  onSelect(p){
    //console.log('selected ', p);
    let data = { 'product':p};
    this.viewCtrl.dismiss(data);
  }
  dismiss() {
    let data = { 'product':null};
    this.viewCtrl.dismiss(data);
  }
}
