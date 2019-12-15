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
		
		$(document).ready(function() {	
        $('.filter-show').on('click',function(){
            $('.filter-he').removeClass('hide');
            $('.filter-he').toggle(500);
        });
			
		$('#paymethod').change(function(){
			
			if($(this).val() == 'Others')
			{
				$("[for='bank-id']").text("Please Specify");
				$('.change-hide').hide();
			}
			else
			{
				$("[for='bank-id']").text("Bank Reference ID*");
				$('.change-hide').show();
			}		
		});
    });
	let script = this._renderer2.createElement('script');
    script.type = `text/javascript`;
    script.text = `
      $('select').material_select();
    `;
    this._renderer2.appendChild(this._document.body, script);
  }
  
	add_money(formdata)
	{
		if(formdata.amount == '')
		{
			this.toastr.errorToastr("Enter Amount", 'Failed!');
			return false;
		}
		formdata.paymethod 		= $('#paymethod').val();
		formdata.paybankaccount = $('#paybankaccount').val();
		formdata.yourbankname 	= $('#yourbankname').val(); 
			
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
			  }
			}
		  )  
		} 
	}
  get_token()
  {
    return this.authservice.auth_token();
  }
}

