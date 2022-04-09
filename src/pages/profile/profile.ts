import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController,AlertController,Events } from 'ionic-angular';
import { SpineServiceProvider } from '../../providers/spine-service/spine-service';
import { Storage } from '@ionic/storage';
import { FormGroup, Validators, AbstractControl, FormBuilder} from '@angular/forms';
import { LoginPage } from '../login/login';
@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  userInfo: any;
  public changePasswordForm: FormGroup;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public SpineServiceProvider:SpineServiceProvider,
    private storage: Storage,
    private formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private ev: Events) {
      this.buildForm();
      this.storage.get('userInfo').then(val=>{ 
        this.userInfo = val;        
        this.getProfile();
       });
  }
  

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }
  loading:boolean;
  profile:any =null;
  async getProfile(){
    this.loading = true;
    await this.SpineServiceProvider.getProfileInfo(
      this.userInfo.USER_ID,
      this.userInfo.USER_SYS_ID,
      this.userInfo.TOKEN,
      this.userInfo.USER_REF,
      this.userInfo.USER_TYPE
    ).then((result) => {
      let data = JSON.parse(result["_body"]);
      this.profile = data[0];
       console.log("profile Details  ",data);
    });
    this.loading = false;
  }
  hideForm:boolean=false;
  showPasswordForm(): void {
    this.changePasswordForm.reset();
    if (this.hideForm) {
      this.hideForm = false;
    }else{
      this.hideForm = true;
      this.oldPassValid=null;
    }

  }
  public buildForm(): void {
    this.changePasswordForm = this.formBuilder.group({
       oldPassword: [
         "",
         Validators.compose([
           Validators.minLength(3),
           Validators.required
         ])
       ],
       newPassword: [
         "",
         Validators.compose([
           Validators.minLength(4),
           Validators.required
         ])
       ],
       confirmPassword: [
         "",
         Validators.compose([
           Validators.minLength(4),
           Validators.required
         ])
       ],
     }, {
       validator: this.MatchPassword // Inject the provider method
     });
   }
 
   private MatchPassword(AC: AbstractControl) {
        const newPassword = AC.get('newPassword').value // to get value in input tag
        const confirmPassword = AC.get('confirmPassword').value // to get value in input tag
         if(newPassword != confirmPassword) {
             console.log('false');
             AC.get('confirmPassword').setErrors( { MatchPassword: true } )
         } else {
             //console.log('true')
             AC.get('confirmPassword').setErrors(null);
         }
     }
    oldPassValid:boolean;
    hideVerfiyButton:boolean;
    async verfiyOldPassword(){
      let loading = this.loadingCtrl.create({
        content: 'Validating current password...'
      });
    
      loading.present();
    
      await this.SpineServiceProvider.changePassword(
        this.userInfo.USER_ID,
        this.changePasswordForm.controls['oldPassword'].value,
        this.userInfo.USER_ID,
        this.userInfo.USER_SYS_ID,
        this.userInfo.TOKEN,
        this.userInfo.USER_REF,
        this.userInfo.USER_TYPE
      ).then((result) => {
        let data = JSON.parse(result["_body"]);
         console.log("verfiyOldPassword ",data);
         if (data.status=='success') {
          this.oldPassValid=true;
          this.hideVerfiyButton=true;
         }
         else{
          this.oldPassValid = false;
         }
      });

      loading.dismiss();
     }

    async resetPassword(){
      let loading = this.loadingCtrl.create({
        content: 'Reseting password...'
      });
      loading.present();
    
      await this.SpineServiceProvider.changeNewPassword(
        this.userInfo.USER_ID,
        this.changePasswordForm.controls['oldPassword'].value,
        this.changePasswordForm.controls['newPassword'].value,
        this.userInfo.USER_ID,
        this.userInfo.USER_SYS_ID,
        this.userInfo.TOKEN,
        this.userInfo.USER_REF,
        this.userInfo.USER_TYPE
      ).then((result) => {
        let data = JSON.parse(result["_body"]);
         console.log("resetNewPassword ",data);
         if (data.status=='success') {
          let alert = this.alertCtrl.create({
            title: 'Password Changed',
            subTitle: data.status,
            buttons: ['Ok']
          });
          alert.present();
          this.ev.publish("loggedIn", false);
         this.navCtrl.setRoot(LoginPage);
         }
         else{
          alert(data.status);
         }
      });

      loading.dismiss();
     }
}
