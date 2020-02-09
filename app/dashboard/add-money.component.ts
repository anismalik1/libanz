import { Component, OnInit ,ViewContainerRef,Renderer2,Inject} from '@angular/core';
import { DOCUMENT } from "@angular/common";
import { TodoService } from '../todo.service';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-add-money',
  templateUrl: './add-money.component.html',
  styles: []
})
export class AddMoneyComponent implements OnInit{
	public user = {phone:'loading',name:'loading'};
	paybankaccount : string = '';
	yourbankname : string = '';
	paymethod : string;
	order_id : any;
	order_data : any;
  constructor( private toastr : ToastrManager,private _renderer2: Renderer2, @Inject(DOCUMENT) private _document,private vrc: ViewContainerRef,public todoservice : TodoService,private authservice : AuthService,private router : Router) { 
    
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
			return false;
		}
		if(this.todoservice.get_param('order-id'))
		{
			this.order_id = this.todoservice.get_param('order-id');
			this.fetch_addmoney_order();
		}
			
		
		$(document).ready(function() {	
        $('.filter-show').on('click',function(){
            $('.filter-he').removeClass('hide');
            $('.filter-he').toggle(500);
        });
			
		// $('#paymethod').change(function(){
			
		// 	if($(this).val() == 'Others')
		// 	{
		// 		$("[for='bank-id']").text("Please Specify");
		// 		$('.change-hide').hide();
		// 	}
		// 	else
		// 	{
		// 		$("[for='bank-id']").text("Bank Reference ID*");
		// 		$('.change-hide').show();
		// 	}		
		// });
    });
	let script = this._renderer2.createElement('script');
    script.type = `text/javascript`;
    script.text = `
			$('select').material_select();
    `;
    this._renderer2.appendChild(this._document.body, script);
  }
	
	back_to_addmoney()
	{
		if(1 == 1)
		{
			this.router.routeReuseStrategy.shouldReuseRoute = function(){
				return false;
			}
		}	
		this.router.navigated = false;
		this.router.navigate(['/dashboard/add-money']);
	}
	calc_percentage()
	{
		var amount = $('#enter-amount').val()
		if((this.paymethod) && (this.paymethod == 'Gateway' || this.paymethod == 'Paytm' || this.paymethod == 'Cash Deposit'))
		{
			$('.additional-charge .chip').html('Additional 2% Amount Will be Deducted. Effective Amount '+(Number(amount) - (Number(amount)*2)/100)+' Will be credited.<i class="close material-icons">close</i>');
		}
	}

	check_method(data)
	{
		this.paymethod = data;
		console.log(data);
		if(data == undefined)
		{
			$('.default-hide').addClass('hide');
			$('.send-topup').addClass('hide');
			$('.send-gateway').addClass('hide');
		}
		else if( data == 'Gateway' || data == "Paytm")
		{
			var amount = $('#enter-amount').val();
			$('.additional-charge').removeClass('hide');
			if(Number(amount) > 0)
				$('.additional-charge .chip').html('Additional 2% Amount Will be Deducted. Effective Amount '+(Number(amount) - (Number(amount)*2)/100)+' Will be credited.<i class="close material-icons">close</i>');
			$('.default-hide').addClass('hide');
			
			$('.send-gateway').removeClass('hide');
			$('.send-topup').addClass('hide');
		}
		else if(data == 'FUND TRANSFER' || data == "Cash Deposit")
		{
			$('.default-hide').removeClass('hide');
			$('.send-topup').removeClass('hide');
			$('.additional-charge').addClass('hide');
			$('.send-gateway').addClass('hide');
		}
		else
		{
			$('.default-hide').removeClass('hide');
			$('.additional-charge').removeClass('hide');
			$('.send-topup').removeClass('hide');
			$('.send-gateway').addClass('hide');
		}
	}
	
	add_money(formdata)
	{
		if(formdata.amount == '')
		{
			this.toastr.errorToastr("Enter Amount", 'Failed!');
			return false;
		}
		formdata.paymethod 		= this.paymethod;
		formdata.paybankaccount = $('#paybankaccount').val();
		//formdata.yourbankname 	= $('#yourbankname').val(); 
		$('.send-topup button,.send-gateway button').text('Wait...').attr("disabled","disabled");	
		if(this.authservice.retrieveToken())
		{
		  formdata.token =  this.get_token();
		  this.todoservice.add_topup(formdata)
		  .subscribe( 
			data => 
			{
				$('.send-topup button,.send-gateway button').text('Send Topup Request').prop("disabled", false);	
			  if(data.status == 'success')
			  {
					this.toastr.successToastr(data.msg, 'Success!');
					if(1 == 1)
					{
						this.router.routeReuseStrategy.shouldReuseRoute = function(){
							return false;
						}
					}	
					this.router.navigated = false;
					this.router.navigate(['/dashboard/add-money']);
				}
				else if(data.status == 'error')
				{
					this.toastr.errorToastr(data.msg, 'Failed!');
				}
				else if(data.status == 'red' && data.red_auth == 'card')
				{
					window.location.href = "https://www.mydthshop.com/index.php?/app_responses/add_money_pay/?order_id="+data.activity;
				}
				else if(data.status == 'red' && data.red_auth == 'paytm')
				{
					window.location.href = "https://www.mydthshop.com/web-app/do-paytm/addmoney-index.php?pt_t="+data.pt_t+"&order_id="+data.order_id+'&token='+this.get_token()+'&amount='+data.pt_amount;
				}
			}
		  )  
		} 
	}
	fetch_addmoney_order()
	{
		if(!this.get_token())
		{
			return false;
		}	
		  this.todoservice.fetch_addmoney_order({token:this.get_token(),order_id: this.order_id})
		  .subscribe( 
			data => 
			{
			  this.order_data = data.TOPUP;
			}
		) 
	}
  get_token()
  {
    return this.authservice.auth_token();
  }
}

