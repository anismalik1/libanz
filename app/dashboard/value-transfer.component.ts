import { Component, OnInit,ViewContainerRef } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrManager } from 'ng6-toastr-notifications';
import { TodoService } from '../todo.service';
import { AuthService } from '../auth.service';
import { Router ,ActivatedRoute} from '@angular/router';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms'

@Component({
  selector: 'app-value-transfer',
  templateUrl: './value-transfer.component.html',
  styles: []
})
export class ValueTransferComponent implements OnInit{
  order_id : any;
  order_data : any;
  step : number = 1;
  fetch_user : any = {phone: '',name:'',id:''}; 
  recent_transfer : any;
  user_tobank : FormGroup;
  bankgroup : FormGroup;
  valuetransfer : FormGroup;
  phonefetchform : FormGroup;
  user_data : any = {amount : 0,surcharge :0};
  user_banks : any;
  all_banks : any;
  selected_bank : any ;
  classes : any = ['circle-box1','circle-box2','circle-box3','circle-box2']; 
  constructor(private spinner : NgxSpinnerService,private fb: FormBuilder, 
    vcr: ViewContainerRef,private toastr: ToastrManager,
    public todoservice : TodoService,private authservice : AuthService,
    private router : Router,private route : ActivatedRoute) {
   }
  ngOnInit() {
    this.todoservice.back_icon_template('Pay',this.todoservice.back())
    if(!this.get_token())
    {
      let full_url = this.router.url.split('/');
      if(!full_url[2])
       full_url[2] = '';
      else
        full_url[2] = '#'+full_url[2];
      this.router.navigate(['/proceed/login/ref/'+full_url[1]+full_url[2]]);
      return;
    }
    this.user_tobank = this.fb.group({
      'amount' : [null,Validators.compose([Validators.required])],
    });
    this.bankgroup = this.fb.group({
      'account_no' : [null,Validators.compose([Validators.required])],
      'ifsc' : [null,Validators.compose([Validators.required])],
      'holder_name' : [null,Validators.compose([Validators.required])],
      'bank_id' : [null,Validators.compose([Validators.required])]
    });
    this.valuetransfer = this.fb.group({
      'amount' : [null,Validators.compose([Validators.required,Validators.pattern("[0-9]+")])],
    });

    this.phonefetchform = this.fb.group({
      'phone' : [null,Validators.compose([Validators.required,Validators.pattern("[0-9]{10}")])],
    });

    this.route.params.subscribe(params => {
      this.order_id = params['name'];
      if(this.order_id > 0)
        this.fetch_order();
   });

    this.fetch_value_transfer(); 
  }
  user_tobank_submit(form)
  {
    let surcharge = (3*form.amount)/100;
    this.user_data = { amount : form.amount,surcharge:surcharge};
    this.goto_step(4);
  }
  change_amount(amount : any)
  {

    let surcharge = (3*amount.target.value)/100;
    this.user_data.surcharge = surcharge;
    this.user_data.amount = amount;
  }

  proceed_to_choose_bank()
  {
    let bank_selected_id : Number = Number($('[name="select_user_bank"]:checked').val());
    this.user_data['bank_selected_id'] = bank_selected_id;
    this.selected_bank = this.user_banks.filter(banks => banks.id == bank_selected_id);
    this.step = 7;
  }

  send_money_resuest()
  {
      if(!this.get_token())
      {
        return;
      }	
      this.spinner.show();
		  this.todoservice.send_money_to_bank({token:this.get_token(),user_data : this.user_data})
		  .subscribe( 
			data => 
			{
        this.spinner.hide();
        if(data.status == true)
        {
          this.toastr.infoToastr(data.msg);
          this.order_id = data.order_id;
           // this.toastr.successToastr(" Transfer is Successful", 'Success! ');
            if(1 == 1)
            {
              this.router.routeReuseStrategy.shouldReuseRoute = function(){
                return false;
              }
            }  
            this.router.navigated = false;
            this.router.navigate(['/dashboard/value-transfer/'+this.order_id]);
        }
        else if(data.status == false)
        {
          this.toastr.errorToastr(data.error);
        }
			}
		) 
  }

