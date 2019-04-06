import { Component, OnInit } from '@angular/core';
import { TodoService } from '../todo.service';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-transaction-history',
  templateUrl: './transaction-history.component.html',
  styles: []
})
export class TransactionHistoryComponent implements OnInit{

  public recharges : any;
  public transactions : any;
  orders : any;
  w_p: number = 1;
  r_p: number = 1;
  o_p: number = 1;
	recharge_counts : number = 0; 
	wallet_counts : number = 0; 
	order_counts : number = 0; 
  constructor( private spinner: NgxSpinnerService ,  public todoservice : TodoService,private authservice : AuthService,private router : Router) { }
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
    $(document).ready(function() {
        $('.filter-show').on('click',function(){
          if($('.filter-he').is(':visible'))  
            $('.filter-he').fadeOut(200);
          else
            $('.filter-he').fadeIn(200); 
        });
    });
    this.fetch_all_history(1);
    
  }
  
  fetch_all_history(page)
  {
    if(!this.authservice.authenticate())
    {
        this.router.navigate(['/login']);
    }
    this.spinner.show();
    let data =  {token : this.get_token(),page_index: page};
    this.todoservice.fetch_history(data)
		.subscribe(
			data => 
			{
				this.spinner.hide();
			  if(data.status == 'Invalid Token')
			  {
          this.authservice.clear_session();
          this.router.navigate(['/login']);
			  }
			  let b = JSON.stringify(data);
			  data =  JSON.parse(b.replace(/\\/g, ''));
			  if(!jQuery.isEmptyObject(data))
			  {
				  this.recharges      = data.RECHARGES;			
          this.transactions   = data.TRANSACTIONS;
          this.orders   = data.ORDERS;
          this.order_counts   = data.ORDERCOUNT;
          this.wallet_counts  = data.TRANSACTIONS_COUNT;			
          this.recharge_counts  = data.RECHARGES_COUNT;			
			  }
			}
		  );
  }

  do_complaint(order_id)
  {
    console.log(order_id);
  }
  add_complaint()
  {
    
  }

  paging_order_history(page)
  {
    if(!this.authservice.authenticate())
    {
        this.router.navigate(['/login']);
    }
    this.spinner.show();
    let data =  {token : this.get_token(),page_index : page};
    this.todoservice.paging_order_history(data)
		.subscribe(
			data => 
			{
				this.spinner.hide();
			  if(data.status == 'Invalid Token')
			  {
          this.authservice.clear_session();
          this.router.navigate(['/login']);
			  }
			  let b = JSON.stringify(data);
			  data =  JSON.parse(b.replace(/\\/g, ''));
			  if(!jQuery.isEmptyObject(data))
			  {			
				  this.orders = data.ORDERS;			
			  }
			}
		  );
  }
  
  paging_wallet_history(page)
  {
    if(!this.authservice.authenticate())
    {
        this.router.navigate(['/login']);
    }
    this.spinner.show();
    let data =  {token : this.get_token(),page_index : page};
    this.todoservice.paging_wallet_history(data)
		.subscribe(
			data => 
			{
				this.spinner.hide();
			  if(data.status == 'Invalid Token')
			  {
				this.authservice.clear_session();
				this.router.navigate(['/login']);
			  }
			  let b = JSON.stringify(data);
			  data =  JSON.parse(b.replace(/\\/g, ''));
			  if(!jQuery.isEmptyObject(data))
			  {			
				  this.transactions = data.TRANSACTIONS;			
			  }
			}
		  );
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
			  let b = JSON.stringify(data);
			  data =  JSON.parse(b.replace(/\\/g, ''));
			  if(!jQuery.isEmptyObject(data))
			  {			
				  this.recharges      = data.RECHARGES;				
			  }
			}
		  );
  }

  getPage(page , id)
  {
    if(id == 'w')
    {
      this.spinner.show();
      this.paging_wallet_history(page);
      this.w_p = page;
    }
    else if(id == 'r')
    {
      this.spinner.show();
      this.paging_recharge_history(page);
      this.r_p = page;
    }
    else if(id == 'o')
    {
      this.spinner.show();
      this.paging_order_history(page);
      this.o_p = page;
    }
  }
  get_token()
  {
    return this.authservice.auth_token();
  }
  get
}

