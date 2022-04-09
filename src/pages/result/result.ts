import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-result',
  templateUrl: 'result.html',
})
export class ResultPage {
  resultArray:any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  this.resultArray = this.navParams.get('result');
    console.log("resultArray "+this.resultArray);
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ResultPage');
  }

}
