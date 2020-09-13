import { Component, OnInit } from '@angular/core';
import { TodoService } from '../todo.service';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment';
@Component({
  selector: 'app-transaction-history',
  templateUrl: './transaction-history.component.html',
  styles: []
})
export class TransactionHistoryComponent implements OnInit{

  public transactions : any;
  w_p: number = 1;
  wallet_counts : number = 0; 
  ranges: any = {
    'Today': [moment(), moment()],
    'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
    'This Month': [moment().startOf('month'), moment().endOf('month')],
    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
  }
  selected: {startDate: moment.Moment, endDate: moment.Moment};
  constructor( private spinner: NgxSpinnerService ,  public todoservice : TodoService,private authservice : AuthService,private router : Router) { }
  ngOnInit() {
    this.todoservice.back_icon_template('History',this.todoservice.back())
    if(!this.get_token())
    {
      let full_url = this.router.url.split('/');
      if(!full_url[2])
       full_url[2] = '';
      else
        full_url[2] = '#'+full_url[2];
      this.router.navigate(['/proceed/login/ref/'+full_url[1]+full_url[2]]);
      return false;
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
  
  seach_order()
  {
    if(!this.authservice.authenticate())
    {
        this.router.navigate(['/proceed/login']);
    }
    var key = $("#order-id").val();
    this.spinner.show();
    let data =  {token : this.get_token(),key : key};
    this.todoservice.fetch_transaction_by_key(data)
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
          this.transactions   = data.TRANSACTIONS;
          this.wallet_counts  = data.TRANSACTIONS_COUNT;						
			  }
			}
		  );
  }
  fetch_transaction_history(page)
  {
    if(!this.authservice.authenticate())
    {
        this.router.navigate(['/proceed/login']);
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
          this.router.navigate(['/proceed/login']);
			  }
			  if(!jQuery.isEmptyObject(data))
			  {		
          this.transactions   = data.TRANSACTIONS;
          this.wallet_counts  = data.TRANSACTIONS_COUNT;						
			  }
			}
		  );
  }

  export_transactions()
  {
    var date = $('[name="daterange"]').val();
    if(date == '')
    {
      return false;
    }
    window.location.href = this.todoservice.server_url+'accounts/apis/export/export_transactions/?token='+this.get_token()+'&date='+date;
  }
  
  paging_wallet_history(page)
  {
    if(!this.authservice.authenticate())
    {
        this.router.navigate(['/proceed/login']);
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
				this.router.navigate(['/proceed/login']);
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

