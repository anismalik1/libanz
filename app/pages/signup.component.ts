import { Component, OnInit ,ViewContainerRef} from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Meta ,Title} from '@angular/platform-browser';
import { TodoService } from '../todo.service';
import { AuthService } from '../auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { User } from '../user';
import { Router ,ActivatedRoute} from '@angular/router'
import * as $ from 'jquery';
declare var window: any;
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styles: [],
  providers: [TodoService,User,AuthService]
})
export class SignupComponent implements OnInit{

  user_type : number = 1;
  user_type_enabled : boolean = true;
  verify : number = 0;
  phone : number;
  password : string;
  name : string;
  signupgroup : FormGroup;
  post :any;
  referer :string = '';
  signupverify : number = 0
  signupdisabled : boolean = false;
  verifydisabled : boolean = false;
  page :string =  "/signup";
  plans_data : any ;
  plan_codes : any ;
  days       : number = 15;
  selected_plans : any;
  _bonus_offer : any;
  constructor(private toast: ToastrManager, 
    private fb : FormBuilder,
    public todoservice : TodoService,
    private meta : Meta,
    private title : Title,
    private route : ActivatedRoute,
    private spinner : NgxSpinnerService,
    private authservice : AuthService,
    vcr: ViewContainerRef,
    private router : Router) {
    this.referer = String(this.todoservice.get_param('ref'));
    if(this.referer && this.referer == 'merchant')
      this.page = "merchant-signup";
    this.user_type = route.snapshot.params['id'];
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

    }
  ngOnInit() {
    if(this.get_token())
    {
      this.router.navigate(['/']);
    }
    this.fetch_page_data();
    if(this.todoservice.get_param('bonus') == '1')
    {
      this.check_device()
    }
  }

  check_device()
    {
      let data : any ={device : 'kdhakshd'};
      
      // if(document.URL.indexOf('android_asset') !== -1)
      // {
        this.todoservice.check_device(data)
        .subscribe(
          data => 
          {
            if(data.valid == 1)
            {
              this._bonus_offer = data;
            } 
          }
        ) 
      // }
      
    }

  fetch_page_data()
 {
  let page = {page : this.page}; 
  if(page.page == '')
  {
      return false;
  }
  this.todoservice.fetch_page_data(page)
    .subscribe(
      data => 
      {
        if(data.PAGEDATA)
        { 
          this.todoservice.set_page_data(data.PAGEDATA[0]);
          $('#page-content').html(this.todoservice.get_page().description);
          this.meta.addTag({ name: 'description', content: this.todoservice.get_page().metaDesc });
          this.meta.addTag({ name: 'keywords', content: this.todoservice.get_page().metaKeyword });
          this.title.setTitle(this.todoservice.get_page().metaTitle);
          window.scroll(0,0);
        }
        this.spinner.hide();  
      }
    ) 
 }

 change_plan(days)
  {
    this.days = days;
    this.selected_plans = this.plans_data.filter(x => x.days == days);
    if(this.selected_plans.length == 0)
      return false;
       
    setTimeout(()=>{    //<<<---    using ()=> syntax
      for(var i = 0;i < this.selected_plans.length;i++)
      {
        $('#plan-rate-'+this.selected_plans[i].plan_code).text(this.selected_plans[i].price);
        $('#plan-leads-'+this.selected_plans[i].plan_code).text('Number of leads '+this.selected_plans[i].leads_no);
        $('#plan-days-'+this.selected_plans[i].plan_code).text('Valid for '+this.selected_plans[i].days+' days');
      }
 }, 2000);
    
  }

  set_user_type(user_type)
  {
    this.user_type_enabled = true;
    this.user_type = user_type;
  }
  back_signup_form()
  {
    this.user_type_enabled = false;
    this.user_type = undefined;
  }

  resend_otp()
  {
    this.spinner.show();
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
              this.toast.successToastr(data.message);
              this.watch_sms('signup');
            }
            else
            {
              this.toast.errorToastr(data.message);
            }
          }
          this.spinner.hide();
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
      this.toast.errorToastr("Password does not match with Confirm Password", 'Failed');
        return false;
    }
    this.phone = formdata.phone;
    this.password = formdata.password;
    this.signupdisabled = true; 
    if(document.URL.indexOf('android_asset') !== -1)
    {
      formdata.device = 'android';
      
    }
    if(this._bonus_offer.valid)
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
            this.watch_sms('signup');
          }
          else
          {
            this.toast.successToastr(data.msg, 'Failed');
          }
          this.signupdisabled = false; 
        }
      ) 
  }
  verify_user(data,me)
  {
    if(!me)
      me = this;

      var otp1 = $('#header-signup #otp1').val();
      var otp2 = $('#header-signup #otp2').val();
      var otp3 = $('#header-signup #otp3').val();
      var otp4 = $('#header-signup #otp4').val();  
      data.otp = otp1.toString() + otp2.toString() + otp3.toString() + otp4.toString();
    data.phone = me.phone;
    me.verifydisabled = true;
    me.todoservice.verify_user(data)
      .subscribe(
        data => 
        {
          me.verifydisabled = false;
          if(data.status == 'true')
          {
            let store = data.store;
            me.authservice.storage(store,me);
            var width = $(window).width(); 
            if(width > 767)
            {
              me.router.navigate(['/home']);
            }
            else
            {
              me.router.navigate(['/mhome']);
            }
          }
          else
          {
            me.toast.errorToastr(data.msg, 'Failed');
            return false;
          }
        }
      ) 
  }

  watch_sms(section)
  {
      if(window.SMSReceive)
      {
        window.me = this;
        window.SMSReceive.stopWatch(function() {
          console.log('stopped');
        }, function() {
        });
        window.SMSReceive.startWatch(function() {
          console.log('started');
        }, function() {
        });
        document.addEventListener('onSMSArrive', function(args : any) {
          var otp1 = substring(args.data.body,13, 14);
          var otp2 = substring(args.data.body,14, 15);
          var otp3 = substring(args.data.body,15, 16);
          var otp4 = substring(args.data.body,16, 17);
          $('#header-'+section+' #otp1').val(otp1);
          $('#header-'+section+' #otp2').val(otp2);
          $('#header-'+section+' #otp3').val(otp3);
          $('#header-'+section+' #otp4').val(otp4); 
          window.me.verify_user(window.me.signupgroup.value,window.me)
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
  get_token()
  {
    return this.authservice.auth_token();
  }
}

