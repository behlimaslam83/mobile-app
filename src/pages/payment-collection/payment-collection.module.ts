import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PaymentCollectionPage } from './payment-collection';

@NgModule({
  declarations: [
    PaymentCollectionPage,
  ],
  imports: [
    IonicPageModule.forChild(PaymentCollectionPage),
  ],
})
export class PaymentCollectionPageModule {}
