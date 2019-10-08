import { Component, OnInit ,Renderer2,Inject,ViewContainerRef} from '@angular/core';
import { DOCUMENT,Meta,Title } from "@angular/platform-browser";
import { FormBuilder, Validators, FormGroup,FormControl } from '@angular/forms'; 
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
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
  r_p: number = 1;
  recharge_counts : number;
  complaint_id : number;
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
  constructor(private spinner: NgxSpinnerService ,  
    public todoservice : TodoService,
    private authservice : AuthService,
    @Inject(DOCUMENT) private _document,
    private toastr: ToastsManager,
    private _renderer2: Renderer2, 
    private fb: FormBuilder, 
    vcr: ViewContainerRef,
    private router : Router) { 
      this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
    this.complaintgroup = this.fb.group({
      'title' : [null,Validators.compose([Validators.required])],
       'description' : [null],
     });
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

  do_complaint(order_id)
  {
    this.complaint_id = order_id;
  }
  add_complaint(data)
  {
    if(!this.authservice.authenticate())
    {
        this.router.navigate(['/login']);
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
          this.router.navigate(['/login']);
			  }
			  if(!jQuery.isEmptyObject(data))
			  {			
          this.toastr.success(data.msg);
          let url = window.location.pathname;
            if(url == url)
            {
              this.router.routeReuseStrategy.shouldReuseRoute = function(){
                return false;
             }
              this.router.navigated = false;
              this.router.navigate([url]);	
			      }
        }
      }  
		  );
  }

  export_recharge()
  {
    var date = $('[name="daterange"]').val();
    if(date == '')
    {
      return false;
    }
    window.location.href = this.todoservice.server_url+'accounts/apis/export/export_recharge/?token='+this.get_token()+'&date='+date;
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

  check_delay(order_date)
  {
    let date1 = new Date();
    let date2 = new Date(order_date);
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
        this.init_script();
			}
		  );
  }
}