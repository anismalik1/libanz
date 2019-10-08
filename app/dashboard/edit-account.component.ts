import { Component, OnInit,ViewContainerRef,Renderer2,Inject,ElementRef, ViewChild } from '@angular/core';
import { Headers,Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { DOCUMENT } from "@angular/platform-browser";
import { TodoService } from '../todo.service';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-edit-account',
  templateUrl: './edit-account.component.html',
  styles: []
})
export class EditAccountComponent implements OnInit{
  userinfo : any = {};
  isvalid : boolean = false;
  kyc :any;
  form: FormGroup;
  loading: boolean = false;
  @ViewChild('fileInput') fileInput: ElementRef;
  constructor( private _renderer2: Renderer2,  
    @Inject(DOCUMENT) private _document,
    private toastr : ToastsManager ,
    public todoservice : TodoService,
    private authservice : AuthService,
    private http : Http,
    private router : Router,
    private fb: FormBuilder,
    private vrc : ViewContainerRef) { 
    this.toastr.setRootViewContainerRef(vrc);
    this.manage_account_info();
    this.createForm();
  }

  createForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      city : null,
      pincode : null,
      state : null,
      email : null,
      shipping_address : null,
      gender : null,
      avatar: null
    });
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


  onFileChange(event) {
    if(event.target.files.length > 0) {
      let file = event.target.files[0];
      this.form.get('avatar').setValue(file);
    }
  }

  onSubmit() {
    const formModel = this.prepareSave();
    this.loading = true;
    this.http.post('https://www.mydthshop.com/accounts/apis/home/upload_avatar', formModel)
    .subscribe(
      data => {
          console.log("Subscribe data", data);
      }
  )
    setTimeout(() => {
      // FormData cannot be inspected (see "Key difference"), hence no need to log it here
      this.loading = false;
    }, 1000);
  }
  private prepareSave(): any {
    let input = new FormData();
    input.append('name', this.form.get('name').value);
    input.append('city', this.form.get('city').value);
    input.append('pincode', this.form.get('pincode').value);
    input.append('state', this.form.get('state').value);
    input.append('email', this.form.get('email').value);
    input.append('shipping_address', this.form.get('shipping_address').value);
    input.append('gender', this.form.get('gender').value);
    input.append('avatar', this.form.get('avatar').value);
    input.append('token', this.get_token());
    return input;
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

