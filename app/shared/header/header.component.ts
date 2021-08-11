import { Component, OnInit,Input,ViewContainerRef,Renderer2,Inject,PLATFORM_ID} from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { DOCUMENT } from "@angular/common";
import { map, startWith} from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../auth.service';
import { TodoService } from '../../todo.service';
import { ProductService } from '../../product.service';
import { Observable} from 'rxjs';
import { Router ,RoutesRecognized} from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Authparams } from '../../authparams';
import { User } from '../../user';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { filter, pairwise } from 'rxjs/operators';
import * as $ from 'jquery';
import {isPlatformBrowser} from '@angular/common';
import {BehaviorSubject} from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
declare var window: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  providers : [ProductService,TodoService,User]
})
export class HeaderComponent implements OnInit{
  static isBrowser = new BehaviorSubject<boolean>(null!);
  myControl = new FormControl();
  referer : any;
  logingroup : FormGroup;
  login : any = {step : 1};
  signup : any = {step : 1};
  reset : any = {step : 1};
  _bonus_offer : any;
  signupgroup : FormGroup;
  resetgroup : FormGroup;
  checkphonegroup : FormGroup
  proceedresetgroup : FormGroup;
  href : string;
  action : number = 1;
  start : number = 0;
  more_display : boolean = true;
  signupdisabled : boolean= false; 
  verifydisabled : boolean= false; 
  imageChangedEvent: any = '';
  croppedImage: any = '';
  form: FormGroup;
  disabled : boolean = false;
  private watch  : Number = 0;
  circles : any;
  remember : any = {rm:false,ph:'',pw : ''};
    private token_params : Authparams;
    public phone : number;
    public phone1 : string;
    public password : string;
    public otp : number;
    public otp1 : string;
    public otp2: string;
    public otp3: string;
    public otp4 : string;
    public tick : number = 0;
    private user_type : number;
    public verify : number;
    public signupverify : number = 0;
    public notifications : any = {};
    public notification_count : any = {count :0};
    public favourites : any;
    private pin : any;
    public favourite_count : number;
    public offline_alert : boolean = false;
  options: any = [{ title: 'One',id:1},{title:  'Two',id:2},{title: 'Three',id:3}];
  filteredOptions: any;
  filterdList : boolean = false;
  valid_for_bonus : boolean= false;
  _bonus_text : any ;
  region : any;
  constructor(
    private _renderer2: Renderer2,  
    @Inject(DOCUMENT) private _document,  
    private authService : AuthService,
    public todoservice : TodoService,
    public productservice : ProductService,
    private toastr : ToastrManager,
    private vcr: ViewContainerRef,
    public router : Router,
    private fb: FormBuilder,
    private spinner : NgxSpinnerService,
    private http : HttpClient,
    @Inject(PLATFORM_ID) private platformId: any
  ) 
    {
      HeaderComponent.isBrowser.next(isPlatformBrowser(platformId));
      this.router.events
        .pipe(filter((evt: any) => evt instanceof RoutesRecognized), pairwise())
        .subscribe((events: RoutesRecognized[]) => {
          
          this.todoservice.previousUrl =  events[0].urlAfterRedirects;
          this.todoservice.currnetURL = events[1].urlAfterRedirects;
          let url :any = [this.todoservice.previousUrl,this.todoservice.currnetURL];
          this.todoservice.set_urls(url);
        });
      if(!this.get_token())
      {
        this.authService.clear_session();
      }
      // this.productservice.cartItemsCount();
      this.logingroup = fb.group({
        'phone' : [null,Validators.compose([Validators.required,,Validators.pattern("[0-9]{10}")])],
        'password' : [null,Validators.compose([Validators.required,Validators.minLength(5)])],
        'remember' : [null],
      });
      this.resetgroup = fb.group({
        'password' : [null,Validators.compose([Validators.required,Validators.minLength(5)])],
         'cpassword' : [null,Validators.compose([Validators.required,Validators.minLength(5)])]
       });
       this.proceedresetgroup = fb.group({
        'phone' : [null,Validators.compose([Validators.required,Validators.pattern("[0-9]{10}")])],
        'pin'   : [null]
       });
       this.checkphonegroup = fb.group({
        'phone' : [null,Validators.compose([Validators.required,Validators.pattern("[0-9]{10}")])],
      }); 
      this.signupgroup = fb.group({
        'name':[null,Validators.required],
        'email' : [null,Validators.compose([
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')])],
        'user_type':[null],
        'password' : [null,Validators.compose([Validators.required,Validators.minLength(5)])],
        'cpassword' : [null,Validators.compose([Validators.required,Validators.minLength(5)])],
      });
      this.get_remember();
      this.createForm();
    }

    onKeyUp(event: any) {
      this.search_me(event.target.value);
    }

    change_action(action)
    {
      if(action == 'login')
        this.action = 1;
      else if(action == 'register')
        this.action = 2;
      else if(action == 'reset')
        this.action = 3  
    }
  process_to_reset(data,me)
  {
    if(!me)
      me = this;
    if(data.phone == '')
    {
      this.toastr.errorToastr("Enter Registered Number");
      return;
    }
    this.phone = data.phone;
    data.step =  this.reset.step;
    if(data.pin)
      this.pin = data.pin
    if(document.URL.indexOf('android_asset') !== -1)
    {
      data.device = 'android';
    }
    this.spinner.show();
      this.todoservice.proceed_to_reset(data)
      .subscribe(
        data => 
        {
          this.spinner.hide();
          if(data.status == true)
          {
            this.toastr.successToastr(data.msg);
            this.reset.step = data.step;
            // if(this.step == 2)
            //   this.watch_sms();
            this.tick_clock(60);
          }
          else
          {
            if(data.status == 'alert')
            this.toastr.errorToastr(data.message,'Alert',{showCloseButton : true,dismiss: 'click'});
            else  
              this.toastr.errorToastr(data.msg);
          }
        }
      )  
  }

  reset_password(form)
  {
    form.phone = this.phone;
    form.pin  = this.pin;
    if(form.password != form.cpassword)
    {
      this.toastr.errorToastr('Confirm password must be same.');
      return;
    }
    this.todoservice.reset_password(form)
      .subscribe(
        data => 
        {
          if(data.status == true)
          {
            this.toastr.successToastr(data.msg,'Success');
            this.action = 1;
            this.logingroup.setValue({phone : this.phone})
            // this.back_to_login = true;
            //this.router.navigate(['/proceed/login'], { queryParams: { reset: 'true' } });
          }
          else
          {
            this.toastr.errorToastr(data.msg);
          }
        }
      )  
  }

  check_phone(form)
  {
    this.phone = form.phone;
    this.spinner.show();
    this.todoservice.check_phone(form)
    .subscribe(
      data => 
      {
        if(data.status == "success")
        { 
         this.signup.step = 2;
         this.tick_clock(60);
        }       
        else
        {
          this.toastr.errorToastr(data.msg,"Failed");
        }
        this.spinner.hide();  
      }
    )
  } 

  verify_signup_user(data)
  {
    var me = this;

      var otp1 = $('#header-signup #otp1').val();
      var otp2 = $('#header-signup #otp2').val();
      var otp3 = $('#header-signup #otp3').val();
      var otp4 = $('#header-signup #otp4').val();  
      data.otp = otp1.toString() + otp2.toString() + otp3.toString() + otp4.toString();
    data.phone = me.phone;
    me.verifydisabled = true;
    this.spinner.show();
    me.todoservice.verify_user(data)
      .subscribe(
        data => 
        {
          this.spinner.hide();
          me.verifydisabled = false;
          if(data.status == 'true')
          {
            me.toastr.successToastr(data.msg, 'Success');
            
            localStorage.removeItem('favourite');
            localStorage.removeItem('cart');
            this.signup.step = 3;
          }
          else
          {
            me.toastr.errorToastr(data.msg, 'Failed');
            return;
          }
        }
      ) 
  }

  signup_user(formdata)
  {
    if(formdata.user_type == null)
      formdata.user_type = 1;
    else
      this.user_type = formdata.user_type ;
    if(formdata.password != formdata.cpassword)
    {
      this.toastr.errorToastr("Password does not match with Confirm Password", 'Failed');
        return;
    }
    formdata.phone = this.phone;
    this.password = formdata.password;
    this.signupdisabled = true; 
    
    if(this._bonus_offer && this._bonus_offer.valid)
        formdata.bonus = '_bonus';
    this.spinner.show();
    this.todoservice.signup(formdata)
      .subscribe(
        data => 
        {
          this.spinner.hide();
          if(data.status == 'success')
          {
            this.verify = 1;
            let store = data.store;
            this.authService.storage(store,this);
            this.close_modal();
            let url = window.location.pathname;
            if(url == url)
            {
                this.router.routeReuseStrategy.shouldReuseRoute = function(){
                  return false;
                }
              this.router.navigated = false;
              this.router.navigate([url]);
            } 
            this.init_page();
            // this.router.navigate(['/']);
          }
          else
          {
            this.toastr.errorToastr(data.msg, 'Failed');
          }
          this.signupdisabled = false; 
        }
      ) 
  }
  hide_signup_form()
    {
      this.signup.step = 1;
    }
    ngOnInit()
    { 
      this.todoservice.createOnline$().subscribe(isOnline => 
        {
          if(isOnline == false)
          {
            if(this.offline_alert == true)
              return;
            this.offline_alert = true;  
            this.toastr.infoToastr("No Internet Connection.");
            return ;
          }
        } 
        );  
        if(document.URL.indexOf('android_asset') !== -1 && isPlatformBrowser(this.platformId))
        {
          if($('#cordova-js').length == 0)
          {
            let script1 = this._renderer2.createElement('script');
            script1.type = `text/javascript`;
            script1.id = `cordova-js`;
            script1.src = `cordova.js`;
            this._renderer2.appendChild(this._document.body, script1);
          }
        }
        

      this.href = this.router.url;                                  
      this.filteredOptions = this.myControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value))
      ); 
      if(isPlatformBrowser(this.platformId))
        this.init_page(); 
      this.get_circles();
      if(!this.get_token())
      {
        return;
      }
      this.todoservice.get_user_data();
      this.user_notification(this.start);
      this.user_favourites();
     
      this.check_device();
    }  

