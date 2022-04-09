import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ModalController,
  AlertController,
  Events
} from "ionic-angular";
import { Storage } from "@ionic/storage";
import { SearchPage } from "../search/search";
import { SpineServiceProvider } from "../../providers/spine-service/spine-service";
import { InAppBrowser } from "@ionic-native/in-app-browser";

interface search {
  width: string;
  height: string;
  qty: string;
  itemID: string;
  itemCode: string;
  newItemID:string;
  product:string;
  productDesc:string;
  productCode:string;
  status:string;
  sqmQty:string;
  itemWidth:string;
  check_based_on:string;
}
@IonicPage()
@Component({
  selector: "page-stock",
  templateUrl: "stock.html",
})
export class StockPage {
  width: string=null;
  height: string=null;
  qty: string=null;
  sqmQty:string=null;
  itemWidth:string=null;//from color search
  itemID: string;
  itemCode: string;
  imgPath: string;
  newItemID:string = null;
  productCode:string;
  productDesc:string;
  userInfo: any;
  menu_access_code:string;
  selectedProduct: any;
  stockcheckList: search[] = [];

  loading: boolean;
  sqmSegment:string = 'sqm';
  enableWhatsApp :boolean = false;
  salesmanInfo: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private storage: Storage,
    private modalCtrl: ModalController,
    private alertCtrl : AlertController,
    public SpineServiceProvider: SpineServiceProvider,
    private ev: Events,private iab: InAppBrowser,
  ) {
    this.storage.get("userInfo").then((val) => {
      this.userInfo = val;
      console.log("this.userInfo" +this.userInfo.USER_ID);
      this.menu_access_code = this.userInfo.menu_list.find(i => i.MENU_DESC === 'Stock Check').MENU_CODE;
      this.getProductList();
    });
    this.storage.get("salesmanPhone").then((val)=>{
      this.salesmanInfo = val;
    })
  }
  onInputData(value ,s){
    console.log("key , value ",value , s );
    if (!value) {
      if (s=='sqmQty') {
        this.sqmQty =null;
        console.log(' this.sqmQty '+ this.sqmQty);
      }
      if (s=='width') {
        this.width =null;
        console.log(' this.width '+ this.width);
      }
      if (s=='height') {
        this.height =null;
        console.log(' this.width '+ this.height);
      }
      if (s=='qty') {
        this.qty =null;
        console.log(' this.qty '+ this.qty);
      }
      
    }
    
    
  }
  ionViewDidLoad() {
    console.log("ionViewDidLoad StockPage");
    this.ev.publish("loggedIn", false);
  }
  ionViewWillLeave(){
    this.ev.publish("loggedIn", true);
  }
 product:any;
 productList :any;
 async getProductList (){
    this.loading = true;
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
    this.loading = false;
  }
  filteredProduct:any;
  selectProduct(){
    console.log(" product",this.product);
    this.filteredProduct = this.productList.filter(x => this.product.indexOf(x.ECI_DESC) !== -1);
     console.log("selectedProduct",this.filteredProduct);
     this.presentSearchModal();
  }

  onAdd() {
    let check_based_on;
    if (this.sqmSegment == "sqm") {
      check_based_on = 'SQM';
    } else {
      check_based_on = 'MEASUREMENTS';
    }
    if (this.width || this.height || this.qty || this.newItemID || this.sqmQty) {
      this.stockcheckList.push({
        width: this.width,
        height: this.height,
        qty: this.qty,
        itemID: this.itemID,
        itemCode: this.itemCode,
        newItemID:this.newItemID,
        product:this.product,
        productCode:this.productCode,
        productDesc:'',
        status:null,
        sqmQty:this.sqmQty,
        itemWidth:this.itemWidth,
        check_based_on:check_based_on
      });
      console.log(this.stockcheckList);
    }
    
    this.width = null;
    this.height = null;
    this.qty = null;
    this.itemID = null;
    this.imgPath = null;
    this.itemCode = null;
    this.newItemID=null;
    this.productCode = null ;
    this.sqmQty = null;
    this.itemWidth = null;
  }

  presentSearchModal() {
    let searchModal = this.modalCtrl.create(SearchPage,{filteredProduct:this.filteredProduct});
    searchModal.onDidDismiss((data) => {
      console.log("product", data.product);
try {
  
  this.selectedProduct = data.product;
  this.itemID = this.selectedProduct.ITEM_ID; //ITEM_IMAGE_PATH
  this.itemCode = this.selectedProduct.ITEM_CODE;
  this.imgPath = this.selectedProduct.ITEM_IMAGE_PATH;
  this.newItemID = this.selectedProduct.NEW_ITEM_ID;
  this.productCode = this.selectedProduct.ECM_ECI_CODE;
  this.itemWidth = this.selectedProduct.ITEM_WIDTH;
  this.checkItemSQM();
} catch (error) {
  console.log(error);
  
}

    });
    searchModal.present();
  }

  itemIds: any[];
  status: any[];
  pro: any[];
  resultArray: any[] = [];
  async stockCheck() {
    this.loading = true;
    // console.log(" User Info", this.userInfo.USER_ID, this.userInfo.USER_SYS_ID);
    await this.SpineServiceProvider.stockCheck(
      this.userInfo.USER_ID,
      this.userInfo.USER_SYS_ID,
      this.userInfo.TOKEN,
      this.userInfo.USER_REF,
      this.userInfo.USER_TYPE,
      this.menu_access_code,
      this.stockcheckList
    ).then((result) => {
      let data = JSON.parse(result["_body"]);
      let productResult = data.summary;
      this.itemIds = productResult.itemID;
      //converting possible numbers to string in array
      // for (let i = 0; i < this.itemIds.length; i++) {
      //   this.itemIds[i] = this.itemIds[i].toString();
      // }
      this.status = productResult.status;
      this.pro = productResult.product;
     console.log("this.itemIds ",this.itemIds);
     
      for (let i = 0; i< this.stockcheckList.length; i++) {
 
      //console.log( this.stockcheckList[i].newItemID,"-" ,this.itemIds.indexOf(this.stockcheckList[i].newItemID));
      //let colorStatusIndex = this.itemIds.indexOf(this.stockcheckList[i].newItemID);

         this.stockcheckList[i].status = this.status[i];
          this.stockcheckList[i].productDesc = this.pro[i];
      }
    });
    this.loading = false;
  }
   SendEnquiry() {
    let alert = this.alertCtrl.create({
      title: 'Send Enquiry ?',
      message: 'Do you want to send enquiry for below products?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Send',
          handler: () => {
            console.log('Buy clicked');
            this.sendEnquieryConfirm();
          }
        }
      ]
    });
    alert.present();

  }
 async sendEnquieryConfirm(){
    this.loading = true;
    // console.log(" User Info", this.userInfo.USER_ID, this.userInfo.USER_SYS_ID);
    await this.SpineServiceProvider.SendEnquiry(
      this.userInfo.USER_ID,
      this.userInfo.USER_SYS_ID,
      this.userInfo.TOKEN,
      this.userInfo.USER_REF,
      this.userInfo.USER_TYPE,
      this.menu_access_code,
      this.stockcheckList
    ).then((result) => {
      let data = JSON.parse(result["_body"]);
    // console.log(" Data : "+ data);
     //alert(data.status);
     if (data.status=='success') {
      this.showProduct('Success', '','Your request has been submitted successfully');
      let path = "https://api.whatsapp.com/send?phone=" + this.salesmanInfo +"&text="+data.whats_app_content;
      this.iab.create(path, "_system");
     }
     else{
       alert(data.status);
     }
     
     
    });
    this.loading = false;
  }
  clear(){
    this.stockcheckList = [];
    this.resultArray = [];
    
  }
  showProduct(color,product,status) {
    let alert = this.alertCtrl.create({
      title: color,
      subTitle: product,
      message:status,
      buttons: ['Ok']
    });
    alert.present();
  }
  segmentChanged(event){
    console.log(this.sqmSegment);
    if (this.sqmSegment == "sqm") {
      this.width = null;
      this.height = null;
      this.qty = null;
    } else if (this.sqmSegment == "qty") {
      this.sqmQty = null;
    }
   
  }
  qtyLabel:string='SQM';
  async checkItemSQM(){
    this.loading = true;
    // console.log(" User Info", this.userInfo.USER_ID, this.userInfo.USER_SYS_ID);
    await this.SpineServiceProvider.itemSQM(
      this.userInfo.USER_ID,
      this.userInfo.USER_SYS_ID,
      this.userInfo.TOKEN,
      this.userInfo.USER_REF,
      this.userInfo.USER_TYPE,
      this.menu_access_code,
      this.itemCode
    ).then((result) => {
      let data = JSON.parse(result["_body"]);
    // console.log(" Data : "+ data);
     //alert(data.status);
     console.log('SQM ',data[0]);

     if (data[0].SQM_YN=='Y') {
       this.qtyLabel = 'SQM'
     }else{
       this.qtyLabel = 'QTY' 
     }
    });
    this.loading = false;
  }
}
