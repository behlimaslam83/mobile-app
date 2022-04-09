import { Component ,ViewChild} from '@angular/core';
import { IonicPage, NavController, AlertController,NavParams } from 'ionic-angular';
import { SpineServiceProvider } from '../../providers/spine-service/spine-service';
import { LoginPage } from '../login/login';

@IonicPage()
@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html',
})
export class ForgotPasswordPage {
  otp: string;
  @ViewChild('ngOtpInput') ngOtpInput: any;
  config = {
    allowNumbersOnly: false,
    length: 6,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
    inputStyles: {
      'width': '40px',
      'height': '40px'
    }
  };
  showOtpComponent = false;
  loading=false;
  constructor(public navCtrl: NavController, 
    public SpineServiceProvider: SpineServiceProvider,
    private alertCtrl: AlertController,
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgotPasswordPage');
  }
  onOtpChange(otp) {
    this.otp = otp;
    console.log("OTP" + this.otp);
    if (this.otp.length == 6) {
      this.submitOTP();
    }    
  }

  setVal(val) {
    this.ngOtpInput.setValue(val);
  }

  email:string;
 async validateEmail(){
   this.loading =true;
  await this.SpineServiceProvider.validateEmail(
  this.email,
  'email',
  ''
  ).then((result) => {
  let   data = JSON.parse(result["_body"]);
    console.log("validateEmail", data);
    this.loading =false;
    //alert
    const confirm = this.alertCtrl.create({
      title: data.status,
      message: data.msg ,
      buttons: [
        {
          text: "OK",
          handler: () => {
            console.log("Agree clicked");
          },
        },
      ],
    });
    confirm.present()
    //if success show OTP
    if (data.status =='success') {
      this.showOtpComponent = true;
    }
  });
 
  }
 
  otpValid= false;
 async submitOTP(){
   this.loading = true;
  await this.SpineServiceProvider.validateOTP(
    this.email,
    this.otp,
    'email',
    '',
    ''
    ).then((result) => {
    let   data = JSON.parse(result["_body"]);
      console.log("submitOTP", data);
      this.loading = false;
      //alert
      const confirm = this.alertCtrl.create({
        title: data.status,
        message: data.msg ,
        buttons: [
          {
            text: "OK",
            handler: () => {
              console.log("Agree clicked");
            },
          },
        ],
      });
      confirm.present();
      if (data.status =='success') {
        this.otpValid = true;
        this.toggleDisable();
      }else if (data.status !=='success') {
        this.setVal('');
      }
    });
  }
 
  toggleDisable(){
    if(this.ngOtpInput.otpForm){
      if(this.ngOtpInput.otpForm.disabled){
        this.ngOtpInput.otpForm.enable();
      }else{
        this.ngOtpInput.otpForm.disable();
      }
    }
  }
  password:any;
  async resetPassword(){
    this.loading = true;
    await this.SpineServiceProvider.resetPassword(
      this.email,
      this.otp,
      this.password,
      'email',
      '',
      ''
      ).then((result) => {
      let   data = JSON.parse(result["_body"]);
        console.log("submitOTP", data);
        this.loading = false;
        //alert
        const confirm = this.alertCtrl.create({
          title: data.status,
          message: data.msg ,
          buttons: [
            {
              text: "OK",
              handler: () => {
                console.log("Agree clicked");
              },
            },
          ],
        });
        confirm.present();
        if (data.status =='success') {
          this.navCtrl.setRoot(LoginPage);
        }
      });
    }

  showMobileOtpComponent = false;
  requestId:any;
  otpMobileValid =false;
  async validateMobile(){
    this.loading =true;
   await this.SpineServiceProvider.validateEmail(
   '',
   'mobile',
   this.mobileNumber
   ).then((result) => {
   let   data = JSON.parse(result["_body"]);
     console.log("validate mobile", data);
     this.loading =false;
     //alert
     const confirm = this.alertCtrl.create({
       title: data.status,
       message: data.msg ,
       buttons: [
         {
           text: "OK",
           handler: () => {
             console.log("Agree clicked");
           },
         },
       ],
     });
     confirm.present()
     //if success show OTP
     if (data.status =='success') {
       this.showMobileOtpComponent = true;
       this.requestId = data.result.requestId;
     }
   });
  
   }
    onMobileOtpChange(otp) {
      this.otp = otp;
      console.log("OTP" + this.otp);
      if (this.otp.length == 6) {
        this.submitMobileOTP(otp);
      }    
    }
    async submitMobileOTP(otp){
      this.loading = true;
     await this.SpineServiceProvider.validateOTP(
       '',
       otp,
       'mobile',
       this.mobileNumber,
       this.requestId
       ).then((result) => {
       let   data = JSON.parse(result["_body"]);
         console.log("submitOTP", data);
         this.loading = false;
         //alert
         const confirm = this.alertCtrl.create({
           title: data.status,
           message: data.msg ,
           buttons: [
             {
               text: "OK",
               handler: () => {
                 console.log("Agree clicked");
               },
             },
           ],
         });
         confirm.present();
         if (data.status =='success') {
           this.otpMobileValid = true;
           //this.toggleDisable();
         }else if (data.status !=='success') {
           this.setVal('');
         }
       });
     }
     async resetMobilePassword(){
      this.loading = true;
      await this.SpineServiceProvider.resetPassword(
        '',
        this.otp,
        this.password,
        'mobile',
        this.mobileNumber,
        this.requestId
        ).then((result) => {
        let   data = JSON.parse(result["_body"]);
          console.log("submitOTP", data);
          this.loading = false;
          //alert
          const confirm = this.alertCtrl.create({
            title: data.status,
            message: data.msg ,
            buttons: [
              {
                text: "OK",
                handler: () => {
                  console.log("Agree clicked");
                },
              },
            ],
          });
          confirm.present();
          if (data.status =='success') {
            this.navCtrl.setRoot(LoginPage);
          }
        });
      }
    telInputObject(obj) {
      // console.log(obj);
       obj.setCountry('ae');
     }
     onCountryChange(obj){
       console.log('onCountryChange ',obj);
       this.mobileNumber='';
    
     }
     mobileNumber:any;
     getNumber(obj){
       console.log('getNumber ',obj);
       let num:string = obj;
     this.mobileNumber = obj;
     }
     hasError(obj){
       console.log('hasError ',obj);
      
       
     }
     changeUserMobile(){

       
     }
}
