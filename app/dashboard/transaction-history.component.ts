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

  public transactions : any;
  w_p: number = 1;
	wallet_counts : number = 0; 
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
    this.fetch_transaction_history(1);
    
  }
  
  fetch_transaction_history(page)
  {
    if(!this.authservice.authenticate())
    {
        this.router.navigate(['/login']);
    }
    this.spinner.show();
    let data =  {token : this.get_token(),page_index: page};
    this.todoservice.fetch_transaction_history(data)
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
          this.transactions   = data.TRANSACTIONS;
          this.wallet_counts  = data.TRANSACTIONS_COUNT;						
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
    this.todoservice.paging_transaction_history(data)
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
				  this.transactions = data.TRANSACTIONS;			
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
  }
  get_token()
  {
    return this.authservice.auth_token();
  }
}

