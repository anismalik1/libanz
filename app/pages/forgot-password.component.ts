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

  constructor( public todoservice : TodoService,
              private authservice : AuthService,
              private router : Router,
              private toast : ToastrManager,
              private vcr: ViewContainerRef,
              private fb: FormBuilder,
  ) {
    this.resetgroup = fb.group({
      'password' : [null,Validators.compose([Validators.required])],
       'cpassword' : [null,Validators.compose([Validators.required])],
       'pin' : [null,Validators.compose([Validators.required])]
     });
   }
  public phone : string;
  public password : string;
  public step : number = 1;
  public tick : number;
  back_to_login : boolean = false;
  resetgroup : FormGroup;
  ngOnInit() {
    
  }
  
  process_to_reset(data)
  {
    if(data.phone == '')
    {
      this.toast.errorToastr("Enter Registered Phone");
      return false;
    }
    this.phone = data.phone;
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
            this.step = 2;
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
    if(window.SMSRetriever)
    {
      document.addEventListener('onSMSArrive', function(args : any) {
        var otp = substring(args.message,13, 17);
        //$('#reset-form #forgot-otp').val(otp);
        this.resetgroup.controls['pin'].setValue(otp);
        //$('#reset-form #forgot-submit').click();
        function substring(string, start, end) {
          var result = '',
              length = Math.min(string.length, end),
              i = start;
        
          while (i < length) result += string[i++];
          return result;
        }  
      });
      window.SMSRetriever.startWatch(function(msg) {
        console.log(msg);
      }, function(err) {
        
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
    this.process_to_reset(data)
  }
  reset_password(form)
  {
    form.phone = this.phone
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
