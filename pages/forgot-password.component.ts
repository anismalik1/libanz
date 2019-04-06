import { Component, OnInit ,ViewContainerRef} from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { TodoService } from '../todo.service';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: [],
  providers : [TodoService]
})
export class ForgotPasswordComponent implements OnInit{

  constructor( public todoservice : TodoService,
              private authservice : AuthService,
              private router : Router,
              private toast : ToastsManager,
              private vcr: ViewContainerRef,
              private fb: FormBuilder,
  ) {
    this.toast.setRootViewContainerRef(vcr);
    this.resetgroup = fb.group({
      'password' : [null,Validators.compose([Validators.required])],
       'cpassword' : [null,Validators.compose([Validators.required])],
       'pin' : [null,Validators.compose([Validators.required])]
     });
   }
  public phone : string;
  public password : string;
  public step : number = 1;
  back_to_login : boolean = false;
  resetgroup : FormGroup;
  ngOnInit() {
    
  }
  
  process_to_reset(data)
  {
    if(data.phone == '')
    {
      this.toast.error("Enter Registered Phone");
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
          }
          else
          {
            this.toast.error(data.msg);
          }
        }
      )  
  }

  reset_password(form)
  {
    form.phone = this.phone
    if(form.password != form.cpassword)
    {
      this.toast.error('Confirm password must be same.');
      return false;
    }
    this.todoservice.reset_password(form)
      .subscribe(
        data => 
        {
          let b = JSON.stringify(data);
          data =  JSON.parse(b.replace(/\\/g, ''));
          if(data.status == true)
          {
            this.toast.error(data.msg);
            this.back_to_login = true;
            this.router.navigate(['/home#login']);
          }
          else
          {
            this.toast.error(data.msg);
          }
        }
      )  
  }

  get_token()
  {
    return this.authservice.auth_token();
  }
}
