import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { SpineServiceProvider } from "../../providers/spine-service/spine-service";
//import {Ng2TelInputModule} from 'ng2-tel-input';
export interface menuList {
  AMM_DISP_SEQ: string;
  MENU_CODE: string;
  MENU_DESC: string;
  CHECKED: boolean;
}

@IonicPage()
@Component({
  selector: "page-manager",
  templateUrl: "manager.html",
})

export class ManagerPage {
  userInfo: any;
  accessForm: FormGroup;
  editAccessForm: FormGroup;
  hideAccessForm: boolean = true;
  hideEditForm: boolean = true;
  userList: any;
  menuListLov:menuList[]=[];
  user_primary_id:any=null;
  accessFormDisabled:boolean=false;
  editAccessFormDisabled:boolean=false;
  menu_access_code:string;
  @ViewChild('ngOtpInput') ngOtpInput: any;
  @ViewChild('mobileInput') myInput ;
  config = {
    allowNumbersOnly: true,
    length: 6,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
    inputStyles: {
      'width': '40px',
      'height': '40px'
    }
  };

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    private storage: Storage,
    public SpineServiceProvider: SpineServiceProvider,
    private alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController
  ) {
    this.menu_access_code = this.navParams.get('menu_access_code');
    
    this.accessForm = this.formBuilder.group(
      {
        userName: [
          "",
          Validators.compose([
            Validators.required,
            Validators.maxLength(50)
          ]),
        ],
        email: [
          '',
          
          // Validators.compose([
          //   Validators.email,
          //   // Validators.required,
          //   Validators.pattern(/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/)
          //    ]),
        ],
        mobile: [
          "",
          Validators.compose([
            Validators.required,
            // Validators.maxLength(10),
            //Validators.minLength(10),
          ]),
        ],
        otp:['',
        Validators.compose([
          Validators.required
        ]),
      ],
        password: [
          "",
          Validators.compose([Validators.required, Validators.minLength(4),]),
        ],
        rePassword: [
          "",
          Validators.compose([Validators.required, Validators.minLength(4)]),
        ],
      },
      { validator: this.passwordMatchValidator },
    );
    
    this.editAccessForm = this.formBuilder.group(
      {
        userName: [
          "",
          Validators.compose([
            Validators.required,
            Validators.maxLength(50)
          ]),
        ],
        email: [
          "",
          // Validators.compose([
          //   Validators.email,
          //    Validators.required,
          //   Validators.pattern(/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/) ]),
        ],
        mobile: [
          "",
          Validators.compose([
            Validators.required
          ]),
        ],
        oldMobile: [
          ""
        ],
        otp:['123456',
        Validators.compose([
          Validators.required,
          // Validators.minLength(4)
        ]),
      ],
        user_primary_id:[]
      }
    );  
    this.storage.get("userInfo").then((val) => {
      this.userInfo = val;
      this.getUserList();
    });
  }
  passwordMatchValidator(frm: FormGroup) {
    return frm.controls["password"].value === frm.controls["rePassword"].value
      ? null
      : { mismatch: true };
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad ManagerPage");
  }
  addUser(cmd:string,user_primary_id:string) {
    console.log("cmd ",cmd);
    this.mobileReadOnly = false;
    this.editMobileReadOnly = true;
    if (cmd =='newUser') {
      //show access form
      this.segment = 'user';
      this.hideAccessForm = false;
      this.hideEditForm = true;
    } else if (cmd =='close') {
       //hide access form
      this.hideAccessForm = true;
      this.hideEditForm =true;
      this.getUserList();
      this.accessForm.reset();
      this.editAccessForm.reset();
      this.menuListLov=[];
      this.user_primary_id= null;
      this.accessFormDisabled = false;
      this.disableUpdateButton = false;
      this.showEditOTPInput =false;
      this.editAccessForm.controls['otp'].setValue('123456');
      this.activeEditOTP = false;
      this.otpEditVerified= true;
    } else if (cmd =='editUser'){
      //open edit form 
      this.editSegment='settings';
      console.log("user_primary_id ",user_primary_id);
      this.hideEditForm = false;
      this.getUserData(user_primary_id);
    }
  }
  
  async getUserList() {
    let loading = this.loadingCtrl.create({
      content: "Loading users ...",
    });

    loading.present();
    await this.SpineServiceProvider.getUserList(
      this.userInfo.USER_ID,
      this.userInfo.USER_SYS_ID,
      this.userInfo.TOKEN,
      this.userInfo.USER_REF,
      this.userInfo.USER_TYPE,
      this.menu_access_code
    ).then((result) => {
      let userList = JSON.parse(result["_body"]);
      console.log("userList ", userList);
      if (userList.status == "success") {
        this.userList = userList.result;
      }
    });
    loading.dismiss();
  }

  async createUser() {
    let loading = this.loadingCtrl.create({
      content: "Creating user..",
    });

    loading.present();
    await this.SpineServiceProvider.createUser(
      this.userInfo.USER_ID,
      this.userInfo.USER_SYS_ID,
      this.userInfo.TOKEN,
      this.userInfo.USER_REF,
      this.userInfo.USER_TYPE,
      this.menu_access_code,
      this.accessForm.value["email"],
      this.accessForm.value["mobile"],
      this.accessForm.value["userName"],
      this.accessForm.value["password"],
      this.accessForm.value["rePassword"]
    ).then((result) => {
      loading.dismiss();

      let response = JSON.parse(result["_body"]);
      if(response.status == 'success'){
        console.log('user_primary_id',response.result.user_primary_id);
        this.user_primary_id = response.result.user_primary_id;
        this.getMenuList();
        this.showAlert('User created','Please assign access to '+this.accessForm.value["userName"]);
         this.accessFormDisabled = true;
         this.segment = 'settings';
      }else{
        this.showAlert(response.status,response.error_message);
      }
    });
  }
  userMobile:any;
  async getUserData(user_primary_id){
    let loading = this.loadingCtrl.create({
      content: "Fetching user details..",
    });

    loading.present();
    await this.SpineServiceProvider.getUserDetailsForEdit(
      this.userInfo.USER_ID,
      this.userInfo.USER_SYS_ID,
      this.userInfo.TOKEN,
      this.userInfo.USER_REF,
      this.userInfo.USER_TYPE,
      this.menu_access_code,
      user_primary_id
    ).then((result) => {
      let response = JSON.parse(result["_body"]);
      console.log("getUserData " + response.result);
      let user = response.result;
      console.log("user ", user);
      this.editAccessForm.controls['userName'].setValue(user[0].AMU_DESC);
      this.editAccessForm.controls['email'].setValue(user[0].AMU_EMAIL);
      this.editAccessForm.controls['mobile'].setValue(user[0].AMU_CELL_PHONE);
      this.userMobile = user[0].AMU_CELL_PHONE;
      this.editAccessForm.controls['user_primary_id'].setValue(user[0].AMU_CODE);
      this.getMenuList().then(()=>{
        this.getUserEditMenuList();
      });
    });
    loading.dismiss();
    //console.log("edit form value -- >",this.editAccessForm.value);
  }

  async updateUser() {
    let loading = this.loadingCtrl.create({
      content: "Updating user..",
    });

    loading.present();
    await this.SpineServiceProvider.updateUserDetails(
      this.userInfo.USER_ID,
      this.userInfo.USER_SYS_ID,
      this.userInfo.TOKEN,
      this.userInfo.USER_REF,
      this.userInfo.USER_TYPE,
      this.menu_access_code,
      this.editAccessForm.value["email"],
      this.editAccessForm.value["mobile"],
      this.editAccessForm.value["userName"],
      this.editAccessForm.value["user_primary_id"]
    ).then((result) => {
      loading.dismiss();

      let response = JSON.parse(result["_body"]);
      if(response.status == 'success'){       
       // this.showAlert('User Updated','Please assign controls to '+this.editAccessForm.value["userName"]);
        this.editMobileReadOnly = true;
        this.addUser('close',null);
      }else{
        this.showAlert(response.status,response.msg);
      }
    });
  }

  async getMenuList() {
    let loading = this.loadingCtrl.create({
      content: "Loading menu list..",
    });

    loading.present();
    await this.SpineServiceProvider.getMenuList(
      this.userInfo.USER_ID,
      this.userInfo.USER_SYS_ID,
      this.userInfo.TOKEN,
      this.userInfo.USER_REF,
      this.userInfo.USER_TYPE,
      this.menu_access_code
    ).then((result) => {
      let response = JSON.parse(result["_body"]);
      console.log("getMenuList " + response.result);
      let data = response.result;
      for (let i = 0; i < data.length; i++) {
        
        this.menuListLov.push({
          AMM_DISP_SEQ: data[i].AMM_DISP_SEQ,
          MENU_CODE: data[i].MENU_CODE,
          MENU_DESC: data[i].MENU_DESC,
          CHECKED: false,
        });
        
      }
    });
    loading.dismiss();
  }

  async getUserEditMenuList() {
    let loading = this.loadingCtrl.create({
      content: "Loading allowed menu..",
    });

    loading.present();
    await this.SpineServiceProvider.getUserMenuForEdit(
      this.userInfo.USER_ID,
      this.userInfo.USER_SYS_ID,
      this.userInfo.TOKEN,
      this.userInfo.USER_REF,
      this.userInfo.USER_TYPE,
      this.menu_access_code,
      this.editAccessForm.value["user_primary_id"]
    ).then((result) => {
      let response = JSON.parse(result["_body"]);
      //console.log("getUserMenuList " + response.result);
      let data = response.result;
      for (let i = 0; i < data.length; i++) {
        //console.log('MENU_CODE', data[i].MENU_CODE);

        //Find index of specific object using findIndex method.    
       let objIndex = this.menuListLov.findIndex((obj => obj.MENU_CODE == data[i].MENU_CODE));
       //console.log("objIndex", objIndex);
        this.menuListLov[objIndex].CHECKED=true;
      }
    });
    loading.dismiss();
  }

  
  checkToggle(menu_code,CHECKED){
    console.log("MENU_CODE , CHECKED",menu_code , CHECKED);
    if (CHECKED) {
      this.createUserMenu(menu_code);
    } else {
      this.deleteUserMenu(menu_code);
    }
    
  }
  async createUserMenu(menu_code) {
    let loading = this.loadingCtrl.create({
      content: "Granting access...",
    });
    loading.present();
    let mobile;
    let userName;
    let user_primary_id;
    if(this.hideEditForm){
      mobile = this.accessForm.value["mobile"];
      userName = this.accessForm.value["userName"];
      user_primary_id = this.user_primary_id;
    }
    else{
      mobile = this.editAccessForm.value["mobile"];
      userName = this.editAccessForm.value["userName"];
      user_primary_id = this.editAccessForm.value["user_primary_id"];
    }
    await this.SpineServiceProvider.creatMenuForUser(
      this.userInfo.USER_ID,
      this.userInfo.USER_SYS_ID,
      this.userInfo.TOKEN,
      this.userInfo.USER_REF,
      this.userInfo.USER_TYPE,
      this.menu_access_code,
      menu_code,
      mobile,
      userName,
      user_primary_id
    ).then((result) => {
      let response = JSON.parse(result["_body"]);
      console.log("createUserMenu " + response);
    });
    loading.dismiss();
  }
  async deleteUserMenu(menu_code) {
    let loading = this.loadingCtrl.create({
      content: "Removing access...",
    });

    loading.present();
    let mobile;
    let user_primary_id;
    if(this.hideEditForm){
      mobile = this.accessForm.value["mobile"];
      user_primary_id = this.user_primary_id;
    }
    else{
      mobile = this.editAccessForm.value["mobile"];
      user_primary_id = this.editAccessForm.value["user_primary_id"];
    }
    await this.SpineServiceProvider.deleteMenuForUser(
      this.userInfo.USER_ID,
      this.userInfo.USER_SYS_ID,
      this.userInfo.TOKEN,
      this.userInfo.USER_REF,
      this.userInfo.USER_TYPE,
      this.menu_access_code,
      menu_code,
      mobile,
      user_primary_id
    ).then((result) => {
      let response = JSON.parse(result["_body"]);
      console.log("deleteUserMenu " + response);
    });
    loading.dismiss();
  }

  deleteUserAlert(amu_desc, amu_code, user_mobile) {
    const confirm = this.alertCtrl.create({
      title: "Delete User ?",
      message: "Remove access from " + amu_desc,
      buttons: [
        {
          text: "Cancel",
        },
        {
          text: "Delete",
          handler: () => {
            //console.log("Agree clicked");
            this.deleteUser(amu_code, user_mobile);
          },
        },
      ],
    });
    confirm.present();
  }

  async deleteUser(amu_code, user_mobile) {
    let loading = this.loadingCtrl.create({
      content: "Deleting user...",
    });

    loading.present();
    await this.SpineServiceProvider.deleteUser(
      this.userInfo.USER_ID,
      this.userInfo.USER_SYS_ID,
      this.userInfo.TOKEN,
      this.userInfo.USER_REF,
      this.userInfo.USER_TYPE,
      this.menu_access_code,
      user_mobile,
      amu_code
    ).then((result) => {
      let response = JSON.parse(result["_body"]);
      console.log("Delete User" + response);
      this.getUserList();
    });
    loading.dismiss();
  }

  request_id:any;
  // create user controls
  segment:string='user';
  activeOTP:boolean = false;
  otpVerified:boolean = true;
  mobileReadOnly:boolean = false;

  //edit form controls
  editSegment:string='settings';
  activeEditOTP:boolean = false;
  otpEditVerified:boolean = true;
  editMobileReadOnly:boolean = true;
  disableUpdateButton:boolean = false;
  showEditOTPInput:boolean=false;
  async sendOTP() {
    //Access Form
    if(!this.hideAccessForm){
      console.log(' send OTP AccessForm-------->'); 
    let loading = this.loadingCtrl.create({
      content: "",
    });

    loading.present();
    await this.SpineServiceProvider.sendOTP(
      this.userInfo.USER_ID,
      this.userInfo.USER_SYS_ID,
      this.userInfo.TOKEN,
      this.userInfo.USER_REF,
      this.userInfo.USER_TYPE,
      this.menu_access_code,
      this.accessForm.value["mobile"]
    ).then((result) => {
      let response = JSON.parse(result["_body"]);
      console.log("OTP " + response);
      if (response.status== 'success') {
      this.request_id = response.result.requestId;
      this.activeOTP = false;
      this.otpVerified = false;
      }else{
        this.showAlert(response.status, response.error_message);
      }
      
    });
    loading.dismiss();
  }
  //edit form
   else if(!this.hideEditForm){
    console.log(' send OTP editForm-------->');
    let loading = this.loadingCtrl.create({
      content: "",
    });

    loading.present();
    await this.SpineServiceProvider.sendOTP(
      this.userInfo.USER_ID,
      this.userInfo.USER_SYS_ID,
      this.userInfo.TOKEN,
      this.userInfo.USER_REF,
      this.userInfo.USER_TYPE,
      this.menu_access_code,
      this.editAccessForm.value["mobile"]
    ).then((result) => {
      let response = JSON.parse(result["_body"]);
      console.log("OTP " + response);
      if (response.status== 'success') {
      this.request_id = response.result.requestId;
      this.activeEditOTP = false;
      this.otpEditVerified = false;
      this.disableUpdateButton = true;
      this.showEditOTPInput =true;
      }else{
        this.showAlert(response.status, response.error_message );
      }
      
    });
    loading.dismiss();
  }
  }
 
  async verifyOTP() {
    if (!this.hideAccessForm) {
      console.log('verifyOTP Accessform --------->');
      
      let loading = this.loadingCtrl.create({
        content: "",
      });
  
      loading.present();
      await this.SpineServiceProvider.verifyOTP(
        this.userInfo.USER_ID,
        this.userInfo.USER_SYS_ID,
        this.userInfo.TOKEN,
        this.userInfo.USER_REF,
        this.userInfo.USER_TYPE,
        this.menu_access_code,
        this.accessForm.value["mobile"],
        this.accessForm.value["otp"],
        this.request_id
      ).then((result) => {
        let response = JSON.parse(result["_body"]);
        console.log("OTP verify " + response);
        if (response.status== 'success') {
          this.otpVerified = true;
          this.mobileReadOnly = true;
          const toast = this.toastCtrl.create({
            message: response.status+','+response.msg,
            duration: 3000,
            position:'top'
          });
          toast.present();
          }else{
            this.showAlert(response.status, response.msg);
          }
        
      });
      loading.dismiss();
    } else if (!this.hideEditForm) {
      console.log('verifyOTP Edit form ------>');
      let loading = this.loadingCtrl.create({
        content: "",
      });
  
      loading.present();
      await this.SpineServiceProvider.verifyOTP(
        this.userInfo.USER_ID,
        this.userInfo.USER_SYS_ID,
        this.userInfo.TOKEN,
        this.userInfo.USER_REF,
        this.userInfo.USER_TYPE,
        this.menu_access_code,
        this.editAccessForm.value["mobile"],
        this.editAccessForm.value["otp"],
        this.request_id
      ).then((result) => {
        let response = JSON.parse(result["_body"]);
        console.log("OTP verify " + response);
        if (response.status== 'success') {
          this.otpEditVerified = true;
          this.mobileReadOnly = true;
          this.disableUpdateButton = false;
          this.showEditOTPInput =false;
         //this.showAlert(response.status,response.msg)
         const toast = this.toastCtrl.create({
          message: response.status+','+response.msg,
          duration: 3000,
          position:'top'
        });
          }else{
          this.disableUpdateButton = true;
          this.ngOtpInput.setValue(null);
           this.showAlert(response.status, response.msg);
          }
        
      });
      loading.dismiss();
    }
    
  }
  showAlert(title, desc) {
    const confirm = this.alertCtrl.create({
      title: title,
      message: desc,
      buttons: [
        {
          text: "ok",
        }
      ],
    });
    confirm.present();
  } 
  telInputObject(obj) {
   // console.log(obj);
    obj.setCountry('ae');
  }
  onCountryChange(obj){
    console.log('onCountryChange ',obj);
    if (!this.hideAccessForm) {   
      //show access form
      this.accessForm.controls['mobile'].setValue('');
    }else if(!this.hideEditForm) {
      //show edit form
      this.editAccessForm.controls['mobile'].setValue('');
    }
  }
  getNumber(obj){
    console.log('getNumber ',obj);
    let num:string = obj;
    if (!this.hideAccessForm) {   
      this.accessForm.controls['mobile'].setValue(obj);
    }else if(!this.hideEditForm) {
      this.editAccessForm.controls['mobile'].setValue(obj);
       if (!this.editMobileReadOnly) {
        this.activeEditOTP = true;
       }  
    }
  }
  hasError(obj){
    console.log('hasError ',obj);
    if (!obj) {
      if (!this.hideAccessForm) {   
        this.accessForm.controls['mobile'].setErrors({'incorrect': true});;
      }else if(!this.hideEditForm) {
        this.editAccessForm.controls['mobile'].setErrors({'incorrect': true});
      }
    }
    
  }
  changeUserMobile(){
    this.editMobileReadOnly = false;
    
    // setTimeout(() => {
    //   this.myInput.setFocus();
    // },1000);
    //this.editAccessForm.patchValue({oldMobile : this.editAccessForm.value["mobile"]});
    this.editAccessForm.controls['oldMobile'].setValue(this.userMobile);
    this.editAccessForm.controls['mobile'].reset();
    this.editAccessForm.controls['otp'].reset();
    
  }
  //oneTimePass;string=null
  onEditOtpChange(otp) {
   let oneTimePass = otp;
   // console.log("OTP" + otp);
    if (oneTimePass.length == 6) {
      this.editAccessForm.patchValue({otp : oneTimePass});
      this.verifyOTP();
    }
     
  }
  onOtpChange(otp) {
   let oneTimePass = otp;
    //console.log("OTP" + otp);
    if (oneTimePass.length == 6) {
      this.accessForm.patchValue({otp : oneTimePass});
      this.verifyOTP();
    }
     
  }
}
