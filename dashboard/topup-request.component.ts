import { Component, OnInit } from '@angular/core';
import { TodoService } from '../todo.service';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-topup-request',
  templateUrl: './topup-request.component.html',
  styles: []
})
export class TopupRequestComponent implements OnInit{
	loop : boolean = false;
	p: number = 1;
	topup_counts : number = 0; 
  topups : any = {};
  status : 0;
	loading: boolean;
  constructor( public todoservice : TodoService,private authservice : AuthService,private router : Router,private spinner : NgxSpinnerService) { }
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
	  this.fetch_topup_request(1);
	  $('table').delegate('.select-all','change',function(){
		  if($(this).is(":checked"))
		  {
			$('table [type="checkbox"]').prop('checked',true);  
		  }	
		  else
		  {
			  $('table [type="checkbox"]').prop('checked',false);
		  }  
	  });
	this.spinner.show();
  }

  fetch_topup(status)
  {
    this.spinner.show();
    this.status = status;
    this.fetch_topup_request(1);
  }
  
  fetch_topup_request(page)
  {
	if(this.authservice.retrieveToken())
    {
      let data = {token : this.get_token(),page_index:page, status : this.status};
      this.todoservice.fetch_topup_request(data)
      .subscribe(
        data => 
        {
          if(data.status == 'Invalid Token')
          {
            this.authservice.clear_session();
            this.router.navigate(['/login']);
          }
          let b = JSON.stringify(data);
          data =  JSON.parse(b.replace(/\\/g, ''));
          this.topups = data.TOPUP;
          this.topup_counts = data.TOPUPCOUNT;
          if(!jQuery.isEmptyObject(this.topups))
          {
            this.loop = true;
          }
            this.spinner.hide();
          }
      )  
    } 
    else
    {
      this.router.navigate(['home']);
    }
  }
  
  getPage(page)
  {
	  this.spinner.show();
	  this.fetch_topup_request(page);
	  this.p = page;
  }
  
  get_token()
  {
    return this.authservice.auth_token();
  }
}

