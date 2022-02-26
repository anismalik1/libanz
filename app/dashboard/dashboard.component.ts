import { Component, OnInit,Renderer2,Inject,PLATFORM_ID } from '@angular/core';
import { DOCUMENT } from "@angular/common";
import { TodoService } from '../todo.service';
import { AuthService } from '../auth.service';
import { ExcelService } from '../export.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router,NavigationExtras } from '@angular/router';
import * as moment from 'moment';
import {isPlatformBrowser} from '@angular/common';
import {BehaviorSubject} from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: []
})
export class DashboardComponent implements OnInit{
  static isBrowser = new BehaviorSubject<boolean>(null!);
  recharge_obj : any ={total_orders : 0,total_sum : 0}; 
  products_obj : any ={total_orders : 0,total_sum : 0}; 
  registration_obj : any ={total_register : 0}; 
  sales_obj : any = {}; 
  leads : any;
  orders : any;
  topups : any;
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
    @Inject(PLATFORM_ID) private platformId: any ,
    private spinner : NgxSpinnerService, 
    public todoservice : TodoService,
    private _renderer2: Renderer2,
    @Inject(DOCUMENT) private _document, 
    private authservice : AuthService,private router : Router) { 
      DashboardComponent.isBrowser.next(isPlatformBrowser(platformId));
    }
  ngOnInit() {
    this.todoservice.back_icon_template('Dashboard',this.todoservice.back(1))
    if(isPlatformBrowser(this.platformId)) 
    {
      $('#search').focus(function(){
        $('.search-result').removeClass('hide');
      });
      $('#search').focusout(function(){
        $('.search-result').addClass('hide');
      });
    }
    
    
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
    this.spinner.show();
    if(isPlatformBrowser(this.platformId)) 
      this.fetch_transactions(); 
    if(isPlatformBrowser(this.platformId))   
      this.recent_orders();  
  }

  balance_after(order)
  {
    if(order.transaction_type == 1 && order.payment_status == 1)
    {
      return order.balance_before*1+order.grand_total*1+order.commission_surcharge*1;
    }
    else if(order.transaction_type == 1 && (order.payment_status == 2 || order.payment_status == 3))
    {
      return order.balance_before*1;
    }
    else if(order.transaction_type == 2)
    {
      return order.balance_before*1-order.grand_total*1+order.commission_surcharge*1
    }
    else if(order.transaction_type == 3)
    {
      return order.balance_before*1 +order.commission_surcharge*1;
    }
    else
    {
      return order.balance_before*1 + order.commission_surcharge*1;
    }  
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
          this.orders     = data.ORDERS;
          this.topups     = data.ADDMONEYVALUEORDERS;
          if(data.LEADS)
            this.leads      = data.LEADS;
        }
      }
    ) 
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
  
  fetch_transactions()
  {
    this.spinner.show();
    var date = $('[name="daterange"]').val();
    if( date == '' )
    {
      date = moment().subtract(6, 'days').format('DD-MM-YYYY') +' To '+ moment().format('DD-MM-YYYY')
      $('[name="daterange"]').val(date);
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

  sales_object_init()
  {
    this.sales_obj.order_sale       = 0;
    this.sales_obj.order_count      = 0;
    this.sales_obj.cashback_sale    = 0;
    this.sales_obj.cashback_count   = 0;
    this.sales_obj.ticket_count     = 0;
    this.sales_obj.addmoney         = 0;
    this.sales_obj.addmoney_count   = 0;
  }

  filter_sales(sales_activity)
  {
    this.sales_object_init();
    let morder_sale = sales_activity.filter(x => x.activity_type == 1 || x.activity_type == 5);  // recharge sale
    if(morder_sale.length > 0 )
    {
      this.sales_obj.order_count = morder_sale.length;
      for(var i = 0;i < morder_sale.length;i++)
      {
        this.sales_obj.order_sale += Number(morder_sale[i].amount); 
      }
    } 

    let tickets = sales_activity.filter(x => x.activity_type == 10);  // order sale
    if(tickets.length > 0 )
    {
      this.sales_obj.ticket_count = tickets.length;
      for(var i = 0;i < tickets.length;i++)
      {
        this.sales_obj.tickets +=  Number(tickets[i].amount); 
      }
    }

    let cashback_sale = sales_activity.filter(x => x.activity_type == 8 ||  x.activity_type == 14);  // cashback sale
    if(cashback_sale.length > 0 )
    {
      this.sales_obj.cashback_count = cashback_sale.length;
      for(var i = 0;i < cashback_sale.length;i++)
      {
        this.sales_obj.cashback_sale += Number(cashback_sale[i].amount);
      }
    }

    // let promo_sale = sales_activity.filter(x => x.activity_type == 14);  // Promocodes 
    // if(promo_sale.length > 0 )
    // {
    //   for(var i = 0;i < promo_sale.length;i++)
    //   {
    //     this.sales_obj.promo_sale += Number(promo_sale[i].amount);
    //   }
    // }

    let addmoney = sales_activity.filter(x => x.activity_type == 4);  // Promocodes 
    if(addmoney.length > 0 )
    {
      this.sales_obj.addmoney_count = addmoney.length;
      for(var i = 0;i < addmoney.length;i++)
      {
        this.sales_obj.addmoney += Number(addmoney[i].amount);
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
            this.router.navigate(['/proceed/login']);
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

  // dashboard_content()
  // {
  //   this.spinner.show();
  //   if(this.authservice.retrieveToken())
	//   {
  //     let data = {token : this.get_token()};
  //     this.todoservice.dashboard_content(data)
  //     .subscribe(
  //       data => 
  //       {
  //         if(data.status == 'Invalid Token')
  //         {
  //           this.authservice.clear_session();
  //           this.router.navigate(['/home']);
  //         }
  //         let b = JSON.stringify(data);
  //         data =  JSON.parse(b.replace(/\\/g, ''));
  //         if(!jQuery.isEmptyObject(data))
  //         {
  //           this.sales_obj.total_sum        = data.SALES[0].sales;
  //           if(data.RECHARGES[0])
  //           {
  //             this.recharge_obj.total_orders  = data.RECHARGESALE[0].order_count;
  //             this.recharge_obj.total_sum     = data.RECHARGESALE[0].total_sum;
  //           }
            
  //           this.products_obj.total_orders  = data.DTHORDERS[0].order_count;
  //           this.products_obj.total_sum     = data.DTHORDERS[0].total_sum;
  //           this.orders                     = data.ORDERS;
  //         }
  //         this.spinner.hide();
  //       }
  //     )  
  //   }
  //   else
  //   {
  //     this.router.navigate(['/home']);
  //   }
  // }

  get_token()
  {
    return this.authservice.auth_token();
  }
}

