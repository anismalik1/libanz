import { Component, OnInit,ViewContainerRef,Renderer2,Inject } from '@angular/core';
import { DOCUMENT } from "@angular/platform-browser";
import { TodoService } from '../todo.service';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
  selector: 'app-edit-account',
  templateUrl: './edit-account.component.html',
  styles: []
})
export class EditAccountComponent implements OnInit{
  userinfo : any = {};
  isvalid : boolean = false;
  kyc :any;
  constructor( private _renderer2: Renderer2,  
    @Inject(DOCUMENT) private _document,
    private toastr : ToastsManager ,
    public todoservice : TodoService,
    private authservice : AuthService,
    private router : Router,
    private vrc : ViewContainerRef) { 
    this.toastr.setRootViewContainerRef(vrc);
    this.manage_account_info();
  }
  ngOnInit() {
    let script = this._renderer2.createElement('script');
    script.type = `text/javascript`;
    script.text = `$('.modal').modal();`;
    this._renderer2.appendChild(this._document.body, script);
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
  edituser()
  {
    this.isvalid = true;
  }
  manage_account_info()
  {
    if(this.authservice.retrieveToken())
    {
      let data = {token : this.get_token()};
      this.todoservice.manage_account_info(data)
      .subscribe(
        data => 
        {
          if(data.status == 'Invalid Token')
          {                                                     
            this.authservice.clear_session();
            this.router.navigate(['/login']);
          }
          var b = JSON.stringify(data.USER);
          this.userinfo = JSON.parse(b.replace(/\\/g, ''));
        }
      )  
    }
  }
  update_kyc(form)
  {

  }
  update_password(formdata)
  {
    if(formdata.newpassword != formdata.cnewpassword)
    {
      this.toastr.error('Your Password Does Not Match ', 'failed!');
      return false;
    }
    if(this.authservice.retrieveToken())
    {
      formdata.token =  this.get_token();
      this.todoservice.update_password(formdata)
      .subscribe(
        data => 
        {
          if(data.status == 'true')
          {
            this.toastr.success(data.msg, 'Success!');
          }
          else
          {
            this.toastr.error(data.msg, 'Failed!');
          }
        }
      )  
    }
  }
  update_details(formdata)
  {
    if(this.authservice.retrieveToken())
    {
      formdata.token =  this.get_token();
      this.todoservice.update_account(formdata)
      .subscribe(
        data => 
        {
          if(data.status == 'true')
          {
            this.toastr.success('Updated ', 'Success!');
          }
        }
      )  
    }
  }

  get_user_info()
  {                                     
    if(this.authservice.retrieveToken())
    {
      let data = {token : this.get_token()};
      this.todoservice.fetch_user_info(data)
      .subscribe(
        data => 
        {
          if(data.status == 'Invalid Token')
          {                                                     
            this.authservice.clear_session();
            this.router.navigate(['/login']);
          }
          this.todoservice.set_user_data(data.USER);
          this.userinfo     = data.USER;
        }
      )  
    }
  } 
  get_token()
  {
    return this.authservice.auth_token();
  }
}

