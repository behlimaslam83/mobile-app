import { AccountPage } from './../pages/account/account';
import { StockPage } from './../pages/stock/stock';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { SpineServiceProvider } from '../providers/spine-service/spine-service';
import { HttpModule } from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';

import { Network } from '@ionic-native/network/ngx';
//import { BrMaskerModule } from 'brmasker-ionic-3';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { PendingBillsPage } from '../pages/pending-bills/pending-bills';
import { CreditPage } from '../pages/credit/credit';
import { PaymentPage } from '../pages/payment/payment';
import { OrdersPage } from '../pages/orders/orders';
import { SearchPage } from '../pages/search/search';
import { ResultPage } from '../pages/result/result';
import { CallNumber } from '@ionic-native/call-number';
import { PipesModule } from '../pipes/pipes.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { MissingTranslationHandler, MissingTranslationHandlerParams } from '@ngx-translate/core';
import { PaymentSelectPage } from '../pages/payment-select/payment-select';
import { BankDetailsPage } from '../pages/bank-details/bank-details';
import { PaymentCollectionPage } from '../pages/payment-collection/payment-collection';
import { ProfilePage } from '../pages/profile/profile';
import { ForgotPasswordPage } from '../pages/forgot-password/forgot-password';
import { NgOtpInputModule } from  'ng-otp-input';
import { FileOpener } from '@ionic-native/file-opener';
import { File } from '@ionic-native/file';
import { PdfProvider } from '../providers/pdf/pdf';
import { ProductListPage } from '../pages/product-list/product-list';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { HTTP } from '@ionic-native/http';
import { ManagerPage } from '../pages/manager/manager';
import { AppVersion } from '@ionic-native/app-version';
import { Market } from '@ionic-native/market';
import {Ng2TelInputModule} from 'ng2-tel-input';
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export class MyMissingTranslationHandler implements MissingTranslationHandler {
  handle(params: MissingTranslationHandlerParams) {
    return 'Call Support Team..';
  }
}
@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    StockPage,
    CreditPage,
    AccountPage,
    PendingBillsPage,
    PaymentPage,
    OrdersPage,
    SearchPage,
    ResultPage,
    PaymentSelectPage,
    BankDetailsPage,
    PaymentCollectionPage,
    ProfilePage,
    ForgotPasswordPage,
    ProductListPage,
    ManagerPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    HttpModule,
    PipesModule,
    NgOtpInputModule,
    //BrMaskerModule
    HttpClientModule,
    Ng2TelInputModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
      missingTranslationHandler: { provide: MissingTranslationHandler, useClass: MyMissingTranslationHandler }
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    StockPage,
    CreditPage,
    AccountPage,
    PendingBillsPage,
    PaymentPage,
    OrdersPage,
    SearchPage,
    ResultPage,
    PaymentSelectPage,
    BankDetailsPage,
    PaymentCollectionPage,
    ProfilePage,
    ForgotPasswordPage,
    ProductListPage,
    ManagerPage
  ],
  providers: [
    StatusBar,
    SplashScreen, Network,
    BluetoothSerial, InAppBrowser,CallNumber,FileOpener,File,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    SpineServiceProvider,
    PdfProvider,Keyboard,HTTP,
    AppVersion,
    Market
  ]
})
export class AppModule { }
