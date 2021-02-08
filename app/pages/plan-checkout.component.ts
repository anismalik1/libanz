import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { TodoService } from '../todo.service';
import { AuthService } from '../auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Router } from '@angular/router'
import { Route } from '@angular/compiler/src/core';

@Component({
  selector: 'app-plan-checkout',
  templateUrl: './plan-checkout.component.html',
  styles: []
})
export class PlanCheckoutComponent implements OnInit {
  checkoutgroup : FormGroup;
  selected_plan : any;
  selected_codes : any;
  step2 : boolean = false;
  plan : any;
  constructor(private fb : FormBuilder,private spinner: NgxSpinnerService,
    private router :Router, 
    private authservice : AuthService,public todoservice : TodoService,private toast : ToastrManager) {
    this.checkoutgroup = fb.group({
      'name':[null,Validators.required],
      'phone' : [null,Validators.compose([Validators.required,Validators.pattern("[0-9]{10}")])],
      'email' : [null,Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')])],
      'password' : [null],
      'pin' : [null],
      'payment_type' : [null,Validators.required]
    });
   }

  ngOnInit() {
    this.plan = this.todoservice.get_param('plan');
    this.fetch_plan(this.plan);
    if(this.todoservice.get_user_name() != '')
    {
      this.checkoutgroup.get('name').disable()
      this.checkoutgroup.get('email').disable()
      this.checkoutgroup.get('phone').disable()
    }
    
  }

  fetch_plan(id)
  {
    if(id == 'trial')
      id = 10000;
    let data = {plan_id : id}; 
    if(data.plan_id == '')
    {
        return;
    }
    this.todoservice.fetch_plan_data(data)
      .subscribe(
        data => 
        {
          this.selected_codes = data.plan_codes;
          this.selected_plan = data.plan;
          if(this.get_token())
            this.set_data();
          else
          {
            setTimeout(()=>{    //<<<---    using ()=> syntax
              this.set_data();
            }, 3000);
          }    
          this.spinner.hide();  
        }
      )
  }

  set_data()
  {
    let pay = '';
    if(this.plan == 'trial')
      pay = 'trial';
    this.checkoutgroup.setValue({  
      name: this.todoservice.get_user_name(),  
      phone: this.todoservice.get_user_phone(),  
      email: this.todoservice.get_user_email(), 
      password : '',
      payment_type : pay,
      pin : ''  
  }); 
  }

  plan_checkout(formdata)
  {
    this.checkoutgroup.get('name').enable()
    this.checkoutgroup.get('email').enable()
    this.checkoutgroup.get('phone').enable();
    formdata = this.checkoutgroup.value;
    if(this.get_token())
    formdata.token = this.get_token();
    formdata.selected_plan = this.selected_plan;
    this.spinner.show();
    this.todoservice.subcribe_plan(formdata)
      .subscribe(
        data => 
        {
          if(data.store)
          {
              this.authservice.storage(data.store,this);
          }
          if(data.status == 'true' && (data.red == 'trial' || data.red == 'wallet'))
          {
            this.toast.successToastr(data.response);
            this.router.navigate(['/dashboard']);
          }
          else if(data.status == 'true' && data.red == 'paytm')
          {
            window.location.href = this.todoservice.base_url+"web-app/do-paytm/checkout-plan-index.php?order_id="+data.order_id+'&pt_t=plan&token='+this.get_token()+'&amount='+data.amount;
          }
          else if(data.status == 'true' && data.red == 'card')
          {
            window.location.href = this.todoservice.base_url+"accounts/apis/response/plan_pay/?order_id="+data.order_id;
          }
          else
          {
            this.toast.errorToastr(data.response, 'Failed');
          } 
          this.spinner.hide();  
        }
      )
  }

  check_if_user_exist()
  {
    if(!this.checkoutgroup.controls['phone'].valid && !this.get_token())
      return;
    let data : any = { phone : this.checkoutgroup.controls['phone'].value } 
    this.todoservice.check_if_user_exist(data)
      .subscribe(
        data => 
        {
          if(data.red == 'exist')
          {
            this.toast.successToastr("This Phone Number Already exist. Please Login");
            $('.logup.modal-trigger')[0].click(); 
            $('#login #icon_prefix').val(this.checkoutgroup.controls['phone'].value)
          }
          else
          {
            this.step2 = true;
          }   
        }
      )
  }

  get_code(id)
  {
    let row = this.selected_codes.filter(x => x.id == id);
    return row[0].plan_code;
  }

  get_token()
  {
    return this.authservice.auth_token();
  }
}
