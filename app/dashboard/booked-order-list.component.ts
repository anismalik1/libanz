import { Component, OnInit } from '@angular/core';
import { TodoService } from '../todo.service';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-booked-order-list',
  templateUrl: './booked-order-list.component.html',
  styles: []
})
export class BookedOrderListComponent implements OnInit {
    orders : any;
   constructor( public todoservice : TodoService,private authservice : AuthService,private router : Router,private spinner : NgxSpinnerService) {
       this.fetch_booked_orders()
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
   }
   
   fetch_booked_orders()
   {
    if(!this.get_token() )
    {
      this.router.navigate(['/']);
      return false;
    }
     this.spinner.show();
     let data : any = {token : this.get_token()};
     this.todoservice.fetch_booked_orders(data)
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
           this.orders = data.PARTNERORDERS;
           this.spinner.hide();
         }
       ) 
   }
 
   get_token()
   {
     return this.authservice.auth_token();
   }
 }
 
