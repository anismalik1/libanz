import { Component, OnInit,ViewContainerRef } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
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
  constructor(private spinner : NgxSpinnerService, vcr: ViewContainerRef,private toastr: ToastsManager,public todoservice : TodoService,private authservice : AuthService,private router : Router) {
    this.toastr.setRootViewContainerRef(vcr);
   }
  ngOnInit() {
    if(!this.get_token())
    {
      let full_url = this.router.url.split('/');
      if(!full_url[2])
       full_url[2] = '';
      else
        full_url[2] = '#'+full_url[2];
      this.router.navigate(['/login/ref/'+full_url[1]+full_url[2]]);
    } 
  }
  
  fetch_user_data(formdata)
  {
    if(formdata.phone == '')
    {
      this.toastr.success(" Please Enter the registered number to whom transfer", 'Failed! ');
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
            this.router.navigate(['/login']);
          }
          this.fetch_user = data;
          if(data.status == 'true')
          {
            this.step = 2;
          }
          else{
            this.toastr.error(" Please Check the Number and try again",' Failed ');
          }
        }
      )  
    }
    else
    {
      this.authservice.clear_session();
      this.router.navigate(['/login']);
    }
  }

  send_value(formdata)
  {
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
            this.router.navigate(['/login']);
          }
          if(data.status == 'success')
          {
            this.toastr.success(" Transfer is Successful", 'Success! ');
            this.step = 1;
            this.todoservice.set_user_data(data.USER);
            return false;
          }
          else
          {
            this.toastr.error(' '+data.error, 'Failed! ');
            return false;
          }
        }
      )  
    }
    else
    {
      this.authservice.clear_session();
      this.router.navigate(['/login']);
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

