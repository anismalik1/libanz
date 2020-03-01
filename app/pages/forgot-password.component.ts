import { Component, OnInit ,ViewContainerRef} from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { TodoService } from '../todo.service';
import { AuthService } from '../auth.service';
import { User } from '../user';
import { Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
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
      this.todoservice.proceed_to_reset(data)
      .subscribe(
        data => 
        {
          let b = JSON.stringify(data);
          data =  JSON.parse(b.replace(/\\/g, '')); 
          if(data.status == true)
          {
            this.step = 2;
            this.tick_clock(30);
          }
          else
          {
            this.toast.errorToastr(data.msg);
          }
        }
      )  
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
