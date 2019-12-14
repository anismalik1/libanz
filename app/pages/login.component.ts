import { Component, OnInit,ViewContainerRef } from '@angular/core';
import { Router ,ActivatedRoute} from '@angular/router';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms'
import { Meta ,Title} from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { TodoService } from '../todo.service';
import { User } from '../user';
import { AuthService } from '../auth.service';
import { Authparams } from '../authparams';
import { ToastrManager } from 'ng6-toastr-notifications';
import * as $ from 'jquery';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [],
  providers: [TodoService,User,AuthService]
})
export class LoginComponent implements OnInit{
  private token_params : Authparams;
  public phone : number;
  public phone1 : string;
  public password : string;
  public otp : number;
  public step : number = 1; 
  public otp1 : string;
  public otp2: string;
  public otp3: string;
  public otp4 : string;
  private ref : string; 
  logingroup : FormGroup;
  remember : any = {rm:false,ph:'',pw : ''};  
constructor( public todoservice : TodoService,
  private toastr: ToastrManager,
  private authService : AuthService,
  private spinner : NgxSpinnerService,
  private router : Router, 
  vcr: ViewContainerRef,
  private route : ActivatedRoute,
  private fb: FormBuilder
) {
  if(this.route.snapshot.params['name'])
  {
    this.ref = this.route.snapshot.params['name'];
  }
  if(this.authService.authenticate())
  {
      this.router.navigate(['/']);
  }
  this.logingroup = fb.group({
    'phone' : [null,Validators.compose([Validators.required])],
    'password' : [null,Validators.compose([Validators.required])],
    'remember' : [null],
  });
  this.get_remember();
  if(!this.get_token())
  {
    this.todoservice.set_user_data({name:''});
  }
 }
ngOnInit() {
  if(this.get_token())
    {
      this.router.navigate(['/']);
    }
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
    this.spinner.show();
    this.authService.dologin(login)
    .subscribe(
      data => 
      {
        this.token_params = data;
        if(typeof data.status != 'undefined' && data.status == true)
        {
          let user : any = data.user;
          this.toastr.successToastr('You are logging in...', 'Success!');
          this.authService.AccessToken = this.token_params.accessToken;
          this.authService.storage(data); 
          this.todoservice.set_user_data(user);
          this.user_favourites();
          if(this.ref)
          {
            this.router.navigate(['/'+this.ref.replace('#', "/")]); 
          }
          else
          {
            this.router.navigate(['/']);
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
        this.spinner.hide();
      }
    )  
}

user_favourites()
{
  this.spinner.show();
  this.todoservice.user_favourites({token: this.get_token()})
      .subscribe(
        data => 
        {
          if(!jQuery.isEmptyObject(data))
          {
            this.spinner.hide();
            if(data.status && data.status == 'Invalid Token')
            {
              return false;
            }
            localStorage.setItem('favourite', JSON.stringify(data.favourites));
          }
        }
      )  
}
resend_otp()
{
  this.spinner.show();
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
        this.spinner.hide();
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
  return this.authService.auth_token();
}
}
