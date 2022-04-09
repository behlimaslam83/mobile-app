import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Storage } from "@ionic/storage";
@Injectable()

export class SpineServiceProvider {
  PromiseStatus: any;
  options: any;
  userDetails: any;
  sandbox=true; //false for live payment
  // host: String = 'http://132.1.0.104/spineL/en/';
   host: String = 'https://training.sedarspine.com/en/';
  //host: String = 'https://sedarspine.com/en/';
  constructor(public http: Http,private storage: Storage  ) {

    let headers = new Headers(
      {
        'Content-Type': 'application/json'
      });

    this.options = new RequestOptions({ headers: headers });
    // this.storage.get("userInfo").then((val) => {
    //   let userInfo = val;
    //   console.log(" EBR_SYS_ID ",userInfo.EBR_SYS_ID);
      
    // })
  }

  checkDeviceExist(mac_id) {
    var url = this.host + 'API_Services/ApproveCtr/checkMacExist';
    console.log(' url ' + url);
    let credentials = JSON.stringify({
      mac_id: mac_id,
    });
    console.log('checkMacExist() ', credentials);
    return new Promise((resolve, reject) => {
      this.http.post(url, credentials, this.options)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }
  registerDevice(user_desc, user_email, cell_no, mac_id, model, user_type) {
    var url = this.host + 'API_Services/DealerappCtr/requestAccess';
    let credentials = JSON.stringify({
      user_desc: user_desc,
      user_email: user_email,
      cell_no: cell_no,
      mac_id: mac_id,
      model: model,
      user_group: user_type,
      app_code: "DEALER-APP"
    });
    return new Promise((resolve, reject) => {
      this.http.post(url, credentials, this.options)
        .subscribe(res => {
        resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  login(user_id, user_passwd) {
    var url = this.host + 'API_Services/DealerappCtr/';
    let credentials = JSON.stringify({
      user_id: user_id,
      user_passwd: user_passwd,
      token: 'yes'
    });
    return new Promise((resolve, reject) => {
      this.http.post(url, credentials, this.options)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    })
  }

  getOrderListing(user_id, user_sys_id,token,user_ref,user_type,menu_access_code,fromDate,uptoDate) {
    var url = this.host + 'API_Services/DealerappCtr/OrderListing';
    let credentials = JSON.stringify({
      user_id: user_id,
      USER_SYS_ID : user_sys_id,
      token: token,
      USER_REF:user_ref,
      USER_TYPE:user_type,
      menu_access_code:menu_access_code,
      fromDate:fromDate,
      uptoDate:uptoDate
    });
    return new Promise((resolve, reject) => {
      this.http.post(url, credentials, this.options)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    })
  
  }
  getCreditLimit(user_id, user_sys_id,token,user_ref,user_type,menu_access_code) {
    var url = this.host + 'API_Services/DealerappCtr/CreditLimit';
    let credentials = JSON.stringify({
      user_id: user_id,
      USER_SYS_ID : user_sys_id,
      token: token,
      USER_REF:user_ref,
      USER_TYPE:user_type,
      menu_access_code:menu_access_code
    });
    return new Promise((resolve, reject) => 
    {
      this.http.post(url, credentials, this.options)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    })
  }
  //AccountStatement
  getAccountStatement(user_id, user_sys_id,token,user_ref,user_type,menu_access_code,fromDate,uptoDate) {
    var url = this.host + 'API_Services/DealerappCtr/AccountStatement';
    let credentials = JSON.stringify({
      user_id: user_id,
      USER_SYS_ID : user_sys_id,
      token: token,
      USER_REF:user_ref,
      USER_TYPE:user_type,
      menu_access_code:menu_access_code,
      fromDate:fromDate,
      uptoDate:uptoDate
    });
    return new Promise((resolve, reject) => {
      this.http.post(url, credentials, this.options)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    })
  }
  //PendingBills
  getPendingBills(user_id, user_sys_id,token,user_ref,user_type,menu_access_code) {
    var url = this.host + 'API_Services/DealerappCtr/PendingBills';
    let credentials = JSON.stringify({
      user_id: user_id,
      USER_SYS_ID : user_sys_id,
      token: token,
      USER_REF:user_ref,
      USER_TYPE:user_type,
      menu_access_code:menu_access_code
      // fromDate:fromDate,
      // uptoDate:uptoDate
    });
    return new Promise((resolve, reject) => {
      this.http.post(url, credentials, this.options)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    })
  }
  getProductList(user_id,user_sys_id,token,user_ref,user_type,menu_access_code) {
    var url = this.host + 'API_Services/DealerappCtr/ProductList';
    let credentials = JSON.stringify({
      user_id: user_id,
      USER_SYS_ID : user_sys_id,
      token:token,
      USER_REF:user_ref,
      USER_TYPE:user_type,
      menu_access_code:menu_access_code
    });
    return new Promise((resolve, reject) => {
      this.http.post(url, credentials, this.options)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    })
  }
  searchProduct(user_id, user_sys_id,token,user_ref,user_type,menu_access_code,searchData,productCode,productDesc) {
    var url = this.host + 'API_Services/DealerappCtr/ItemDetails';
    let credentials = JSON.stringify({
      user_id: user_id,
      USER_SYS_ID : user_sys_id,
      token: token,
      USER_REF:user_ref,
      USER_TYPE:user_type,
      menu_access_code:menu_access_code,
      searchData:searchData,
      productCode:productCode,
      productDesc:productDesc
    });
    return new Promise((resolve, reject) => {
      this.http.post(url, credentials, this.options)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    })
  }
  stockCheck(user_id, user_sys_id,token,user_ref,user_type,menu_access_code,stockCheckList ) {
    var url = this.host + 'API_Services/DealerappCtr/SearchedStockCheck';
    let credentials = JSON.stringify({
      user_id: user_id,
      USER_SYS_ID : user_sys_id,
      token: token,
      USER_REF:user_ref,
      USER_TYPE:user_type,
      menu_access_code:menu_access_code,
      stockcheckList:stockCheckList
    });
    return new Promise((resolve, reject) => {
      this.http.post(url, credentials, this.options)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    })
  }
  SendEnquiry(user_id, user_sys_id,token,user_ref,user_type,menu_access_code,stockCheckList ) {
    var url = this.host + 'API_Services/DealerappCtr/SendEnquiry';
    let credentials = JSON.stringify({
      user_id: user_id,
      USER_SYS_ID : user_sys_id,
      token: token,
      USER_REF:user_ref,
      USER_TYPE:user_type,
      menu_access_code:menu_access_code,
      stockcheckList:stockCheckList
    });
    return new Promise((resolve, reject) => {
      this.http.post(url, credentials, this.options)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    })
  }

  getSalesmanInfo(user_id, user_sys_id,token,user_ref,user_type) {
    var url = this.host + 'API_Services/DealerappCtr/SalesManInfo';
    let credentials = JSON.stringify({
      user_id: user_id,
      USER_SYS_ID : user_sys_id,
      token: token,
      USER_REF:user_ref,
      USER_TYPE:user_type
    });
    return new Promise((resolve, reject) => {
      this.http.post(url, credentials, this.options)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    })
  
  }

  getBankDetails(user_id, user_sys_id,token,user_ref,user_type,menu_access_code) {
    var url = this.host + 'API_Services/DealerappCtr/BankInfo';
    let credentials = JSON.stringify({
      user_id: user_id,
      USER_SYS_ID : user_sys_id,
      token: token,
      USER_REF:user_ref,
      USER_TYPE:user_type,
      menu_access_code:menu_access_code
    });
    return new Promise((resolve, reject) => {
      this.http.post(url, credentials, this.options)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    })
  
  }
  getInvoicedDetails(invoice_no,user_id, user_sys_id,token,user_ref,user_type,menu_access_code) {
    var url = this.host + 'API_Services/DealerappCtr/invoiceDetails';
    let credentials = JSON.stringify({
      invoice_no:invoice_no,
      user_id: user_id,
      USER_SYS_ID : user_sys_id,
      token: token,
      USER_REF:user_ref,
      USER_TYPE:user_type,
      menu_access_code:menu_access_code
    });
    return new Promise((resolve, reject) => {
      this.http.post(url, credentials, this.options)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    })
  
  }
  requestPaymentCollection(appoint_date,ct_st_code,add1,city_code,area_code,remarks,mobile,user_id, user_sys_id,token,user_ref,user_type,menu_access_code){
    var url = this.host + 'API_Services/DealerappCtr/CashCollectionRequest';
    let credentials = JSON.stringify({
      appoint_date:appoint_date,
      state_code:ct_st_code,
      add1:add1,
      city_code:city_code,
      area_code:area_code,
      remarks:remarks,
      mobile:mobile,
      user_id: user_id,
      USER_SYS_ID : user_sys_id,
      token: token,
      USER_REF:user_ref,
      USER_TYPE:user_type,
      menu_access_code:menu_access_code
    });
    return new Promise((resolve, reject) => {
      this.http.post(url, credentials, this.options)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    })
  }
  getProfileInfo(user_id, user_sys_id,token,user_ref,user_type) {
    var url = this.host + 'API_Services/DealerappCtr/ProfileInfo';
    let credentials = JSON.stringify({
      user_id: user_id,
      USER_SYS_ID : user_sys_id,
      token: token,
      USER_REF:user_ref,
      USER_TYPE:user_type
    });
    return new Promise((resolve, reject) => {
      this.http.post(url, credentials, this.options)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    })
  
  }
  validateEmail(email,otp_type,mobile_no) {
    var url = this.host + 'API_Services/DealerappCtr/ForgetPassword';
    let credentials = JSON.stringify({
      email:email,
      otp_type:otp_type,
      mobile_no:mobile_no
    });
    return new Promise((resolve, reject) => {
      this.http.post(url, credentials, this.options)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    })
  
  }
  validateOTP(email,otp,otp_type,mobile_no,request_id) {
    var url = this.host + 'API_Services/DealerappCtr/ConfirmOtp';
    let credentials = JSON.stringify({
      email:email,
      otp:otp,
      otp_type:otp_type,
      mobile_no:mobile_no,
      request_id:request_id
    });
    return new Promise((resolve, reject) => {
      this.http.post(url, credentials, this.options)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    })
  
  }
  resetPassword(email,otp,password,otp_type,mobile,request_id) {
    var url = this.host + 'API_Services/DealerappCtr/ResetPassword';
    let credentials = JSON.stringify({
      email:email,
      otp:otp,
      password:password,
      otp_type:otp_type,
      mobile_no:mobile,
      request_id:request_id
    });
    return new Promise((resolve, reject) => {
      this.http.post(url, credentials, this.options)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    })
  
  }
  
  invoiceRefDetails(invoice_no,user_id, user_sys_id,token,user_ref,user_type,menu_access_code) {
    var url = this.host + 'API_Services/DealerappCtr/InvoiceReferenceDetails';
    let credentials = JSON.stringify({
     
      invoice_no:invoice_no,
      user_id: user_id,
      USER_SYS_ID : user_sys_id,
      token: token,
      USER_REF:user_ref,
      USER_TYPE:user_type,
      menu_access_code:menu_access_code
    });
    return new Promise((resolve, reject) => {
      this.http.post(url, credentials, this.options)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    })
  }
  getGalleryImgs(ECI_CODE,user_id, user_sys_id,token,user_ref,user_type,menu_access_code) {
    var url = this.host + 'API_Services/DealerappCtr/DealerAppGallery';
    let credentials = JSON.stringify({
      productCode:ECI_CODE,
      user_id: user_id,
      USER_SYS_ID : user_sys_id,
      token: token,
      USER_REF:user_ref,
      USER_TYPE:user_type,
      menu_access_code:menu_access_code
    });
    return new Promise((resolve, reject) => {
      this.http.post(url, credentials, this.options)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    })
  }
 viewDoc(filePath,user_id, user_sys_id,token,user_ref,user_type,menu_access_code) {
    var url = this.host + 'API_Services/DealerappCtr/FetchDataForThisPath';
    let credentials = JSON.stringify({
      filePath:filePath,
      user_id: user_id,
      USER_SYS_ID : user_sys_id,
      token: token,
      USER_REF:user_ref,
      USER_TYPE:user_type,
      menu_access_code:menu_access_code
    });
    return new Promise((resolve, reject) => {
      this.http.post(url, credentials, this.options)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    })
  }
 saveInvoicePaymentDetails(invoice_sys_id,user_id, user_sys_id,token,user_ref,user_type) {
    var url = this.host + 'API_Services/DealerappCtr/InitiatePaymentGateway';
    let credentials = JSON.stringify({
      payment_flag:'INVOICE',
      invoice_sys_id:invoice_sys_id,
      user_id: user_id,
      USER_SYS_ID : user_sys_id,
      token: token,
      USER_REF:user_ref,
      USER_TYPE:user_type
    });
    return new Promise((resolve, reject) => {
      this.http.post(url, credentials, this.options)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    })
  }
  GetFincPaymentLink_Ref_id(invoice_sys_id,amount,payment_flag,user_id, user_sys_id,token,user_ref,user_type,menu_access_code) {
    var url = this.host + 'API_Services/DealerappCtr/InitiatePaymentGateway';
    let credentials = JSON.stringify({
      invoice_sys_id:invoice_sys_id,
      payment_flag:payment_flag,
      amount :amount,
      user_id: user_id,
      USER_SYS_ID : user_sys_id,
      token: token,
      USER_REF:user_ref,
      USER_TYPE:user_type,
      menu_access_code:menu_access_code
    });
    return new Promise((resolve, reject) => {
      this.http.post(url, credentials, this.options)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    })
  }
  accessCodeLive = 'HeKFKJ1VncDPgavpr68O';
  SHARequestPhraseLive='$2y$10$nZQ2D40Tg';
  checkPaymentStatus(access_code,merchant_identifier,merchant_reference,signature,fort_id ,url ): Observable<any> {
    //var url = 'https://sbpaymentservices.payfort.com/FortAPI/paymentApi';//sandbox
    //var url = 'https://paymentservices.payfort.com/FortAPI/paymentApi';//live
    let credentials = JSON.stringify({
      query_command :'CHECK_STATUS',
      access_code :access_code,
      merchant_identifier : merchant_identifier,
      // access_code :'wXM8qpBYUw2tmJpZceFD',
      // merchant_identifier : 'IcywLPmc',
      merchant_reference:merchant_reference,
      language   : 'en' ,
      signature :signature,
      //fort_id  : fort_id 
    });
   
 return  this.http.post(url, credentials, this.options)
      .map(res => res.json())
      .map(response => {
        console.log("Response ",response);
        return response;
    });
  
  }
  
  changePassword(email,old_password, user_id,user_sys_id,token,user_ref,user_type) {
    var url = this.host + 'API_Services/DealerappCtr/ChangePassword';
    let credentials = JSON.stringify({
      email:email,
      old_password: old_password,
      user_id: user_id,
      USER_SYS_ID : user_sys_id,
      token: token,
      USER_REF:user_ref,
      USER_TYPE:user_type
    });
    return new Promise((resolve, reject) => {
      this.http.post(url, credentials, this.options)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    })
  }
  changeNewPassword(email,old_password, new_password,user_id,user_sys_id,token,user_ref,user_type) {
    var url = this.host + 'API_Services/DealerappCtr/ChangingNewPassword';
    let credentials = JSON.stringify({
      email:email,
      old_password: old_password,
      new_password:new_password,
      user_id: user_id,
      USER_SYS_ID : user_sys_id,
      token: token,
      USER_REF:user_ref,
      USER_TYPE:user_type
    });
    return new Promise((resolve, reject) => {
      this.http.post(url, credentials, this.options)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    })
  }
  getCities(user_id,user_sys_id,token,user_ref,user_type,menu_access_code) {
    var url = this.host + 'API_Services/DealerappCtr/GetCityList';
    let credentials = JSON.stringify({
      user_id: user_id,
      USER_SYS_ID : user_sys_id,
      token: token,
      USER_REF:user_ref,
      USER_TYPE:user_type,
      menu_access_code:menu_access_code
    });
    return new Promise((resolve, reject) => {
      this.http.post(url, credentials, this.options)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    })
  }
  GetAreaList(city_code,user_id,user_sys_id,token,user_ref,user_type,menu_access_code) {
    var url = this.host + 'API_Services/DealerappCtr/GetAreaList';
    let credentials = JSON.stringify({
      city_code:city_code,
      user_id: user_id,
      USER_SYS_ID : user_sys_id,
      token: token,
      USER_REF:user_ref,
      USER_TYPE:user_type,
      menu_access_code:menu_access_code
    });
    return new Promise((resolve, reject) => {
      this.http.post(url, credentials, this.options)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    })
  }
  GetOrderDetails(user_id,user_sys_id,token,user_ref,user_type,menu_access_code,orderID) {
    var url = this.host + 'API_Services/DealerappCtr/OrderListingDetails';
    let credentials = JSON.stringify({
      user_id: user_id,
      USER_SYS_ID : user_sys_id,
      token: token,
      USER_REF:user_ref,
      USER_TYPE:user_type,
      menu_access_code:menu_access_code,
      orderID:orderID
    });
    return new Promise((resolve, reject) => {
      this.http.post(url, credentials, this.options)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    })
  }
  checkVersion(app_version) {
    var url = this.host + 'API_Services/CommonCtr/checkAppsVersion';
    let credentials = JSON.stringify({
      app_code: "DEALER-AND",
      app_version: app_version
    });
    return new Promise((resolve, reject) => {
      this.http.post(url, credentials, this.options)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  createUser(user_id,user_sys_id,token,user_ref,user_type,menu_access_code,user_email,user_mobile,user_name,pass_word,re_type_pass_word) {
    var url = this.host + 'API_Services/DealerappCtr/CreateUser';
    if (user_email == null) {
      user_email='';
    }
    let formData = new FormData();
    formData.append('user_id',user_id);
    formData.append('USER_SYS_ID',user_sys_id);
    formData.append('token',token);
    formData.append('USER_REF',user_ref);
    formData.append('USER_TYPE',user_type);
    formData.append('menu_access_code',menu_access_code);
    formData.append('user_email',user_email);
    formData.append('user_mobile',user_mobile);
    formData.append('lang_code','en');
    formData.append('user_name',user_name);
    formData.append('pass_word',pass_word);
    formData.append('re_type_pass_word',re_type_pass_word); 
    return new Promise((resolve, reject) => {
      this.http.post(url, formData)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  getUserList(user_id,user_sys_id,token,user_ref,user_type,menu_access_code){
    var url = this.host + 'API_Services/DealerappCtr/UserList';
    let formData = new FormData();
    formData.append('user_id',user_id);
    formData.append('USER_SYS_ID',user_sys_id);
    formData.append('token',token);
    formData.append('USER_REF',user_ref);
    formData.append('USER_TYPE',user_type);
    formData.append('menu_access_code',menu_access_code);
    return new Promise((resolve, reject) => {
      this.http.post(url, formData)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  deleteUser(user_id,user_sys_id,token,user_ref,user_type,menu_access_code,user_mobile,user_primary_id){
    var url = this.host + 'API_Services/DealerappCtr/DeleteUser';
    let formData = new FormData();
    formData.append('user_id',user_id);
    formData.append('USER_SYS_ID',user_sys_id);
    formData.append('token',token);
    formData.append('USER_REF',user_ref);
    formData.append('USER_TYPE',user_type);
    formData.append('menu_access_code',menu_access_code);
    formData.append('user_mobile',user_mobile);
    formData.append('lang_code','en');
    formData.append('user_primary_id',user_primary_id);
    return new Promise((resolve, reject) => {
      this.http.post(url, formData)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }
  getMenuList(user_id,user_sys_id,token,user_ref,user_type,menu_access_code){
    var url = this.host + 'API_Services/DealerappCtr/MenuListLOV';
    let formData = new FormData();
    formData.append('user_id',user_id);
    formData.append('USER_SYS_ID',user_sys_id);
    formData.append('token',token);
    formData.append('USER_REF',user_ref);
    formData.append('USER_TYPE',user_type);
    formData.append('menu_access_code',menu_access_code);
    return new Promise((resolve, reject) => {
      this.http.post(url, formData)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  creatMenuForUser(user_id,user_sys_id,token,user_ref,user_type,menu_access_code,menu_code,user_mobile,user_name,user_primary_id){
    var url = this.host + 'API_Services/DealerappCtr/CreateUserMenu';
    let formData = new FormData();
    formData.append('user_id',user_id);
    formData.append('USER_SYS_ID',user_sys_id);
    formData.append('token',token);
    formData.append('USER_REF',user_ref);
    formData.append('USER_TYPE',user_type);
    formData.append('menu_access_code',menu_access_code);
    formData.append('lang_code','en');
    formData.append('menu_code',menu_code);
    formData.append('user_mobile',user_mobile);
    formData.append('user_name',user_name);
    formData.append('user_primary_id',user_primary_id);
    return new Promise((resolve, reject) => {
      this.http.post(url, formData)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }
  deleteMenuForUser(user_id,user_sys_id,token,user_ref,user_type,menu_access_code,menu_code,user_mobile,user_primary_id){
    var url = this.host + 'API_Services/DealerappCtr/DeleteUserMenu';
    let formData = new FormData();
    formData.append('user_id',user_id);
    formData.append('USER_SYS_ID',user_sys_id);
    formData.append('token',token);
    formData.append('USER_REF',user_ref);
    formData.append('USER_TYPE',user_type);
    formData.append('menu_access_code',menu_access_code);
    formData.append('lang_code','en');
    formData.append('menu_code',menu_code);
    formData.append('user_mobile',user_mobile);
    formData.append('user_primary_id',user_primary_id);
    return new Promise((resolve, reject) => {
      this.http.post(url, formData)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  getUserDetailsForEdit(user_id,user_sys_id,token,user_ref,user_type,menu_access_code,user_primary_id){
    var url = this.host + 'API_Services/DealerappCtr/UserDetailForParticular';
    let formData = new FormData();
    formData.append('user_id',user_id);
    formData.append('USER_SYS_ID',user_sys_id);
    formData.append('token',token);
    formData.append('USER_REF',user_ref);
    formData.append('USER_TYPE',user_type);
    formData.append('menu_access_code',menu_access_code);
    formData.append('lang_code','en');
    formData.append('user_primary_id',user_primary_id);
    return new Promise((resolve, reject) => {
      this.http.post(url, formData)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  updateUserDetails(user_id,user_sys_id,token,user_ref,user_type,menu_access_code,user_email,user_mobile,user_name,user_primary_id) {
    var url = this.host + 'API_Services/DealerappCtr/UpdateUser';
    let formData = new FormData();
    formData.append('user_id',user_id);
    formData.append('USER_SYS_ID',user_sys_id);
    formData.append('token',token);
    formData.append('USER_REF',user_ref);
    formData.append('USER_TYPE',user_type);
    formData.append('menu_access_code',menu_access_code);
    formData.append('lang_code','en');
    formData.append('user_email',user_email);
    formData.append('user_mobile',user_mobile);
    formData.append('user_name',user_name);
    formData.append('user_primary_id',user_primary_id);
    return new Promise((resolve, reject) => {
      this.http.post(url, formData)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  getUserMenuForEdit(user_id,user_sys_id,token,user_ref,user_type,menu_access_code,user_primary_id){
    var url = this.host + 'API_Services/DealerappCtr/ActiveMenuListForUser';
    let formData = new FormData();
    formData.append('user_id',user_id);
    formData.append('USER_SYS_ID',user_sys_id);
    formData.append('token',token);
    formData.append('USER_REF',user_ref);
    formData.append('USER_TYPE',user_type);
    formData.append('menu_access_code',menu_access_code);
    formData.append('lang_code','en');
    formData.append('user_primary_id',user_primary_id);
    return new Promise((resolve, reject) => {
      this.http.post(url, formData)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }
  sendOTP(user_id,user_sys_id,token,user_ref,user_type,menu_access_code,user_mobile){
    var url = this.host + 'API_Services/DealerappCtr/SendOTP';
    let formData = new FormData();
    formData.append('user_id',user_id);
    formData.append('USER_SYS_ID',user_sys_id);
    formData.append('token',token);
    formData.append('USER_REF',user_ref);
    formData.append('USER_TYPE',user_type);
    formData.append('menu_access_code',menu_access_code);
    formData.append('lang_code','en');
    formData.append('user_mobile',user_mobile);
    return new Promise((resolve, reject) => {
      this.http.post(url, formData)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }
  verifyOTP(user_id,user_sys_id,token,user_ref,user_type,menu_access_code,user_mobile,otp_value,request_id){
    var url = this.host + 'API_Services/DealerappCtr/VerifyOTP';
    let formData = new FormData();
    formData.append('user_id',user_id);
    formData.append('USER_SYS_ID',user_sys_id);
    formData.append('token',token);
    formData.append('USER_REF',user_ref);
    formData.append('USER_TYPE',user_type);
    formData.append('menu_access_code',menu_access_code);
    formData.append('lang_code','en');
    formData.append('user_mobile',user_mobile);
    formData.append('otp_value',otp_value);
    formData.append('request_id',request_id);
    return new Promise((resolve, reject) => {
      this.http.post(url, formData)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }
  itemSQM(user_id,user_sys_id,token,user_ref,user_type,menu_access_code,itemCode) {
    var url = this.host + 'API_Services/DealerappCtr/ItemBasedOnSQM_YN';
    let credentials = JSON.stringify({
     
      user_id: user_id,
      USER_SYS_ID : user_sys_id,
      token: token,
      USER_REF:user_ref,
      USER_TYPE:user_type,
      menu_access_code:menu_access_code,
      itemCode:itemCode
    });
    return new Promise((resolve, reject) => {
      this.http.post(url, credentials, this.options)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    })
  }
}
