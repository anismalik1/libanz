import { Component, OnInit,Input,ViewContainerRef,Renderer2,Inject } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms'
import { DOCUMENT } from "@angular/platform-browser";
import { map, startWith} from 'rxjs/operators';
import { AuthService } from '../../auth.service';
import { TodoService } from '../../todo.service';
import { ProductService } from '../../product.service';
import { Observable} from 'rxjs';
import { Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Authparams } from '../../authparams';
import { User } from '../../user';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers : [ProductService,TodoService,User]
})
export class HeaderComponent implements OnInit{
  myControl = new FormControl();
  //@Input() baseUrl;
  logingroup : FormGroup;
  signupgroup : FormGroup;
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
  options: any = [{ title: 'One',id:1},{title:  'Two',id:2},{title: 'Three',id:3}];
  filteredOptions: Observable<object>;
  filterdList : boolean = false;
  constructor(
    private _renderer2: Renderer2,  
    @Inject(DOCUMENT) private _document,  
    private authService : AuthService,
    public todoservice : TodoService,
    public productservice : ProductService,
    private toastr : ToastsManager,
    private vcr: ViewContainerRef,
    private router : Router,
    private fb: FormBuilder
  ) 
    {
      this.toastr.setRootViewContainerRef(vcr);
      this.productservice.cartItemsCount();
      this.logingroup = fb.group({
        'phone' : [null,Validators.compose([Validators.required])],
        'password' : [null,Validators.compose([Validators.required])],
        'remember' : [null],
      });
      this.signupgroup = fb.group({
        'name':[null,Validators.required],
        'phone' : [null,Validators.compose([Validators.required])],
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
        this.toastr.error("Please Enter Valid Details", 'Failed');
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
            
            let user : any = data.user;
            this.step = 1;
            this.authService.AccessToken = this.token_params.accessToken;
            this.authService.storage(data);
            this.todoservice.set_user_data(user);
            $('.login-modal-close').click();
            let url = window.location.pathname+window.location.hash
            if(url == '/home' || url == '' || url == '/' || url == "/home%23login")
            {
              this.router.routeReuseStrategy.shouldReuseRoute = function(){
                return false;
             }
            this.router.navigated = false;
              this.router.navigate(['/home#login']);
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
              this.toastr.error(data.message, 'Oops!');
            }
          }
         // this.spinner.hide();
        }
      )  
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
              this.toastr.success(data.message);
            }
            else
            {
              this.toastr.error(data.message);
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

  signup_form(type)
  {
    this.user_type = type;
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
    if(formdata.password != formdata.cpassword)
    {
      this.toastr.error("Password does not match with Confirm Password", 'Failed');
        return false;
    }
    this.phone = formdata.phone;
    formdata.user_type = this.user_type;
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
            this.toastr.error(data.msg, 'Failed');
            return false;
          }
        }
      ) 
  }
  verify_user(data)
  {
    data.otp = data.otp1.toString() + data.otp2.toString() + data.otp3.toString() + data.otp4.toString();
    data.phone = this.phone;
    this.todoservice.verify_user(data)
      .subscribe(
        data => 
        {
          if(data.status == 'true')
          {
            let store = data.store;
            this.authService.storage(store);
            let user : any = data.user;
            this.todoservice.set_user_data(user);
            $('.login-modal-close').click();
          }
          else
          {
            this.toastr.error(data.msg, 'Failed');
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
          }
        }
      ) 
    }                                     
  ngOnInit()
  {                                     
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    ); 
    this.init_page(); 
    this.todoservice.get_user_data();
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
    let script = this._renderer2.createElement('script');
    script.type = `text/javascript`;
    script.id = `side-nav-script`;
    script.text = `
    $(document).ready(function(){
      $('#login-modal').modal();
      $('.logup.modal-trigger').click(function(){
        $('#login-modal').modal('open');
      })
      $('.login-modal-close').click(function(){
        $('#login-modal').modal('close');
      })
    })
    
    $('.button-collapse').sideNav({
      menuWidth: 300, // Default is 300
      edge: 'right', // Choose the horizontal origin
      closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
      draggable: true, // Choose whether you can drag to open on touch screens,
    }); 
  $('.tabs').tabs();
  (function () {
    var options = {
        whatsapp: "+918010339339", // WhatsApp number
        call_to_action: "Message us", // Call to action
        position: "right", // Position may be 'right' or 'left'
    };
    var proto = document.location.protocol, host = "whatshelp.io", url = proto + "//static." + host;
    var s = document.createElement('script'); s.type = 'text/javascript'; s.async = true; s.src = url + '/widget-send-button/js/init.js';
    s.onload = function () { WhWidgetSendButton.init(host, proto, options); };
    var x = document.getElementsByTagName('script')[0]; x.parentNode.insertBefore(s, x);
})();
    `;
    this._renderer2.appendChild(this._document.body, script);
  }
}

