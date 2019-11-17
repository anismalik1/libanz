import { Component, OnInit,Renderer2,Inject } from '@angular/core';
import { DOCUMENT } from "@angular/platform-browser";
import { TodoService } from '../todo.service';
import { AuthService } from '../auth.service';
import { ExcelService } from '../export.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router,NavigationExtras } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: []
})
export class DashboardComponent implements OnInit{
  recharge_obj : any ={total_orders : 0,total_sum : 0}; 
  products_obj : any ={total_orders : 0,total_sum : 0}; 
  registration_obj : any ={total_register : 0}; 
  sales_obj : any = {}; 
  orders : any;
  recharges : any;
  ranges: any = {
    'Last 7 Days': [moment().subtract(6, 'days'), moment(),'active'],
    'Today': [moment(), moment()],
    'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
    'This Month': [moment().startOf('month'), moment().endOf('month')],
    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
  }
  selected: {start: moment.Moment, end: moment.Moment};
  constructor( private excelService: ExcelService, 
    private spinner : NgxSpinnerService, 
    public todoservice : TodoService,
    private _renderer2: Renderer2,
    @Inject(DOCUMENT) private _document, 
    private authservice : AuthService,private router : Router) { }
  ngOnInit() {
    $('#search').focus(function(){
        $('.search-result').removeClass('hide');
      });
      $('#search').focusout(function(){
        $('.search-result').addClass('hide');
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
    this.spinner.show();
    this.fetch_transactions(); 
    this.recent_orders();  
  }

  recent_orders()
  {
    this.spinner.show();
    this.todoservice.fetch_recent_orders({token : this.get_token()})
    .subscribe(
      data => 
      {
        this.spinner.hide();
        if(data.status == 'Invalid Token')
        {
          this.authservice.clear_session();
          this.router.navigate(['/home']);
        }
        else
        {
          this.orders         = data.ORDERS;
          this.recharges      = data.RECHARGES;
        }
      }
    ) 
  }



  fetch_transactions()
  {
    this.spinner.show();
    var date = $('[name="daterange"]').val();
    if(date == '')
    {
      date = moment().subtract(6, 'days').format('DD-MM-YYYY') +' To '+ moment().format('DD-MM-YYYY')
      $('[name="daterange"]').val(date)
    }

    this.todoservice.fetch_transactions({date : date, token : this.get_token()})
      .subscribe(
        data => 
        {
          this.spinner.hide();
          if(data.status == 'Invalid Token')
          {
            this.authservice.clear_session();
            this.router.navigate(['/home']);
          }
          else
          {
            this.filter_sales(data.SALES);
          }
        }
      ) 
  }
  filter_sales(sales_activity)
  {
    this.sales_obj.recharge_sale  = 0;
    this.sales_obj.order_sale     = 0;
    this.sales_obj.cashback_sale  = 0;
    this.sales_obj.promo_sale     = 0;
    this.sales_obj.recharge_count = 0;
    this.sales_obj.order_count    = 0;

    let recharge_sale = sales_activity.filter(x => x.activity_type == 1);  // recharge sale
    if(recharge_sale.length > 0 )
    {
      this.sales_obj.recharge_count = recharge_sale.length;
      for(var i = 0;i < recharge_sale.length;i++)
      {
        this.sales_obj.recharge_sale += Number(recharge_sale[i].amount); 
      }
    }

    let order_sale = sales_activity.filter(x => x.activity_type == 5);  // order sale
    if(order_sale.length > 0 )
    {
      this.sales_obj.order_count = order_sale.length;
      for(var i = 0;i < order_sale.length;i++)
      {
        this.sales_obj.order_sale +=  Number(order_sale[i].amount); 
      }
    }

    let cashback_sale = sales_activity.filter(x => x.activity_type == 8);  // cashback sale
    if(cashback_sale.length > 0 )
    {
      for(var i = 0;i < cashback_sale.length;i++)
      {
        this.sales_obj.cashback_sale += Number(cashback_sale[i].amount);
      }
    }

    let promo_sale = sales_activity.filter(x => x.activity_type == 14);  // Promocodes 
    if(promo_sale.length > 0 )
    {
      for(var i = 0;i < promo_sale.length;i++)
      {
        this.sales_obj.promo_sale += Number(promo_sale[i].amount);
      }
    }
  }
  init_script()
  {
    if($('#init-page-script'))
    {
      $('#init-page-script').remove();
    }
    let script = this._renderer2.createElement('script');
    script.type = `text/javascript`;
    script.id = `init-page-script`;
    script.text = `
        $(document).ready(function(){
          $('.modal').modal();
        });  `;
  }
  
  orders_to_export()
  {
    if(this.authservice.retrieveToken())
	  {
      $('#export-order-txt').text('PLEASE WAIT...');
      let data = {token : this.get_token()};
      this.todoservice.export_all_orders(data)
      .subscribe(
        data => 
        {
          if(data.status == 'Invalid Token')
          {
            this.authservice.clear_session();
            this.router.navigate(['/home']);
          }
          let b = JSON.stringify(data);
          data =  JSON.parse(b.replace(/\\/g, ''));
          if(!jQuery.isEmptyObject(data))
          {
            this.excelService.exportAsExcelFile(data.ORDERS, 'orders');
          }
          $('#export-order-txt').text('EXPORT ALL DATA');
        }
      )  
    }
    else{
      this.router.navigate(['/home']);
    }
    
  }

  recharges_to_export()
  {
    if(this.authservice.retrieveToken())
	  {
      $('#export-recharge-txt').text('PLEASE WAIT...');
      let data = {token : this.get_token()};
      this.todoservice.export_all_recharges(data)
      .subscribe(
        data => 
        {
          if(data.status == 'Invalid Token')
          {
            this.authservice.clear_session();
            this.router.navigate(['/login']);
          }
          let b = JSON.stringify(data);
          data =  JSON.parse(b.replace(/\\/g, ''));
          if(!jQuery.isEmptyObject(data))
          {
            this.excelService.exportAsExcelFile(data.RECHARGES, 'recharges');
          }
          $('#export-recharge-txt').text('EXPORT ALL DATA');
        }
      )  
    }
    else
    {
      this.router.navigate(['/home']);
    }
    
  }

  dashboard_content()
  {
    this.spinner.show();
    if(this.authservice.retrieveToken())
	  {
      let data = {token : this.get_token()};
      this.todoservice.dashboard_content(data)
      .subscribe(
        data => 
        {
          if(data.status == 'Invalid Token')
          {
            this.authservice.clear_session();
            this.router.navigate(['/home']);
          }
          let b = JSON.stringify(data);
          data =  JSON.parse(b.replace(/\\/g, ''));
          if(!jQuery.isEmptyObject(data))
          {
            this.sales_obj.total_sum        = data.SALES[0].sales;
            if(data.RECHARGES[0])
            {
              this.recharge_obj.total_orders  = data.RECHARGESALE[0].order_count;
              this.recharge_obj.total_sum     = data.RECHARGESALE[0].total_sum;
            }
            
            this.products_obj.total_orders  = data.DTHORDERS[0].order_count;
            this.products_obj.total_sum     = data.DTHORDERS[0].total_sum;
            this.orders                     = data.ORDERS;
            this.recharges                  = data.RECHARGES;
          }
          this.spinner.hide();
        }
      )  
    }
    else
    {
      this.router.navigate(['/home']);
    }
  }

  add_complaint()
  {
    
  }

  get_token()
  {
    return this.authservice.auth_token();
  }
}

