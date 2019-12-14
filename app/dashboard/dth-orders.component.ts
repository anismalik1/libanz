import { Component, OnInit } from '@angular/core';
import { TodoService } from '../todo.service';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

import * as moment from 'moment';

@Component({
  selector: 'app-dth-orders',
  templateUrl: './dth-orders.component.html',
  styles: []
})
export class DthOrdersComponent implements OnInit {
  public orders : any;
  o_p: number = 1;
  order_counts : number;
  ranges: any = {
    'Today': [moment(), moment()],
    'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
    'This Month': [moment().startOf('month'), moment().endOf('month')],
    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
  }
  selected: {startDate: moment.Moment, endDate: moment.Moment};
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
      this.router.navigate(['/proceed/login/ref/'+full_url[1]+full_url[2]]);
    }
    this.fetch_orders_history(this.o_p); 
  }

  do_complaint(order_id)
  {
    console.log(order_id);
  }
  add_complaint()
  {
    
  }

  export_dth_orders()
  {
    var date = $('[name="daterange"]').val();
    if(date == '')
    {
      return false;
    }
    window.location.href = this.todoservice.server_url+'accounts/apis/export/export_dth_orders/?token='+this.get_token()+'&date='+date;
  }

  paging_orders_history(page)
  {
    if(!this.authservice.authenticate())
    {
        this.router.navigate(['/proceed/login']);
    }
    this.spinner.show();
    let data =  {token : this.get_token(),page_index : page};
    this.todoservice.paging_orders_history(data)
		.subscribe(
			data => 
			{
				this.spinner.hide();
			  if(data.status == 'Invalid Token')
			  {
				this.authservice.clear_session();
				this.router.navigate(['/proceed/login']);
			  }
			  if(!jQuery.isEmptyObject(data))
			  {			
				  this.orders      = data.ORDERS;				
			  }
			}
		  );
  }

  getPage(page , id) 
  {
    if(id == 'o')
    {
      this.spinner.show();
      this.paging_orders_history(page);
      this.o_p = page;
    }
  }

  get_token()
  {
    return this.authservice.auth_token();
  }

  fetch_orders_history(page)
  {
    if(!this.authservice.authenticate())
    {
        this.router.navigate(['/proceed/login']);
    }
    this.spinner.show();
    let data =  {token : this.get_token(),page_index: page};
    this.todoservice.fetch_orders_history(data)
		.subscribe(
			data => 
			{
				this.spinner.hide();
			  if(data.status == 'Invalid Token')
			  {
          this.authservice.clear_session();
          this.router.navigate(['/proceed/login']);
			  }
			  if(!jQuery.isEmptyObject(data))
			  {
				  this.orders      = data.ORDERS;						
          this.order_counts  = data.ORDERCOUNT;			
			  }
			}
		  );
  }
}
