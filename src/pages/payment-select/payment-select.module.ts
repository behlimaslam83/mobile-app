import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PaymentSelectPage } from './payment-select';

@NgModule({
  declarations: [
    PaymentSelectPage,
  ],
  imports: [
    IonicPageModule.forChild(PaymentSelectPage),
  ],
})
export class PaymentSelectPageModule {}
