import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AccountPage } from './account';
import { NegToPosPipe } from "../../pipes/neg-to-pos/neg-to-pos";


@NgModule({
  declarations: [
    AccountPage,
  ],
  imports: [
    IonicPageModule.forChild(AccountPage),
    NegToPosPipe
    
  ],
})
export class AccountPageModule {}
