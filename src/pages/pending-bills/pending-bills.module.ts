import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PendingBillsPage } from './pending-bills';

@NgModule({
  declarations: [
    PendingBillsPage,
  ],
  imports: [
    IonicPageModule.forChild(PendingBillsPage),
  ],
})
export class PendingBillsPageModule {}
