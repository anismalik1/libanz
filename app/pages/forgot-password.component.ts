import { Component, OnInit ,ViewContainerRef} from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { TodoService } from '../todo.service';
import { AuthService } from '../auth.service';
import { User } from '../user';
import { Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
declare var window : any;
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: [],
  providers: [TodoService,User,AuthService]
})
export class ForgotPasswordComponent implements OnInit{
  public proceedresetgroup : FormGroup;
  public phone : string;
  public password : string;
  public step : number = 1;
  public tick : number;
  private pin : Number;
  back_to_login : boolean = false;
  public resetgroup : FormGroup;
  constructor( public todoservice : TodoService,
              private authservice : AuthService,
              private router : Router,
              private toast : ToastrManager,
              private vcr: ViewContainerRef,
              private fb: FormBuilder,
  ) {
    this.resetgroup = fb.group({
      'password' : [null,Validators.compose([Validators.required])],
       'cpassword' : [null,Validators.compose([Validators.required])]
     });
     this.proceedresetgroup = fb.group({
      'phone' : [null,Validators.compose([Validators.required,Validators.pattern("[0-9]{10}")])],
      'pin'   : [null]
     });
   }
  
  ngOnInit() {
    
  }
  
  process_to_reset(data,me)
  {
    if(!me)
      me = this;
    if(data.phone == '')
    {
      this.toast.errorToastr("Enter Registered Phone");
      return false;
    }
    this.phone = data.phone;
    data.step =  this.step;
    if(data.pin)
      this.pin = data.pin
    if(document.URL.indexOf('android_asset') !== -1)
    {
      data.device = 'android';
    }
      this.todoservice.proceed_to_reset(data)
      .subscribe(
        data => 
        {
          if(data.status == true)
          {
            this.step = data.step;
            if(this.step == 2)
              this.watch_sms();
            this.tick_clock(60);
          }
          else
          {
            this.toast.errorToastr(data.msg);
          }
        }
      )  
  }

  watch_sms()
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
      console.log(window);
      document.addEventListener('onSMSArrive', function(args : any) {
        var otp = substring(args.data.body,13, 17);
        console.log("enter");
        console.log(window);
        window.me.proceedresetgroup.controls['pin'].setValue(otp);
        //$('#proceed-reset-form #proceed-submit').click();
        window.me.process_to_reset(window.me.proceedresetgroup.value,window.me);
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

  tick_clock(tick)
  {
    if(tick == 0)
      return false;
    this.tick = tick - 1;
    setTimeout(() => {
          this.tick_clock(this.tick); 
        }, 1000);
  }

  resend_otp()
  {
    var data = {phone : this.phone};
    this.process_to_reset(data,this)
  }
  reset_password(form)
  {
    form.phone = this.phone;
    form.pin  = this.pin;
    if(form.password != form.cpassword)
    {
      this.toast.errorToastr('Confirm password must be same.');
      return false;
    }
    this.todoservice.reset_password(form)
      .subscribe(
        data => 
        {
          if(data.status == true)
          {
            this.toast.successToastr(data.msg);
            this.back_to_login = true;
            this.router.navigate(['/proceed/login'], { queryParams: { reset: 'true' } });
          }
          else
          {
            this.toast.errorToastr(data.msg);
          }
        }
      )  
  }

  get_token()
  {
    return this.authservice.auth_token();
  }
}
