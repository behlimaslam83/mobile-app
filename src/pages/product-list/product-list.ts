import { Component } from '@angular/core';
import { IonicPage ,LoadingController,NavController, NavParams } from 'ionic-angular';
import { Storage } from "@ionic/storage";
import { SpineServiceProvider } from '../../providers/spine-service/spine-service';
@IonicPage()
@Component({
  selector: 'page-product-list',
  templateUrl: 'product-list.html',
})
export class ProductListPage {
  userInfo: any;
  menu_access_code:string;
  
  constructor(
    public navCtrl: NavController,
     public navParams: NavParams,
     public SpineServiceProvider: SpineServiceProvider,
     private storage: Storage,
     public loadingCtrl: LoadingController) { this.storage.get("userInfo").then((val) => {
      this.userInfo = val;
      console.log("this.userInfo" +this.userInfo.USER_ID);
      this.menu_access_code = this.userInfo.menu_list.find(i => i.MENU_DESC === 'Stock Check').MENU_CODE;
      this.getProductList();
    });
  }
  productList :any;
  async getProductList (){
    let loading = this.loadingCtrl.create({
      content: 'Loading Products...'
    });
    loading.present();
    this.imagesPath=[];
    await this.SpineServiceProvider.getProductList(
      this.userInfo.USER_ID,
      this.userInfo.USER_SYS_ID,
      this.userInfo.TOKEN,
      this.userInfo.USER_REF,
      this.userInfo.USER_TYPE,
      this.menu_access_code
    ).then((result) => {
      let data = JSON.parse(result["_body"]);
       console.log("product List  ",data);
       this.productList = data;
    });
    loading.dismiss();
  }
  imagesPath:any=[];
  async getProductImages (ECI_CODE){
  
  let loading = this.loadingCtrl.create({
    content: 'Loading Gallery...'
  });
  loading.present();
    await this.SpineServiceProvider.getGalleryImgs(
      ECI_CODE,
      this.userInfo.USER_ID,
      this.userInfo.USER_SYS_ID,
      this.userInfo.TOKEN,
      this.userInfo.USER_REF,
      this.userInfo.USER_TYPE,
      this.menu_access_code
    ).then((result) => {
      let data = JSON.parse(result["_body"]);
      this.imagesPath = data;
       console.log("product images",data);
       
    });
   
    loading.dismiss();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductListPage');
  }
  backToProducts(){
    this.imagesPath=[];
  }
}
