import { Component, OnInit } from '@angular/core';
import { TodoService } from '../todo.service';
import { AuthService } from '../auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router'

@Component({
  selector: 'app-commission-structure',
  templateUrl: './commission-structure.component.html',
  styles: []
})
export class CommissionStructureComponent implements OnInit{
  dthcommissions : any ;
  billcommissions : any;
  constructor( private spinner : NgxSpinnerService,public todoservice : TodoService,private authservice : AuthService,private router : Router) { }
  ngOnInit() {
    if(!this.get_token())
    {
      let full_url = this.router.url.split('/');
      if(!full_url[2])
       full_url[2] = '';
      else
        full_url[2] = '#'+full_url[2];
      this.router.navigate(['/proceed/login/ref/'+full_url[1]+full_url[2]]);
    } 
    this.fetch_commissions();
  }
  
  fetch_commissions()
  {
    if(!this.get_token() )
    {
      this.router.navigate(['/home']);
      return false;
    }
    this.spinner.show();
    if(this.authservice.retrieveToken())
    {
      let data = {token : this.get_token()};
      this.todoservice.fetch_commissions(data)
      .subscribe(
        data => 
        {
          if(data.status == 'Invalid Token')
          {                                                     
            this.authservice.clear_session();
            this.router.navigate(['/proceed/login']);
          }
          this.dthcommissions     = data.COMMISSIONS.DTH;
          this.billcommissions     = data.COMMISSIONS.BILLRECHARGE;
          this.spinner.hide();
        }
      )  
    }
  }
  get_token()
  {
    return this.authservice.auth_token();
  }
}

