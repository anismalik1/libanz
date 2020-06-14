import { Component, OnInit,Input,ViewContainerRef,Renderer2,Inject} from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms'
import { DOCUMENT } from "@angular/common";
import { map, startWith} from 'rxjs/operators';
import { Http } from '@angular/http';
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
declare var window: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  providers : [ProductService,TodoService,User]
})
export class HeaderComponent implements OnInit{
  myControl = new FormControl();
  logingroup : FormGroup;
  signupgroup : FormGroup;
  href : string;
  start : number = 0;
  more_display : boolean = true;
  signupdisabled : boolean= false; 
  verifydisabled : boolean= false; 
  imageChangedEvent: any = '';
  croppedImage: any = '';
  form: FormGroup;
  disabled : boolean = false;
  private watch  : Number = 0;
  remember : any = {rm:false,ph:'',pw : ''};
    private token_params : Authparams;
    public phone : number;
    public phone1 : string;
    public password : string;
    public otp : number;
    public step : number = 1; 
    public signup : number = 0; 
    public otp1 : string;
    public otp2: string;
    public otp3: string;
    public otp4 : string;
    public tick : number = 0;
    private user_type : number;
    private verify : number;
    public signupverify : number = 0;
    public notifications : any = {};
    public notification_count : Number;
    public favourites : any;
    public favourite_count : number;
  options: any = [{ title: 'One',id:1},{title:  'Two',id:2},{title: 'Three',id:3}];
  filteredOptions: Observable<object>;
  filterdList : boolean = false;
  valid_for_bonus : boolean= false;
  _bonus_text : any ;
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
    private http : Http
  ) 
    {
      this.check_device();
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
      this.productservice.cartItemsCount();
      this.logingroup = fb.group({
        'phone' : [null,Validators.compose([Validators.required])],
        'password' : [null,Validators.compose([Validators.required])],
        'remember' : [null],
      });
      this.signupgroup = fb.group({
        'name':[null,Validators.required],
        'phone' : [null,Validators.compose([Validators.required,Validators.pattern("[0-9]{10}")])],
        'email' : [null,Validators.compose([
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')])],
        'user_type':[null],
        'password' : [null,Validators.compose([Validators.required])],
        'cpassword' : [null,Validators.compose([Validators.required])],
      });
      this.get_remember();
      this.createForm();
    }
    ngOnInit()
    { 
      
      this.todoservice.createOnline$().subscribe(isOnline => 
        {
          if(isOnline == false)
          {
            alert("You Are Offine.");
            return false;
          }
        } 
        );  
      if(document.URL.indexOf('android_asset') !== -1)
      {
        if(!window.cordova)
        {
          let script1 = this._renderer2.createElement('script');
          script1.type = `text/javascript`;
          script1.id = `cordova-js`;
          script1.src = `cordova.js`;
          this._renderer2.appendChild(this._document.body, script1);
        }
        
      }
      

      this.href = this.router.url;
      //console.log(this.href);                                   
      this.filteredOptions = this.myControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value))
      ); 
      this.init_page(); 
      
      if(!this.get_token())
      {
        return false;
      }
      this.todoservice.get_user_data();
      this.user_notification(this.start);
      this.user_favourites();
      
    }  

    check_device()
    {
      if(document.URL.indexOf('android_asset') !== -1)
      {
        if(window.device)
        {
          let data : any ={ device : window.device.uuid};
          let storeddata = JSON.parse(localStorage.getItem('device'));
          if(storeddata != null)
          { 
            if(storeddata.user)
            {
              return false
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
    if(this.router.url.includes('mhome') || this.router.url.includes('home'))
      return '';
    else
      return 'hide-on-mobile';
  }

  onSubmit() {
    this.disabled = true;
    const formModel = this.prepareSave();
    this.http.post('https://www.mydthshop.com/accounts/apis/home/upload_profile', formModel)
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
    }
    if(me.step == 2)
      {
        var otp1 = $('#header-login #otp1').val();
        var otp2 = $('#header-login #otp2').val();
        var otp3 = $('#header-login #otp3').val();
        var otp4 = $('#header-login #otp4').val();
        console.log(otp1);
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
        return false;
      }
      //me.spinner.show();
      $('#login-controller').text('Please Wait...');
      me.authService.dologin(login)
      .subscribe(
        data => 
        {
          $('#login-controller').text('LOGIN');
          me.token_params = data;
          if(typeof data.status != 'undefined' && data.status == true)
          {
            $('.modal-close').click();
            $('.modal-overlay').css('display','none');
            let user : any = data.user;
            me.step = 1;
            me.authService.AccessToken = me.token_params.accessToken;
            me.authService.storage(data,me);
            me.todoservice.set_user_data(user);
            let url = window.location.pathname;
            if(url == url)
            {
              me.router.routeReuseStrategy.shouldReuseRoute = function(){
                return false;
             }
            //console.log(url) 
            me.router.navigated = false;
            me.router.navigate([me.todoservice.get_urls().currnetURL]);
            }
          }
          else  
          {
            if(typeof data.step != 'undefined' &&  data.step == 'verify')
            {
              me.step = 2;
              me.tick_clock(60);
              me.watch_sms('login');
            }
            else
            {
              me.toastr.errorToastr(data.message, 'Oops!');
            }
          }
         // this.spinner.hide();
        }
      )  
  }

  watch_sms(section)
  {
      if(window.SMSRetriever)
      {
        window.me = this;  
        // window.SMSRetriever.stopWatch(function() {
        //   console.log('stopped');
        // }, function() {
        // });
        window.SMSRetriever.startWatch(function() {
            console.log('started');
          }, function() {
          });
          this.watch = 1;
        document.addEventListener('onSMSArrive', function(args : any) {
          var otp1 = substring(args.message,13, 14);
          var otp2 = substring(args.message,14, 15);
          var otp3 = substring(args.message,15, 16);
          var otp4 = substring(args.message,16, 17);
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
        });
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
    this.step = 1;
  }

  resend_otp(section)
  {
    let data : any = {phone : this.phone, password : this.password};
    if(document.URL.indexOf('android_asset') !== -1)
    {
      data.device = 'android';
    }
    this.todoservice.resend_otp(data)
      .subscribe(
        data => 
        {
          if(!jQuery.isEmptyObject(data))
          {
            if(data.status == true)
            {
              this.toastr.successToastr(data.message);
              this.tick_clock(60);
              this.watch_sms(section);
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
    data = $.parseJSON(data);
    if(data != null)
    {
      this.remember.rm = true; 
      this.remember.ph = data.ph; 
      this.remember.pw = data.pd; 
    }
  }

  signup_form()
  {
    this.signup = 1;
  }
  
  hide_signup_form()
  {
    this.signup = 0;
  }
  hide_otp_form()
  {
    this.signupverify = 0;
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
        return false;
    }
    if(document.URL.indexOf('android_asset') !== -1)
    {
      formdata.device = 'android';
    }
    this.phone = formdata.phone;
    this.password = formdata.password;
    this.signupdisabled = true;
    this.todoservice.signup(formdata)
      .subscribe(
        data => 
        {
          if(data.status == 'success')
          {
            this.signupverify = 1;
            this.watch_sms('signup');
          }
          else
          {
            this.toastr.errorToastr(data.msg, 'Failed');
          }
          this.signupdisabled = false;
        }
      ) 
  }
  verify_user(data)
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
            
            $('.login-modal-close').click();
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
            return false;
          }
        }
      ) 
  }

  keytab(event){
    if(event.keyCode == 8 || event.keyCode == 46)
    {
      return false;
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
              return false;
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
            $('#loading-more').remove();

            this.notification_count =  data.notification_count[0];
            this.notifications = this.filter_notification(this.notifications);
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
                return false;
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
    if($('#snatchbot-script') && $(window).width() > 767)
    {
      $('#snatchbot-script').remove();
      let script1 = this._renderer2.createElement('script');
      script1.type = `text/javascript`;
      script1.id = `snatchbot-script`;
      script1.src = `https://account.snatchbot.me/script.js`;
      this._renderer2.appendChild(this._document.body, script1);
    }
    if($('#side-nav-script'))
    {
      $('#side-nav-script').remove();
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
        $(window).scroll(function(){if($(window).scrollTop()>=1){$('.header').addClass('fixed-header')}
        else{$('.header').removeClass('fixed-header')}});
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
    })
    
    $('.button-collapse').sideNav({
      menuWidth: 300, // Default is 300
      edge: 'right', // Choose the horizontal origin
      closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
      draggable: true, // Choose whether you can drag to open on touch screens,
    }); 
  $('.tabs').tabs();
  function googleTranslateElementInit() {
    var width = $(window).width(); 
    if(width <= 767)
    {
      return false;
    }
    if(google != 'undefined')
      new google.translate.TranslateElement({pageLanguage: 'en'}, 'google_translate_element');
    else
      setTimeout("googleTranslateElementInit()", 1000);
      setTimeout("set_lang()", 5000);
  }
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
  function openchat()
  {
    if(!window.sntchChat)
    {
      setTimeout("openchat()", 1000);
    }
    else
    {
      window.sntchChat.Init(70574);
      if($('#sntch_iframe').length > 0)
        setTimeout("$('#sntch_webchat').css('width','350px');$('#sntch_iframe')[0].setAttribute('style', 'width:350px; height:425px; border:0');$('#sntch_webchat').css('height','400')", 5000);
    }
  }
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
    `;
    this._renderer2.appendChild(this._document.body, script);
  }

  tick_clock(tick)
  {
    if(tick == 0)
      return false;
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