    region_selected()
    {
      if( localStorage.getItem('region') != null )
      {
        return JSON.parse(localStorage.getItem('region'));
      }
      return 0;
    }

    circle_selected(circle)
    {
      this.region = circle;
      this.productservice.set_region(circle);
     let url = window.location.pathname;
      if(url == url)
      {
        this.router.routeReuseStrategy.shouldReuseRoute = function(){
          return false;
        }
      this.router.navigated = false;
      this.router.navigate([this.href]);
    }  
    }
    get_circles()
    {
      this.todoservice.get_circles({})
      .subscribe(
        data => 
        {
          this.circles = data.CIRCLES;
        }
      )
    }
  open_notifications()
  {
    let script = this._renderer2.createElement('script');
    script.type = `text/javascript`;
    script.id = `notification-script`;
    script.text = `
    $(document).ready(function(){ 
      $('.modal').modal();
      $('#loadmore-modal2').modal('open');
    });  
      `
      this._renderer2.appendChild(this._document.body, script);
  }
  device_registered()
  {
    window.me = this;
    if(window.FirebasePlugin)
    {
      window.FirebasePlugin.getToken(function(fcmToken) {
        window.device_registered_token = fcmToken;
      }, function(error) {
          console.error(error);
      });
    }
  }

  read_notification(item){
    
  }
    check_device()
    {
      if(document.URL.indexOf('android_asset') !== -1)
      {
        this.device_registered();
        if(window.device)
        {
          let data : any ={ device : window.device.uuid,device_token : window.device_registered_token};
          let storeddata = JSON.parse(localStorage.getItem('device'));
          if(storeddata != null)
          { 
            if(storeddata.user)
            {
              return
            }
            else if(this.get_token())
            {
              data.user = this.todoservice.get_user_id();
            }
          } 

          if(this.get_token())
          {
            data.user = this.todoservice.get_user_id();
          }
          
            this.todoservice.check_device(data)
            .subscribe(
              data => 
              {
                if(data.valid == 1)
                {
                  this.valid_for_bonus = true;
                  this._bonus_text = data.amount_text;
                }
                if(data.status == 1 || data.status == 2)
                {
                  localStorage.setItem('device',JSON.stringify(storeddata));
                }
                  
              }
            ) 
            }  
       }
    }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    this.form.get('avatar').setValue(this.croppedImage);
      //console.log(this.croppedImage)
  }
  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
    //console.log(this.imageChangedEvent)
} 
  createForm() {
    this.form = this.fb.group({
      avatar: null
    });
  } 
  
  check_to_replace()
  {
    if(this.router.url === '/')
      return '';
    else
      return 'hide-on-mobile';
  }

  onSubmit() {
    this.disabled = true;
    const formModel = this.prepareSave();
    this.http.post(this.todoservice.base_url+'accounts/apis/home/upload_profile', formModel)
    .subscribe(
      data => {
        
        let response = $.parseJSON(data['_body'])
        if(response.status == true)
        {
          this.toastr.successToastr("Updated Successfully",'Success!');
          let url = window.location.pathname;
          if(url == url)
          {
            this.router.routeReuseStrategy.shouldReuseRoute = function(){
              return false;
            }
          }  
          this.router.navigated = false;
          this.router.navigate([url]);
        }
        else
        {
          this.toastr.errorToastr(response.msg);
        }
      }
  )
  }

  private prepareSave(): any {
    let input = new FormData();
    input.append('avatar', this.form.get('avatar').value);
    input.append('token', this.get_token());
    return input;
  }

  

  login_submit(login,me)
  {
    if(!me)
      me = this;
    if(document.URL.indexOf('android_asset') !== -1)
    {
      login.device = 'android';
      login.device_id = window.device.uuid;
      login.device_registered_token = window.device_registered_token ;
    }
    if(me.login.step == 2)
      {
        var otp1 = $('#header-login #otp1').val();
        var otp2 = $('#header-login #otp2').val();
        var otp3 = $('#header-login #otp3').val();
        var otp4 = $('#header-login #otp4').val();
        login.otp = otp1.toString()+otp2.toString()+otp3.toString()+otp4.toString();
        // login.otp = login.otp1.toString() + login.otp2.toString() + login.otp3.toString() + login.otp4.toString();
        login.phone = me.phone;
        login.password = me.password;
        login.step = 2;
      }
      else
      {
        me.phone = login.phone;
        me.password = login.password;
        if(login.remember == false)
          me.authService.clear_remember();
      }

      if(typeof me.phone == "undefined" || typeof me.password == "undefined")
      {
        me.toastr.errorToastr("Please Enter Valid Details", 'Failed');
        return;
      }
      this.spinner.show();
      $('#login-controller').text('Please Wait...');
      me.authService.dologin(login)
      .subscribe( 
        data => 
        {
          this.spinner.hide();
          $('#login-controller').text('LOGIN');
          me.token_params = data;
          if(typeof data.status != 'undefined' && data.status == true)
          {
            
            this.close_modal(); 
            let user : any = data.user;
            me.login.step = 1;
            me.authService.AccessToken = me.token_params.accessToken;
            me.authService.storage(data,me);
            me.todoservice.set_user_data(user);
            if(window.location.pathname.includes("recharge/for"))
              return;
            
            let url = window.location.pathname;
            if(url == url)
            {
              me.router.routeReuseStrategy.shouldReuseRoute = function(){
                  return false;
              }
              me.router.navigated = false;
              me.router.navigate([this.href]);
              this.init_page();
            }  
          }
          else if(data.status == 'noexist')
          {
            this.action = 2;
            this.phone = me.phone;
            this.checkphonegroup.setValue({phone: this.phone});
            this.toastr.errorToastr(data.message,'Failed');
          } 
          else
          {
            if(typeof data.step != 'undefined' &&  data.step == 'verify')
            {
              if($('[name="next_action"]').length > 0)
              {
                setTimeout(()=>{    //<<<---    using ()=> syntax
                  $('.otp-step #header-login').append('<input type="hidden" name="next_action" value="recharge_init">');
                }, 2000);
              }
              me.login.step = 2;
              me.tick_clock(60);
              // me.watch_sms('login');
            }
            else if(data.status == 'alert')
              me.toastr.errorToastr(data.message,'Alert',{showCloseButton : true,dismiss: 'click'});
            else
              me.toastr.errorToastr(data.message,'Failed');
          }
         // this.spinner.hide();
        }
      )  
  }

  close_modal()
  {
    $('.login-modal-close')[0].click();
    $('.modal-overlay').css('display','none');
    if(window.location.pathname.includes("recharge/for") && $('[name="next_action"]').length > 0)
    {
      if($('.calc-amount-btn').length > 0)
      {
        setTimeout(()=>{    //<<<---    using ()=> syntax
          $('.calc-amount-btn')[0].click();
        }, 500);
      }
      else
      {
        setTimeout(()=>{    //<<<---    using ()=> syntax
          $('button.proceed-to-step2')[0].click();
        }, 500);
      }
      return;
    } 
  }

  watch_sms(section)
  {
      if(window.cordova)
      {
        window.me = this;  
        window.cordova.plugins.AndroidSmsRetriever
        .onSmsReceived(
            
            function successCallback(message) {

                if(message === 'SMS_RETRIEVER_SETUP') {
                    // Here you request server to send the SMS
                    return;
                }
                var otp1 = substring(message,13, 14);
                var otp2 = substring(message,14, 15);
                var otp3 = substring(message,15, 16);
                var otp4 = substring(message,16, 17);
                $('#header-'+section+' #otp1').val(otp1);
                $('#header-'+section+' #otp2').val(otp2);
                $('#header-'+section+' #otp3').val(otp3);
                $('#header-'+section+' #otp4').val(otp4);
                //if()
                  window.me.login_submit(window.me.logingroup.value,window.me);
                function substring(string, start, end) {
                  var result = '',
                      length = Math.min(string.length, end),
                      i = start;
                
                  while (i < length) result += string[i++];
                  return result;
                }   
            },

            function errorCallback(e) {
                console.error(e);
            },

            true //notifyWhenStarted
        );

        // document.addEventListener('onSMSArrive', function(args : any) {
        //   var otp1 = substring(args.message,13, 14);
        //   var otp2 = substring(args.message,14, 15);
        //   var otp3 = substring(args.message,15, 16);
        //   var otp4 = substring(args.message,16, 17);
        //   $('#header-'+section+' #otp1').val(otp1);
        //   $('#header-'+section+' #otp2').val(otp2);
        //   $('#header-'+section+' #otp3').val(otp3);
        //   $('#header-'+section+' #otp4').val(otp4);
        //   //if()
        //     window.me.login_submit(window.me.logingroup.value,window.me);
        //   function substring(string, start, end) {
        //     var result = '',
        //         length = Math.min(string.length, end),
        //         i = start;
          
        //     while (i < length) result += string[i++];
        //     return result;
        //   }  
        // });
      }
  }

  time_ago(time) {
    switch (typeof time) {
      case 'number':
        break;
      case 'string':
        time = +new Date(time);
        break;
      case 'object':
        if (time.constructor === Date) time = time.getTime();
        break;
      default:
        time = +new Date();
    }
    var time_formats = [
      [60, 'seconds', 1], // 60
      [120, '1 minute ago', '1 minute from now'], // 60*2
      [3600, 'minutes', 60], // 60*60, 60
      [7200, '1 hour ago', '1 hour from now'], // 60*60*2
      [86400, 'hours', 3600], // 60*60*24, 60*60
      [172800, 'Yesterday', 'Tomorrow'], // 60*60*24*2
      [604800, 'days', 86400], // 60*60*24*7, 60*60*24
      [1209600, 'Last week', 'Next week'], // 60*60*24*7*4*2
      [2419200, 'weeks', 604800], // 60*60*24*7*4, 60*60*24*7
      [4838400, 'Last month', 'Next month'], // 60*60*24*7*4*2
      [29030400, 'months', 2419200], // 60*60*24*7*4*12, 60*60*24*7*4
      [58060800, 'Last year', 'Next year'], // 60*60*24*7*4*12*2
      [2903040000, 'years', 29030400], // 60*60*24*7*4*12*100, 60*60*24*7*4*12
      [5806080000, 'Last century', 'Next century'], // 60*60*24*7*4*12*100*2
      [58060800000, 'centuries', 2903040000] // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
    ];
    var seconds = (+new Date() - time) / 1000,
      token = 'ago',
      list_choice = 1;
  
    if (seconds < 60) {
      return 'Just now'
    }
    if (seconds < 0) {
      seconds = Math.abs(seconds);
      token = 'from now';
      list_choice = 2;
    }
    var i = 0,
      format;
    while (format = time_formats[i++])
      if (seconds < format[0]) {
        if (typeof format[2] == 'string')
          return format[list_choice];
        else
          return Math.floor(seconds / format[2]) + ' ' + format[1] + ' ' + token;
      }
    return time;
  }
  back_to_login()
  {
    this.login.step = 1;
  }

  resend_otp(section)
  {
    let data : any;
    if(section == 'register')
      data = {phone : this.phone,step : section};
    else
      data = {phone : this.phone, password : this.password};
    
    if(document.URL.indexOf('android_asset') !== -1)
    {
      data.device = 'android';
    }
    this.spinner.show();
    this.todoservice.resend_otp(data)
      .subscribe(
        data => 
        {
          this.spinner.hide();
          if(!jQuery.isEmptyObject(data))
          {
            if(data.status == true)
            {
              this.toastr.successToastr(data.message);
              this.tick_clock(60);
              // this.watch_sms(section);
            }
            else
            {
              this.toastr.errorToastr(data.message);
            }
          }
          //this.spinner.hide();
        }
      ) 
  }
  get_remember()
  {
    let data : any = this.authService.get_remember();
    // data = $.parseJSON(data);
    // if(data != null)
    // {
    //   this.remember.rm = true; 
    //   this.remember.ph = data.ph; 
    //   this.remember.pw = data.pd; 
    // }
  }
  
  // signup_user(formdata)
  // {
  //   if(formdata.user_type == null)
  //     formdata.user_type = 1;
  //   else
  //     this.user_type = formdata.user_type ;  
  //   if(formdata.password != formdata.cpassword)
  //   {
  //     this.toastr.errorToastr("Password does not match with Confirm Password", 'Failed');
  //       return;
  //   }
  //   if(document.URL.indexOf('android_asset') !== -1)
  //   {
  //     formdata.device = 'android';
  //   }
  //   this.phone = formdata.phone;
  //   this.password = formdata.password;
  //   this.signupdisabled = true;
  //   this.todoservice.signup(formdata)
  //     .subscribe(
  //       data => 
  //       {
  //         if(data.status == 'success')
  //         {
  //           this.signupverify = 1;
  //           this.watch_sms('signup');
  //         }
  //         else
  //         {
  //           this.toastr.errorToastr(data.msg, 'Failed');
  //         }
  //         this.signupdisabled = false;
  //       }
  //     ) 
  // }
  verify_user(data,me)
  {
    var otp1 = $('#header-login #otp1').val();
    var otp2 = $('#header-login #otp2').val();
    var otp3 = $('#header-login #otp3').val();
    var otp4 = $('#header-login #otp4').val();
    data.otp = otp1.toString() + otp2.toString() + otp3.toString() + otp4.toString();
    data.phone = this.phone;
    this.verifydisabled = true;
    this.todoservice.verify_user(data)
      .subscribe(
        data => 
        {
          this.verifydisabled = false;
          if(data.status == 'true')
          {
            let store = data.store;
            this.authService.storage(store,this);
            
            $('.login-modal-close')[0].click();
            localStorage.removeItem('favourite');
            setTimeout(()=>{    //<<<---    using ()=> syntax
              this.user_favourites();
            }, 2000);
            
            let url = window.location.pathname;
            if(url == url)
            {
              this.router.routeReuseStrategy.shouldReuseRoute = function(){
                return false;
             }
            this.router.navigated = false;
            this.router.navigate([url]);
            }
          }
          else
          {
            this.toastr.errorToastr(data.msg, 'Failed');
            return;
          }
        }
      ) 
  }

  keytab(event){
    if(event.keyCode == 8 || event.keyCode == 46)
    {
      return;
    }
    let element = event.srcElement.nextElementSibling; // get the sibling element

    if(element == null)  // check if its null
        return;
    else
        element.focus();   // focus if not null
}
    search_me(event)
    {
      let data :any = {};
      data.search = event;
      this.todoservice.get_search_data(data)
      .subscribe(
        data => 
        {
          if(!jQuery.isEmptyObject(data))
          {
            this.filterdList = true;
            this.filteredOptions = data.searches;
            //console.log(this.filteredOptions)
          }
        }
      ) 
    }                                     
  

  user_notification(start)
  {
    this.todoservice.fetch_user_notifications({token: this.get_token(),start: start})
      .subscribe(
        data => 
        {
          if(!jQuery.isEmptyObject(data))
          {
            if(data.status && data.status == 'Invalid Token')
            {
              return;
            }
            
            if(this.notifications.length > 0)
            {
              this.notifications = this.notifications.concat(data.notifications)
            }
            else
            {
              this.notifications = data.notifications;
            }
            if(data.more_enable)
              this.more_display = true;
            else
              this.more_display = false;
            if(isPlatformBrowser(this.platformId))    
              $('#loading-more').remove();

            this.notification_count =  data.notification_count[0];
            this.notifications = this.filter_notification(this.notifications);
            if(this.todoservice.get_param('refer') && this.todoservice.get_param('refer') == 'app-notify' && start == 0)
            {
              this.open_notifications();
            }
          }
        }
      )
  }

  load_more_notification()
  {
    $('#more-display').after('<span id="loading-more">Loading...</span>');
    this.start += 10;
    this.user_notification(this.start);
  }

  filter_notification(notifications)
  {
    if(notifications.length > 0)
    return notifications.filter(option => option.visitor_comment != null);
  }

  notification_read(item)
  {
    this.todoservice.notification_read({token: this.get_token(),id:item.order_id})
      .subscribe(
        data => 
        {
          if(data.status == 0)
          {
            this.user_notification(0)
          }
        }
      )
  }
  route_link(notification)
  {
    if((notification.activity_type == 5 || notification.activity_type == 1) && (notification.seen == 1 || notification.seen == 0))
      return '/dashboard/complaints/'+notification.order_id; 
    else if(notification.activity_type == 1 || notification.activity_type == 15 || notification.activity_type == 17)
      return '/orders/recharge-receipt/'+notification.order_id;
    else if((notification.activity_type == 5 || notification.activity_type == 16 || notification.activity_type == 18) && notification.seen == null )
      return '/product/order-receipt/'+notification.activity_id; 
    else if(notification.activity_type == 6 || notification.activity_type == 7 || notification.activity_type == 8 || notification.activity_type == 14)
      return "/dashboard/transactions"; 
    else if( notification.activity_type == 2 || notification.activity_type == 3 || notification.activity_type == 19)
      return "/dashboard/value-transfer/"+notification.order_id;
    else if( notification.activity_type == 4)
      return "/dashboard/add-money/"+notification.activity_id;  
    return '';
  }
  user_favourites()
  { 
    let favourite :string = localStorage.getItem("favourite");
    if(!favourite)
    {
      this.todoservice.user_favourites({token: this.get_token()})
        .subscribe(
          data => 
          {
            if(!jQuery.isEmptyObject(data))
            {
              if(data.status && data.status == 'Invalid Token')
              {
                return;
              }
              localStorage.setItem('favourite', JSON.stringify(data.favourites));
            }
          }
        )
    }
    else
    {
      let data = JSON.parse(favourite);
      this.favourite_count =  data.count;
    }   
  }

  private _filter(value: string): object {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.title.toLowerCase().indexOf(filterValue) === 0);
  }
  go_to_nav(nav)
  {
    if(1==1)
    {
      this.router.routeReuseStrategy.shouldReuseRoute = function(){
        return false;
      }
    this.router.navigated = false;
    this.router.navigate([nav]);
    }
  }
  get_token()
  {
    return this.authService.auth_token();
  } 
  init_page()
  {
    if (isPlatformBrowser(this.platformId)) {
      if( $(window).width() > 767)
      {
        if($('#snatchbot-script').length > 0)
          $('#snatchbot-script').remove();
        let script1 = this._renderer2.createElement('script');
        script1.type = `text/javascript`;
        script1.id = `snatchbot-script`;
        script1.src = `https://account.snatchbot.me/script.js`;
        this._renderer2.appendChild(this._document.body, script1);
      }
      if($(window).width() > 767)
      {
        if($('#google-translate-script').length > 0)
          $('#google-translate-script').remove();
        let script1 = this._renderer2.createElement('script');
        script1.type = `text/javascript`;
        script1.id = `google-translate-script`;
        script1.src = `https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit`;
        this._renderer2.appendChild(this._document.body, script1);
  
        if($('#google-gtag-script').length > 0)
          $('#google-gtag-script').remove();
        let script2 = this._renderer2.createElement('script');
        script2.type = `text/javascript`;
        script2.id = `google-gtag-script`;
        script2.src = `https://www.googletagmanager.com/gtag/js?id=UA-176715754-1`;
        this._renderer2.appendChild(this._document.body, script2);
        
      }
      if($('#side-nav-script'))
      {
        $('#side-nav-script').remove();
      }
     } 
    
    let script = this._renderer2.createElement('script');
    script.type = `text/javascript`;
    script.id = `side-nav-script`;
    script.text = ` 
    $(document).ready(function(){
      
      $('select').material_select();
      $('.modal').modal();
      //$(".side-menu").swipe( {fingers:1} );
      // $('#mobile-dashboard-menus').lightSlider({
      //   item: 1,
      //   auto: false,
      //   loop: false,
      //   controls: true,
      // });
      $('#loadmore-modal').modal();
      $('#loadmore-modal2').modal();
      $('#mobile-search').on('focus',function(){
        $(this).addClass('no-bg');	
      });
      
      $('#mobile-search').on('blur',function(){
        $(this).removeClass('no-bg');	
        $(this).val('');
      });	
    $('#mobile-bar').on('click',function(e){
		$('.mobile-mask').show();
      $('.side-menu').addClass('open-menu');
      e.stopPropagation();
    });
    
    $(document).on('click',function(e){
      //console.log(e.target);
      if (e.target.id == "mobile-side-menu" || e.target.className == "cdk-overlay-backdrop cdk-overlay-transparent-backdrop" || $(e.target).parents("#mobile-side-menu").length) {
        return false;
      }
      $('.side-menu').removeClass('open-menu');
	  $('.mobile-mask').hide();
    }); 
    //====================mobile js end ===================
      $('.chat-box').on('click', function(){
        $('.chat-box-msg').css('transform','translate(0,0)');
        $('.chat-box').addClass('hide');
      });
      var width = $(window).width();  
      if(width > 767)
      {
        //$(window).scroll(function(){if($(window).scrollTop()>=1){$('.header').addClass('fixed-header')}
        //else{$('.header').removeClass('fixed-header')}});
      }
      
      $('.close-chat').on('click', function(){
        $('.chat-box-msg').css('transform','translate(0,100%)');
        $('.chat-box').removeClass('hide');
      });
      $('.sub-btn').on('click', function(){
        $('.suce-msg-chat').removeClass('hide');
        $('.chat-form').addClass('hide');
      });
      $('#login-modal').modal();
      
      $('.mobile-dropdown-button').dropdown({
        inDuration: 300,
        outDuration: 225, // Does not change width of dropdown to that of the activator
        hover: false, // Activate on hover
        gutter: 0, // Spacing from edge
        belowOrigin: true, // Displays dropdown below the button
        alignment: 'left', // Displays dropdown with edge aligned to the left of button
        stopPropagation: false // Stops event propagation
      }
    );
      $('.dropdown-button').dropdown({
        inDuration: 300,
        outDuration: 225,
        constrainWidth: true, // Does not change width of dropdown to that of the activator
        hover: false, // Activate on hover
        gutter: 0, // Spacing from edge
        belowOrigin: true, // Displays dropdown below the button
        alignment: 'right', // Displays dropdown with edge aligned to the left of button
        stopPropagation: false // Stops event propagation
      }
    );
      $('.logup.modal-trigger').click(function(){
        $('#login-modal').modal('open');
      })
      $('.button-collapse').sideNav({
        menuWidth: 300, // Default is 300
        edge: 'right', // Choose the horizontal origin
        closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
        draggable: true, // Choose whether you can drag to open on touch screens,
      }); 
    })
    
    
  $('.tabs').tabs();
  function googleTranslateElementInit() {
    var width = $(window).width(); 
    if(width > 767)
    {
      if(google && google.translate)
      {
        new google.translate.TranslateElement({pageLanguage: 'en'}, 'google_translate_element');
        setTimeout("set_lang()", 5000);
      }
      else
      {
        setTimeout("googleTranslateElementInit()", 2000);
        setTimeout("set_lang()", 5000);
      }  
    }
  }

  function read_notification(item)
  {
    console.log(item);
  }
  // $('#loadmore-modal, #loadmore-modal2').delegate('.unread-notification','click',function(){
  //   var id = $(this).attr('id');
  //   event.stopPropagation();
  //   $.ajax({
	// 		url: '`+this.todoservice.server_url+`accounts/apis/home/notification_read',
	// 		type: 'post',
	// 		data: {
	// 			id: id
	// 		},
	// 		success: function(data){
	// 			 // console.log(data);
	// 			$('select[name="'+loadName+'"]').html(data).material_select();
	// 		}
	// 	});
  // })
  function set_lang()
  {
    $(".goog-te-combo option[value='my']").remove();
    $(".goog-te-combo option[value='af']").remove();
      $(".goog-te-combo option[value='sq']").remove();
      $(".goog-te-combo option[value='am']").remove();
      $(".goog-te-combo option[value='ar']").remove();
      $(".goog-te-combo option[value='hy']").remove();
      $(".goog-te-combo option[value='az']").remove();
      $(".goog-te-combo option[value='eu']").remove();
      $(".goog-te-combo option[value='be']").remove();
      $(".goog-te-combo option[value='bs']").remove();
      $(".goog-te-combo option[value='bg']").remove();
      $(".goog-te-combo option[value='ca']").remove();
      $(".goog-te-combo option[value='ceb']").remove();
      $(".goog-te-combo option[value='ny']").remove();
      $(".goog-te-combo option[value='zh-CN']").remove();
      $(".goog-te-combo option[value='zh-TW']").remove();
      $(".goog-te-combo option[value='co']").remove();
      $(".goog-te-combo option[value='hr']").remove();
      $(".goog-te-combo option[value='cs']").remove();
      $(".goog-te-combo option[value='da']").remove();
      $(".goog-te-combo option[value='nl']").remove();
      $(".goog-te-combo option[value='eo']").remove();
      $(".goog-te-combo option[value='et']").remove();
      $(".goog-te-combo option[value='tl']").remove();
      $(".goog-te-combo option[value='fi']").remove();
      $(".goog-te-combo option[value='fr']").remove();
      $(".goog-te-combo option[value='fy']").remove();
      $(".goog-te-combo option[value='gl']").remove();
      $(".goog-te-combo option[value='ka']").remove();
      $(".goog-te-combo option[value='de']").remove();
      $(".goog-te-combo option[value='el']").remove();
      $(".goog-te-combo option[value='ht']").remove();
      $(".goog-te-combo option[value='ha']").remove();
      $(".goog-te-combo option[value='haw']").remove();
      $(".goog-te-combo option[value='iw']").remove();
      $(".goog-te-combo option[value='hmn']").remove();
      $(".goog-te-combo option[value='hu']").remove();
      $(".goog-te-combo option[value='is']").remove();
      $(".goog-te-combo option[value='ig']").remove();
      $(".goog-te-combo option[value='id']").remove();
      $(".goog-te-combo option[value='ga']").remove();
      $(".goog-te-combo option[value='it']").remove();
      $(".goog-te-combo option[value='ja']").remove();
      $(".goog-te-combo option[value='jw']").remove();
      $(".goog-te-combo option[value='kn']").remove();
      $(".goog-te-combo option[value='kk']").remove();
      $(".goog-te-combo option[value='km']").remove();
      $(".goog-te-combo option[value='ko']").remove();
      $(".goog-te-combo option[value='ku']").remove();
      $(".goog-te-combo option[value='ky']").remove();
      $(".goog-te-combo option[value='lo']").remove();
      $(".goog-te-combo option[value='la']").remove();
      $(".goog-te-combo option[value='lv']").remove();
      $(".goog-te-combo option[value='lt']").remove();
      $(".goog-te-combo option[value='lb']").remove();
      $(".goog-te-combo option[value='mk']").remove();
      $(".goog-te-combo option[value='mg']").remove();
      $(".goog-te-combo option[value='ms']").remove();
      $(".goog-te-combo option[value='mt']").remove();
      $(".goog-te-combo option[value='mi']").remove();
      $(".goog-te-combo option[value='no']").remove();
      $(".goog-te-combo option[value='ps']").remove();
      $(".goog-te-combo option[value='fa']").remove();
      $(".goog-te-combo option[value='pl']").remove();
      $(".goog-te-combo option[value='pt']").remove();
      $(".goog-te-combo option[value='ro']").remove();
      $(".goog-te-combo option[value='ru']").remove();
      $(".goog-te-combo option[value='sm']").remove();
      $(".goog-te-combo option[value='gd']").remove();
      $(".goog-te-combo option[value='sr']").remove();
      $(".goog-te-combo option[value='st']").remove();
      $(".goog-te-combo option[value='sn']").remove();
      $(".goog-te-combo option[value='sd']").remove();
      $(".goog-te-combo option[value='si']").remove();
      $(".goog-te-combo option[value='sk']").remove();
      $(".goog-te-combo option[value='sl']").remove();
      $(".goog-te-combo option[value='es']").remove();
      $(".goog-te-combo option[value='su']").remove();
      $(".goog-te-combo option[value='sw']").remove();
      $(".goog-te-combo option[value='sv']").remove();
      $(".goog-te-combo option[value='tg']").remove();
      $(".goog-te-combo option[value='th']").remove();
      $(".goog-te-combo option[value='tr']").remove();
      $(".goog-te-combo option[value='uk']").remove();
      $(".goog-te-combo option[value='uz']").remove();
      $(".goog-te-combo option[value='vi']").remove();
      $(".goog-te-combo option[value='cy']").remove();
      $(".goog-te-combo option[value='xh']").remove();
      $(".goog-te-combo option[value='yi']").remove();
      $(".goog-te-combo option[value='yo']").remove();
      $(".goog-te-combo option[value='zu']").remove();
  }
  setTimeout("googleTranslateElementInit()", 2000);
  var i = 0;
  function openchat()
  {
    if($('#sntch_iframe').length == 0 && i <= 10)
    {
      setTimeout("openchat()", 2000);
    }
    else
    {
      window.sntchChat.Init(70574);
      setTimeout("$('#sntch_webchat').css('width','350px');$('#sntch_iframe')[0].setAttribute('style', 'width:350px; height:425px; border:0');$('#sntch_webchat').css('height','400')", 5000); 
    }
    i++;
  }
  var width = $(window).width(); 
  if(width > 767)
    openchat();
  //setTimeout("$('#sntch_webchat').attr('style','background-color: rgb(255, 255, 255); width: 450x; height: 500px; position: fixed; bottom: 10px; right: 10px; max-height: 100%; max-width: 100%; z-index: 2147483647; transform: translateY(0px); transition: transform 0.5s ease 0s; border-radius: 20px 20px 0px 0px; overflow: hidden; box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;');$('#sntch_iframe')[0].setAttribute('style', 'width:450px; height:500px; border:0');", 4500);
  // (function () {
  // $.getScript("https://connect.facebook.net/en_US/all.js#xfbml=1", function () {
  //       FB.init({ appId: '1346509102168933', status: true, cookie: true, xfbml: true });
  //   });
  // })();
//   (function () {
//     var options = {
//         whatsapp: "+918010339339", // WhatsApp number
//         call_to_action: "Message us", // Call to action
//         position: "left", // Position may be 'right' or 'left'
//     };
//     var proto = document.location.protocol, host = "whatshelp.io", url = proto + "//static." + host;
//     var s = document.createElement('script'); s.type = 'text/javascript'; s.async = true; s.src = url + '/widget-send-button/js/init.js';
//     s.onload = function () { WhWidgetSendButton.init(host, proto, options); };
//     var x = document.getElementsByTagName('script')[0]; x.parentNode.insertBefore(s, x);
// })();
    // (function(h,o,t,j,a,r){
    //     h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
    //     h._hjSettings={hjid:1408142,hjsv:6};
    //     a=o.getElementsByTagName('head')[0];
    //     r=o.createElement('script');r.async=1;
    //     r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
    //     a.appendChild(r);
    // })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
  
    <!-- Global site tag (gtag.js) - Google Analytics -->
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'UA-176715754-1');
    `;
    this._renderer2.appendChild(this._document.body, script);
  }

  tick_clock(tick)
  {
    if(tick == 0)
      return;
    this.tick = tick - 1;
    setTimeout(() => {
          this.tick_clock(this.tick); 
        }, 1000);
  }

  open_chat()
  {
    $('#sntch_button').click();
  }

  check_null(string)
  {
    if(string != null && string.length > 0 )
      var a = true;
    else
      var a = false;
    return a;    
  }
}