  add_bank(form)
  {
    if(!this.get_token())
		{
			return;
    }	
    this.spinner.show();
		  this.todoservice.add_user_bank({token:this.get_token(),form : form})
		  .subscribe( 
			data => 
			{
        this.spinner.hide();
        if(data.status == true)
        {
          this.toastr.infoToastr(data.msg);
          this.selected_bank = data.insert_id;
          this.goto_step(5);
        }
        else if(data.status == false)
        {
          this.toastr.errorToastr(data.msg);
        }
			}
		) 
  }
  goto_step(step)
  {
    if(step == 5)
    {
      if(this.user_data.amount < 100)
      {
        return;
      }
    }  
    this.step = step;
    if(step == 5)
    {
      if(!this.get_token())
      {
        return;
      }
      this.spinner.show();	
      this.todoservice.user_banks({token:this.get_token()})
		  .subscribe( 
			data => 
			{
        this.spinner.hide();
				this.user_banks = data.user_banks;
      })
    }
    else if(step == 6)
    {
      if(!this.get_token())
      {
        return ;
      }	
      this.spinner.show();
      this.todoservice.banks({token:this.get_token()})
		  .subscribe( 
			data => 
			{
        this.spinner.hide();
				this.all_banks = data.banks;
      })
    }
  }
  back_to_transfer()
  {
    if(1 == 1)
		{
			this.router.routeReuseStrategy.shouldReuseRoute = function(){
				return false;
			}
		}	
		this.router.navigated = false;
		this.router.navigate(['/dashboard/value-transfer']);
  }
  fetch_order()
	{
		if(!this.get_token())
		{
			return;
		}	
		  this.todoservice.fetch_order({token:this.get_token(),order_id: this.order_id})
		  .subscribe( 
			data => 
			{
				this.order_data = data.order[0];
			}
		) 
	}
  
  choose_random()
  {
    return this.classes[Math.floor(Math.random() * this.classes.length)];
  }
  fetch_user_data(formdata)
  {
    if(formdata.phone == '' || formdata.phone == null)
    {
      this.toastr.errorToastr(" Please Enter a Valid Number", 'Failed! ');
      return;
    }
    this.spinner.show();
    if(this.authservice.retrieveToken())
    {
      let data = {token : this.get_token(),qr_user: formdata.phone};
      this.todoservice.fetch_qr_user(data)
      .subscribe(
        data => 
        {
          this.spinner.hide();
          if(data.status == 'Invalid Token')
          {
            this.authservice.clear_session();
            this.router.navigate(['/proceed/login']);
          }
          this.fetch_user = data;
          if(data.status == 'true')
          {
            this.step = 2;
          }
          else{
            this.step = 1;
            this.toastr.errorToastr(data.msg,' Failed ');
          }
        }
      )  
    }
    else
    {
      this.authservice.clear_session();
      this.router.navigate(['/proceed/login']);
    }
  }

  fetch_value_transfer()
  {
    let data = {token : this.get_token()};
      this.todoservice.fetch_recent_transfer(data)
      .subscribe(
        data => 
        {
          this.spinner.hide();
          if(data.status == 'Invalid Token')
          {
            this.authservice.clear_session();
            this.router.navigate(['/proceed/login']);
          }
          this.recent_transfer = data.transfers;
          
        }
      ) 
  }
  select_partner(number)
  {
    this.fetch_user.phone = number
    this.fetch_user_data({phone : number});
    
  }
  check_user(partner)
  {
    if(partner == "User Not Registered")
    {
      return null;
    }
    else
    {
      let partner_arr = partner.split(" ");
      if(partner_arr.length == 2)
      {
        return partner_arr[0].charAt(0).toUpperCase()+partner_arr[1].charAt(0).toUpperCase();
      }
      else
      {
        return partner_arr[0].charAt(0).toUpperCase();
      }
    }
  }
  send_value(formdata)
  {
    if(formdata.amount == '')
    {
      this.toastr.errorToastr(" Please Enter Amount", 'Failed! ');
      return;
    }
    this.spinner.show();
    if(this.authservice.retrieveToken())
    {
      let data = {token : this.get_token(),qr_user: this.fetch_user.phone,qr_user_id: this.fetch_user.id,amount:formdata.amount};
      this.todoservice.send_value(data)
      .subscribe(
        data => 
        {
          this.spinner.hide();
          if(data.status == 'Invalid Token')
          {
            this.authservice.clear_session();
            this.router.navigate(['/proceed/login']);
          }
          if(data.status == 'success')
          {
            this.order_id = data.order_id;
            this.toastr.successToastr(" Transfer is Successful", 'Success! ');
            if(1 == 1)
            {
              this.router.routeReuseStrategy.shouldReuseRoute = function(){
                return false;
              }
            }  
            this.router.navigated = false;
            this.router.navigate(['/dashboard/value-transfer/'+this.order_id]);
          }
          else
          {
            this.toastr.errorToastr(' '+data.error, 'Failed! ');
            return;
          }
        }
      )  
    }
    else
    {
      this.authservice.clear_session();
      this.router.navigate(['/proceed/login']);
    }
  }



  cancel()
  {
    this.step = 1;
  }
  
  get_token()
  {
    return this.authservice.auth_token();
  }
}

