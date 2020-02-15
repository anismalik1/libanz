import { Component, OnInit } from '@angular/core';
import { TodoService } from '../todo.service';
import { AuthService } from '../auth.service';
import { Router,ActivatedRoute, Route } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-recharge-status',
  templateUrl: './recharge-status.component.html',
  styles: []
})
export class RechargeStatusComponent implements OnInit {

  private order_id : string;
  private iterate : number = 0;
  public tick_clock : number = 25;
  order : any;
  constructor( public todoservice : TodoService,
  private spinner : NgxSpinnerService,  
  private authservice : AuthService,
  private router : Router,
  private route : ActivatedRoute) {
    this.order_id = route.snapshot.params['name'];
    if(this.order_id != '')
      this.fetch_recharge_order_status(this.order_id); 
   }
  ngOnInit() {
     
  }
  
  fetch_recharge_order_status(id)
  {
      if(this.iterate == 0)
      {
        this.spinner.show();
      }
      
		  let data = {token : this.get_token(),order_id : id};
		  this.todoservice.fetch_recharge_order_status(data)
		  .subscribe(
        data => 
        {
          this.spinner.hide();
          let b = JSON.stringify(data);
          data =  JSON.parse(b.replace(/&nbsp;/g, ''));
          this.order = data.ORDER[0];
          this.todoservice.set_user_data(data.USER);
          this.spinner.hide();
          if(this.order.recharge_status ==3 && this.iterate < 25)
          {
            this.iterate++;
            setTimeout(()=>{    
             this.fetch_recharge_order_status(this.order_id);
            }, 5000);
            if(this.iterate == 1)
            {
              setTimeout(()=>{    
                this.tick_tick_clock();
               }, 1000);
            }
           
          }
        }
		  ) 
  }

  operator(data,action)
  {
    let jsondecode : any = [];
    if(data != '')
    {
      jsondecode = JSON.parse(data);
      if(action == 'title' && jsondecode.operator_title)
      {
        return jsondecode.operator_title;
      }
      if(action == 'image' && jsondecode.operator_image)
      {
        return jsondecode.operator_image;
      }
      return '';
    }
  }
  
  tick_tick_clock()
  {
    if(this.tick_clock > 0)
    {
      this.tick_clock--;
    }
    
    if(this.order.recharge_status == 3)
    {
      setTimeout(()=>{    
        this.tick_tick_clock();
       }, 1000);
    }
  }
  get_token()
  {
    return this.authservice.auth_token();
  }
  back_to_home()
  {
    this.router.navigate(['/'])    
  }
}
