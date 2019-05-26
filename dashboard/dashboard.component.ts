import { Component, OnInit } from '@angular/core';
import { TodoService } from '../todo.service';
import { AuthService } from '../auth.service';
import { ExcelService } from '../export.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router,NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: []
})
export class DashboardComponent implements OnInit{
  recharge_obj : any ={total_orders : 0,total_sum : 0}; 
  products_obj : any ={total_orders : 0,total_sum : 0}; 
  registration_obj : any ={total_register : 0}; 
  sales_obj : any ={total_sum : 0}; 
  orders : any;
  recharges : any;
  constructor( private excelService: ExcelService, private spinner : NgxSpinnerService, public todoservice : TodoService,private authservice : AuthService,private router : Router) { }
  ngOnInit() {
    $('#search').focus(function(){
        $('.search-result').removeClass('hide');
      });
      $('#search').focusout(function(){
        $('.search-result').addClass('hide');
      });
    this.dashboard_content();
    if(!this.get_token())
    {
      let full_url = this.router.url.split('/');
      if(!full_url[2])
       full_url[2] = '';
      else
        full_url[2] = '#'+full_url[2];
      this.router.navigate(['/login/ref/'+full_url[1]+full_url[2]]);
    }   
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

  get_token()
  {
    return this.authservice.auth_token();
  }
}

