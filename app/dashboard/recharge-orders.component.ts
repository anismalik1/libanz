import { Component, OnInit } from '@angular/core';
import { TodoService } from '../todo.service';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-recharge-orders',
  templateUrl: './recharge-orders.component.html',
  styles: []
})
export class RechargeOrdersComponent implements OnInit {
  public recharges : any;
  r_p: number = 1;
  recharge_counts : number;
  constructor(private spinner: NgxSpinnerService ,  public todoservice : TodoService,private authservice : AuthService,private router : Router) { 
    
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
    this.fetch_recharge_history(this.r_p); 
  }

  do_complaint(order_id)
  {
    console.log(order_id);
  }
  add_complaint()
  {
    
  }

  paging_recharge_history(page)
  {
    if(!this.authservice.authenticate())
    {
        this.router.navigate(['/login']);
    }
    this.spinner.show();
    let data =  {token : this.get_token(),page_index : page};
    this.todoservice.paging_recharge_history(data)
		.subscribe(
			data => 
			{
				this.spinner.hide();
			  if(data.status == 'Invalid Token')
			  {
				this.authservice.clear_session();
				this.router.navigate(['/login']);
			  }
			  if(!jQuery.isEmptyObject(data))
			  {			
				  this.recharges      = data.RECHARGES;				
			  }
			}
		  );
  }

  getPage(page , id)
  {
    if(id == 'r')
    {
      this.spinner.show();
      this.paging_recharge_history(page);
      this.r_p = page;
    }
  }

  get_token()
  {
    return this.authservice.auth_token();
  }

  fetch_recharge_history(page)
  {
    if(!this.authservice.authenticate())
    {
        this.router.navigate(['/login']);
    }
    this.spinner.show();
    let data =  {token : this.get_token(),page_index: page};
    this.todoservice.fetch_recharge_history(data)
		.subscribe(
			data => 
			{
				this.spinner.hide();
			  if(data.status == 'Invalid Token')
			  {
          this.authservice.clear_session();
          this.router.navigate(['/login']);
			  }
			  if(!jQuery.isEmptyObject(data))
			  {
				  this.recharges      = data.RECHARGES;						
          this.recharge_counts  = data.RECHARGES_COUNT;			
			  }
			}
		  );
  }
}
