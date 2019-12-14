import { Component, OnInit ,ViewContainerRef} from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms'
import { ToastrManager } from 'ng6-toastr-notifications';
import { TodoService } from '../todo.service';
import { AuthService } from '../auth.service';
import { User } from '../user';
import { Router ,ActivatedRoute} from '@angular/router'
import * as $ from 'jquery';
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
  signupverify : number = 0
  signupdisabled : boolean = false;
  verifydisabled : boolean = false;
  constructor(private toast: ToastrManager, 
    private fb : FormBuilder,
    public todoservice : TodoService,
    private route : ActivatedRoute,
    private authservice : AuthService,
    vcr: ViewContainerRef,
    private router : Router) {
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
      this.router.navigate(['/home']);
    }
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
              this.toast.successToastr(data.message);
            }
            else
            {
              this.toast.errorToastr(data.message);
            }
          }
          //this.spinner.hide();
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
    this.todoservice.signup(formdata)
      .subscribe(
        data => 
        {
          if(data.status == 'success')
          {
            this.verify = 1;
          }
          else
          {
            this.toast.successToastr(data.msg, 'Failed');
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
            this.authservice.storage(store);
            this.router.navigate(['/home']);
          }
          else
          {
            this.toast.errorToastr(data.msg, 'Failed');
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
  get_token()
  {
    return this.authservice.auth_token();
  }
}

