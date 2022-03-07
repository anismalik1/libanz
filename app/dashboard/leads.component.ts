import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router ,ActivatedRoute} from '@angular/router';
import {Meta,Title } from "@angular/platform-browser";
import { ToastrManager } from 'ng6-toastr-notifications';
import { TodoService } from '../todo.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-leads',
  templateUrl: './leads.component.html',
  styles: []
})
export class LeadsComponent implements OnInit {

  page : number = 1;
  more : boolean = false;
  leads : any = {};
  days_left : number = 0;
  constructor(
    private router : Router,
    private  meta : Meta,
    private title : Title, 
    private toastr : ToastrManager,
    private spinner: NgxSpinnerService,
    private todoservice : TodoService,
    private authservice : AuthService) { }

  ngOnInit() {
    this.spinner.hide();
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

    this.fetch_leads();
  } 

  fetch_leads()
  {
    this.todoservice.fetch_my_leads({token : this.get_token(),page : this.page})
    .subscribe(
    data => 
    {
      if(this.leads.length > 0)
      {
        this.leads = this.leads.concat(data.leads);
      }
      else
      {
        this.leads = data.leads;
      }
      this.days_left = data.days_left;
      if(data.load_more)
      {
        this.more = true;
      }
      $('.load-more a').text("Load More +");
    }
    ) 
  }

  subscribe_lead(data)
  {
    console.log(data);
  }

  next_page()
  {
    $('.load-more a').text("Please Wait...");
    this.page ++;
    this.fetch_leads();
  }
  
  get_token()
  {
    return this.authservice.auth_token();
  }
}
