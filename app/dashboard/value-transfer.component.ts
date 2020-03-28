import { Component, OnInit,ViewContainerRef } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrManager } from 'ng6-toastr-notifications';
import { TodoService } from '../todo.service';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-value-transfer',
  templateUrl: './value-transfer.component.html',
  styles: []
})
export class ValueTransferComponent implements OnInit{

  step : number = 1;
  fetch_user : any = {phone: '',name:'',id:''}; 
  recent_transfer : any;
  classes : any = ['circle-box1','circle-box2','circle-box3','circle-box2']; 
  constructor(private spinner : NgxSpinnerService, vcr: ViewContainerRef,private toastr: ToastrManager,public todoservice : TodoService,private authservice : AuthService,private router : Router) {
   }
  ngOnInit() {
    if(!this.get_token())
    {
      let full_url = this.router.url.split('/');
      if(!full_url[2])
       full_url[2] = '';
      else
        full_url[2] = '#'+full_url[2];
      this.router.navigate(['/proceed/login/ref/'+full_url[1]+full_url[2]]);
      return false;
    }
    this.fetch_value_transfer() 
  }
  
  choose_random()
  {
    return this.classes[Math.floor(Math.random() * this.classes.length)];
  }
  fetch_user_data(formdata)
  {
    if(formdata.phone == '' || formdata.phone == null)
    {
      this.toastr.errorToastr(" Please Enter the registered number to whom Transfer", 'Failed! ');
      return false;
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
      return false;
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
            this.toastr.successToastr(" Transfer is Successful", 'Success! ');
            if(1 == 1)
            {
              this.router.routeReuseStrategy.shouldReuseRoute = function(){
                return false;
              }
            }  
            this.router.navigated = false;
            this.router.navigate(['/dashboard/value-transfer']);
          }
          else
          {
            this.toastr.errorToastr(' '+data.error, 'Failed! ');
            return false;
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

