import { Component, OnInit ,Renderer2,Inject,ViewContainerRef} from '@angular/core';
import { DOCUMENT } from "@angular/common";
import {Meta,Title } from "@angular/platform-browser";
import { FormBuilder, Validators, FormGroup,FormControl } from '@angular/forms'; 
import { ToastrManager } from 'ng6-toastr-notifications';
import { TodoService } from '../todo.service';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

import * as moment from 'moment';

@Component({
  selector: 'app-recharge-orders',
  templateUrl: './recharge-orders.component.html',
  styles: []
})
export class RechargeOrdersComponent implements OnInit {
  public recharges : any;
  myControl = new FormControl();
  complaintgroup : FormGroup;
  cancelgroup : FormGroup;
  r_p: number = 1;
  recharge_counts : number;
  complaint_id : number;
  go_to_complaint : number = 0;
  ticket_generated : boolean = false;
  display : number = 1;
  order_id : number ;
  ranges: any = {
    'Today': [moment(), moment()],
    'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
    'This Month': [moment().startOf('month'), moment().endOf('month')],
    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
  }
  selected: {startDate: moment.Moment, endDate: moment.Moment};
  selected_val : Number;
  recharge_order : boolean = false;
  constructor(private spinner: NgxSpinnerService ,  
    public todoservice : TodoService,
    private authservice : AuthService,
    @Inject(DOCUMENT) private _document,
    private toastr: ToastrManager,
    private _renderer2: Renderer2, 
    private fb: FormBuilder, 
    vcr: ViewContainerRef,
    private router : Router) { 
  }

  ngOnInit() {
    this.todoservice.back_icon_template('Orders',this.todoservice.back(1))
    this.complaintgroup = this.fb.group({
      'title' : [null,Validators.compose([Validators.required])]
     });
     this.cancelgroup = this.fb.group({
      'title' : [null,Validators.compose([Validators.required])]
     });
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
    this.fetch_recharge_history(this.r_p); 
    this.init_script()
  }

  init_script()
  {
    let script = this._renderer2.createElement('script');
    script.type = `text/javascript`;
    script.id = `init-page-script`;
    script.text = `$('.modal').modal();$('select').material_select();`;
    this._renderer2.appendChild(this._document.body, script);
  }

  open_cancel_modal(order_id)
  {
    this.order_id = order_id;
  }
  cancel_order(form)
  {
    let data = {order_id : this.order_id , title : form.title, token : this.get_token()};
    this.todoservice.cancel_order(data)
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
          if(data.status == true)
            this.fetch_recharge_history(this.r_p); 
          else
            this.toastr.errorToastr(data.msg);  
        }
      }  
		  );
  }
  do_complaint(_order)
  {
    if(_order.activity_type == 1)
    {
      this.recharge_order = true; 
    }
    this.complaint_id = _order.id;
    this.go_to_complaint = 0;
    let data = {order : this.complaint_id , token : this.get_token()};
    this.todoservice.check_complaint(data)
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
          if(data.status == 1)		
            this.go_to_complaint = 1;
          else
            this.go_to_complaint = 2;  
        }
      }  
		  );

  }
  add_complaint(data)
  {
    if(!this.authservice.authenticate())
    {
        this.router.navigate(['/proceed/login']);
        return;
    }
    this.spinner.show();
    data.token = this.get_token();
    data.order_id = this.complaint_id;
    this.todoservice.add_complaint(data)
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
          if(data.ticket_generated)
          {
            this.ticket_generated = true;
            $('.modal-close').click();
          }
          this.toastr.successToastr(data.msg);
          // let url = window.location.pathname;
          //   if(url == url)
          //   {
          //     this.router.routeReuseStrategy.shouldReuseRoute = function(){
          //       return false;
          //    }
          //     this.router.navigated = false;
          //     this.router.navigate([url]);	
			    //   }
        }
      }  
		  );
  }

  check_val(val)
  {
    if(val == '')
      this.display = 2;
  }
  decode_data(data)
  {
    let jsondecode : any = [];
    if(data != '')
    {
      jsondecode = JSON.parse(data);
      if(jsondecode.operator_title)
      {
        return jsondecode.operator_title;
      }
      else if(jsondecode.product_title)
      {
        let pack = '';
        for(var i = 0;i < jsondecode.pack_selected.length;i++)
        {
          if(jsondecode.product_title.toLowerCase().includes('multi'))
            pack += jsondecode.pack_selected[i].title+'('+jsondecode.pack_selected[i].multi_price+')';
          else
            pack += jsondecode.pack_selected[i].title+'('+jsondecode.pack_selected[i].price+')';  
        }
        return jsondecode.product_title +'('+ pack+')';
      }
    }
    return '';
  }
  export_recharge() 
  {
    var date = $('[name="daterange"]').val();
    if(date == '')
    {
      return;
    }
    window.location.href = this.todoservice.server_url+'accounts/apis/export/export_orders/?token='+this.get_token()+'&date='+date;
  }

  paging_recharge_history(page)
  {
    if(!this.authservice.authenticate())
    {
        this.router.navigate(['/proceed/login']);
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
				this.router.navigate(['/proceed/login']);
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

  check_delay(order_date)
  {
    let date1 = new Date();
    let date2 = order_date * 1000;
    let diffTime : Number = Math.abs(Number(date2) - Number(date1));
    if(Number(diffTime) / (1000 * 60 ) > 15)
    {
      return 1;
    }
    else
    {
      return 2;
    }
  }

  seach_order()
  {
    var key = $("#order-id").val();
    if(key != null)
    {
      this.spinner.show();
    let data =  {token : this.get_token(),key : key};
    this.todoservice.search_order(data)
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
          this.recharges      = data.ORDERS;
          this.recharge_counts  = this.recharges.length;	
        }
        this.init_script();
			}
		  );
    } 
  }
  fetch_recharge_history(page)
  {
    if(!this.authservice.authenticate())
    {
        this.router.navigate(['/proceed/login']);
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
          this.router.navigate(['/proceed/login']);
			  }
			  if(!jQuery.isEmptyObject(data))
			  {
				  this.recharges      = data.RECHARGES;						
          this.recharge_counts  = data.RECHARGES_COUNT;			
        }
        this.init_script();
			}
		  );
  }
}
