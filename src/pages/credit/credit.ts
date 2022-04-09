import { Component, ElementRef, ViewChild } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { SpineServiceProvider } from "../../providers/spine-service/spine-service";
import { Storage } from '@ionic/storage';
import { Chart } from 'chart.js';
@IonicPage()
@Component({
  selector: "page-credit",
  templateUrl: "credit.html",
})
export class CreditPage {
  
  @ViewChild("doughnutCanvas") doughnutCanvas: ElementRef;
   doughnutChart: Chart;
  
  userInfo: any;
  loading: boolean;
  creditLimit:number;
  creditUtilized:number;
  total:number;
  menu_access_code:string;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public SpineServiceProvider: SpineServiceProvider,
    private storage: Storage
  ) {
    this.storage.get('userInfo').then(val=>{ 
     this.userInfo = val;
     this.menu_access_code = this.userInfo.menu_list.find(i => i.MENU_DESC === 'Credit Limit').MENU_CODE;

     this.getCreditLimit();
    });
    // this.userInfo = this.navParams.get("userInfo");
    
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad CreditPage");
  }

  async getCreditLimit() {
    this.loading = true;
    console.log(" User Info", this.userInfo.USER_ID, this.userInfo.USER_SYS_ID);
    await this.SpineServiceProvider.getCreditLimit(
      this.userInfo.USER_ID,
      this.userInfo.USER_SYS_ID,
      this.userInfo.TOKEN,
      this.userInfo.USER_REF,
      this.userInfo.USER_TYPE,
      this.menu_access_code,
    ).then((result) => {
      let creditData = JSON.parse(result["_body"]);
      //console.log("creditDate ", creditData[0]);
      this.creditLimit = creditData[0].CREDIT_LIMIT;
      this.creditUtilized = creditData[0].UTILIZED;
    });
    this.loading = false;
    this.total =  Number(this.creditLimit) - Number(this.creditUtilized);

    this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
      type: "pie",
      data: {
        labels: [  "Completed Transaction","Balance" ],
        datasets: [
          {
            label: "# of Votes",
            data: [ this.creditUtilized,this.total],
            backgroundColor: [
              "#1EBCF3",
              "#EEA417",
            ],
            hoverBackgroundColor: [ "#1EBCF3","#EEA417",]
          }
        ]
      },
      options: { 
        legend: {
            labels: {
                fontColor: "white",
                fontSize: 16,
                position:"right"
            },
            position: "right",
            align: "middle"
        },
    
    }
    });
    
  }
}
