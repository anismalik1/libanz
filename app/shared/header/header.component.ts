	import { Component, OnInit,Input,ViewContainerRef,Renderer2,Inject } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms'
import { DOCUMENT } from "@angular/common";
import { map, startWith} from 'rxjs/operators';
import { AuthService } from '../../auth.service';
import { TodoService } from '../../todo.service';
import { ProductService } from '../../product.service';
import { Observable} from 'rxjs';
import { Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Authparams } from '../../authparams';
import { User } from '../../user';

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
  constructor(
    private _renderer2: Renderer2,  
    @Inject(DOCUMENT) private _document,  
    private authService : AuthService,
    public todoservice : TodoService,
    public productservice : ProductService,
    private toastr : ToastrManager,
    private vcr: ViewContainerRef,
    private router : Router,
    private fb: FormBuilder
  ) 
    {
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
    }
  login_submit(login)
  {
    if(this.step == 2)
      {
        login.otp = login.otp1.toString() + login.otp2.toString() + login.otp3.toString() + login.otp4.toString();
        login.phone = this.phone;
        login.password = this.password;
        login.step = 2;
      }
      else
      {
        this.phone = login.phone;
        this.password = login.password;
        if(login.remember == false)
          this.authService.clear_remember();
      }

      if(typeof this.phone == "undefined" || typeof this.password == "undefined")
      {
        this.toastr.errorToastr("Please Enter Valid Details", 'Failed');
        return false;
      }
      //this.spinner.show();
      $('#login-controller').text('Please Wait...');
      this.authService.dologin(login)
      .subscribe(
        data => 
        {
          $('#login-controller').text('LOGIN');
          this.token_params = data;
          if(typeof data.status != 'undefined' && data.status == true)
          {
            $('.modal-close').click();
            $('.modal-overlay').css('display','none');
            let user : any = data.user;
            this.step = 1;
            this.authService.AccessToken = this.token_params.accessToken;
            this.authService.storage(data);
            this.todoservice.set_user_data(user);
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
            if(typeof data.step != 'undefined' &&  data.step == 'verify')
            {
              this.step = 2;
            }
            else
            {
              this.toastr.errorToastr(data.message, 'Oops!');
            }
          }
         // this.spinner.hide();
        }
      )  
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

  resend_otp()
  {
    //this.spinner.show();
    let data : any = {phone : this.phone, password : this.password};
    this.todoservice.resend_otp(data)
      .subscribe(
        data => 
        {
          let b = JSON.stringify(data);
          data =  JSON.parse(b.replace(/\\/g, ''));
          if(!jQuery.isEmptyObject(data))
          {
            if(data.status == true)
            {
              this.toastr.successToastr(data.message);
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
    data.otp = data.otp1.toString() + data.otp2.toString() + data.otp3.toString() + data.otp4.toString();
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
            this.authService.storage(store);
            
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
  ngOnInit()
  {  
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
    this.user_favourites()
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
  get_token()
  {
    return this.authService.auth_token();
  } 
  init_page()
  {
    if($('#side-nav-script'))
    {
      $('#side-nav-script').remove();
    }

    if($('#snatchbot-script') && $(window).width() > 767)
    {
      $('#snatchbot-script').remove();
      let script1 = this._renderer2.createElement('script');
      script1.type = `text/javascript`;
      script1.id = `snatchbot-script`;
      script1.src = `https://account.snatchbot.me/script.js`;
      this._renderer2.appendChild(this._document.body, script1);
    }
    if($('#translater-script'))
    {
      $('#translater-script').remove();
      let script1 = this._renderer2.createElement('script');
      script1.type = `text/javascript`;
      script1.id = `translater-script`;
      script1.src = `//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit`;
      this._renderer2.appendChild(this._document.body, script1);
    }
    let script = this._renderer2.createElement('script');
    script.type = `text/javascript`;
    script.id = `side-nav-script`;
    script.text = `
        
    $(document).ready(function(){
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
    
    $(document).on('click',function(){
      $('.side-menu').removeClass('open-menu');
	  $('.mobile-mask').hide();
    });
    //====================mobile js end ===================
      $('.chat-box').on('click', function(){
        $('.chat-box-msg').css('transform','translate(0,0)');
        $('.chat-box').addClass('hide');
      });
      $(window).scroll(function(){if($(window).scrollTop()>=500){$('.header').addClass('fixed-header')}
      else{$('.header').removeClass('fixed-header')}});
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
    if(typeof google != 'undefined')
      new google.translate.TranslateElement({pageLanguage: 'en'}, 'google_translate_element');
    else
      setTimeout("googleTranslateElementInit()", 1000);  
  }
  setTimeout("googleTranslateElementInit()", 1000);
  function openchat()
  {
    if(!window.sntchChat)
    {
      setTimeout("openchat()", 1000);
    }
    else
    {
      window.sntchChat.Init(70574);
      setTimeout("$('#sntch_webchat').css('width','350px');$('#sntch_iframe')[0].setAttribute('style', 'width:350px; height:425px; border:0');$('#sntch_webchat').css('height','400')", 5000);
    }
  }
  openchat();
  //setTimeout("$('#sntch_webchat').attr('style','background-color: rgb(255, 255, 255); width: 450x; height: 500px; position: fixed; bottom: 10px; right: 10px; max-height: 100%; max-width: 100%; z-index: 2147483647; transform: translateY(0px); transition: transform 0.5s ease 0s; border-radius: 20px 20px 0px 0px; overflow: hidden; box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;');$('#sntch_iframe')[0].setAttribute('style', 'width:450px; height:500px; border:0');", 4500);
  (function () {
  $.getScript("https://connect.facebook.net/en_US/all.js#xfbml=1", function () {
        FB.init({ appId: '1346509102168933', status: true, cookie: true, xfbml: true });
    });
  })();
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


