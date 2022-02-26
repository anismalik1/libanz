import { Component, OnInit ,ViewContainerRef,Renderer2,Inject,PLATFORM_ID} from '@angular/core';
import { DOCUMENT } from "@angular/common";
import { TodoService } from '../todo.service';
import { AuthService } from '../auth.service';
import { Router ,ActivatedRoute} from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrManager } from 'ng6-toastr-notifications';
import {isPlatformBrowser} from '@angular/common';
import {BehaviorSubject} from 'rxjs';
import { NgxSpinner } from 'ngx-spinner/lib/ngx-spinner.enum';
@Component({
  selector: 'app-add-money',
  templateUrl: './add-money.component.html',
  styles: []
})
export class AddMoneyComponent implements OnInit{
	static isBrowser = new BehaviorSubject<boolean>(null!);
	public user = {phone:'loading',name:'loading'};
	paybankaccount : string = '';
	yourbankname : string = '';
	paymethod! : string;
	order_id : any;
	order_data : any;
	previousUrl!: string;
	add_data : any = {proceed : 1,paymethod : 'FUND TRANSFER',send : 0};
	add_amount! : number;
	constructor( private toastr : ToastrManager,private _renderer2: Renderer2,
		private spinner : NgxSpinnerService, 
		@Inject(PLATFORM_ID) private platformId: any ,
		@Inject(DOCUMENT) private _document,private vrc: ViewContainerRef,
		public todoservice : TodoService,private authservice : AuthService,
		private router : Router,private route : ActivatedRoute) { 
			AddMoneyComponent.isBrowser.next(isPlatformBrowser(platformId));
  }
  ngOnInit() {
		this.todoservice.back_icon_template('Add Money',this.todoservice.back(1))
    if(!this.get_token())
    {
      let full_url = this.router.url.split('/');
      if(!full_url[2])
       full_url[2] = '';
      else
        full_url[2] = '#'+full_url[2];
			this.router.navigate(['/proceed/login/ref/'+full_url[1]+full_url[2]]);
			return ;
		}
		this.route.params.subscribe(params => {
      this.order_id = params['name'];
			if(this.order_id > 0)
				this.fetch_addmoney_order();
	 });
	 if(isPlatformBrowser(this.platformId)) 
	 {
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
  }
  hide_err()
  {
	$('#interval-error').text(""); 
  }
	proceed_to_add()
	{
		var amount = $("#enter-amount").val();
		if(amount == "")
		{
			$('#interval-error').text("Enter Amount");
			return;
		}

		if(amount > 25000)
		{
			$('#interval-error').text("Transfer limit is 25000 INR on single day.");
			// this.toastr.errorToastr("",'Failed');
			return;
		}
		this.spinner.show();
		this.todoservice.fetch_addmoney_calculation({token:this.get_token(),amount : amount})
		.subscribe( 
		  data => 
		  {
			this.spinner.hide();
			if(data.status == 'true')
			{
				this.add_data.amount = amount;
				this.add_data.proceed = 2;
			}
			else
			{
				// this.toastr.errorToastr(,'Failed');
				$('#interval-error').text(data.msg);
				return;
			}
		  }
	  	) 
		
		
	}

	select_method(method : string ,ele : any ,margin: number)
	{
		this.add_data.paymethod = method;
		var checked = ele.target.parentNode.parentNode.innerHTML;
			$('#method-selected').html(checked);
			setTimeout(()=>{   
				if(method == 'FUND TRANSFER')
					$('#fund').prop('checked','checked')
			 }, 300);
			$('#method-selected input').remove();
			$('#method-selected label').before('<i class="material-icons orange-text">check_circle</i>&nbsp;');
			window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
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
	// calc_percentage()
	// {
	// 	var amount = $('#enter-amount').val()
	// 	if((this.paymethod) && (this.paymethod == 'Gateway' || this.paymethod == 'Paytm' || this.paymethod == 'Cash Deposit'))
	// 	{
	// 		$('.additional-charge').html('<div class="chip orange white-text">Additional 2% Amount Will be Deducted. Effective Amount '+(Number(amount) - (Number(amount)*2)/100)+' Will be credited.<i class="close material-icons">close</i></div>');
	// 	}
	// }

	// check_method(data)
	// {
	// 	this.paymethod = data;
	// 	if(data == undefined)
	// 	{
	// 		$('.default-hide').addClass('hide');
	// 		$('.send-topup').addClass('hide');
	// 		$('.send-gateway').addClass('hide');
	// 	}
	// 	else if( data == 'Gateway' || data == "Paytm" || data == "Cash Deposit")
	// 	{
			
	// 		var amount = $('#enter-amount').val();
	// 		$('.additional-charge').removeClass('hide');
	// 		if(Number(amount) > 0)
	// 			$('.additional-charge ').html('<div class="chip orange white-text">Additional 2% Amount Will be Deducted. Effective Amount '+(Number(amount) - (Number(amount)*2)/100)+' Will be credited.<i class="close material-icons">close</i></div>');
	// 		$('.default-hide').addClass('hide');
			
	// 		$('.send-gateway').removeClass('hide');
	// 		$('.send-topup').addClass('hide');
	// 		if(data == "Cash Deposit")
	// 			$('.default-hide').removeClass('hide');
	// 	}
	// 	else if(data == 'FUND TRANSFER')
	// 	{
	// 		$('.default-hide').removeClass('hide');
	// 		$('.send-topup').removeClass('hide');
	// 		$('.additional-charge').addClass('hide');
	// 		$('.send-gateway').addClass('hide');
	// 	}
	// 	else
	// 	{
	// 		$('.default-hide').removeClass('hide');
	// 		$('.additional-charge').removeClass('hide');
	// 		$('.send-topup').removeClass('hide');
	// 		$('.send-gateway').addClass('hide');
	// 	}
	// }
	
	add_money(formdata)
	{
		if(this.add_data.paymethod == 'FUND TRANSFER' || this.add_data.paymethod == "Cash Deposit")
		{
			if(formdata.ref_id == '')
			{
				this.toastr.errorToastr("Enter Reference ID", 'Failed!');
				return;
			}
		}

		formdata.paymethod 		= this.add_data.paymethod;
		formdata.amount 		= this.add_data.amount;
		this.add_data.send = 1;
		if(this.authservice.retrieveToken())
		{
		  formdata.token =  this.get_token();
		  this.todoservice.add_topup(formdata)
		  .subscribe( 
			data => 
			{
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
					this.router.navigate(['/dashboard/add-money/'+data.order_id]);
				}
				else if(data.status == 'error')
				{
					this.toastr.errorToastr(data.msg, 'Failed!');
				}
				else if(data.status == 'red' && data.red_auth == 'card')
				{
					window.location.href = this.todoservice.base_url+"accounts/apis/response/add_money_pay/?order_id="+data.activity;
				}
				else if(data.status == 'red' && data.red_auth == 'paytm')
				{
					window.location.href = this.todoservice.base_url+"accounts/apis/response/paytm_form_addmoney?ORDERID="+data.order_id+'&token='+this.get_token();
				}
			}
		  )  
		} 
	}
	fetch_addmoney_order()
	{
		if(!this.get_token())
		{
			return;
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

