import { Component, OnInit } from '@angular/core';
import { TodoService } from '../todo.service';
import { AuthService } from '../auth.service';
import { Router,ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-recharge-status',
  templateUrl: './recharge-status.component.html',
  styles: []
})
export class RechargeStatusComponent implements OnInit {
  public spin_type :string = 'ball-beat';
  private order_id : string;
  public iterate : number = 0;
  public tick_clock : number = 25;
  public spin_show : boolean = false;
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
    this.todoservice.back_icon_template('Order Invoice',this.todoservice.back())
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
          if(data.status == 'Invalid Token')
          {
            this.router.navigate(['/']);
          }
          this.order = data.ORDER[0];
          this.todoservice.set_user_data(data.USER);
          if((this.order.status == 'Pending' || this.order.status == 'Progress') && this.order.payment_status == 1 && this.iterate < 10)
          {
            this.iterate++;
            setTimeout(()=>{   
             this.fetch_recharge_order_status(this.order_id);
            }, 5000);
            if(this.iterate == 1)
            {
              this.spin_show = true;
              setTimeout(()=>{    
                this.tick_tick_clock();
               }, 1000);
            }
           
          }
          else
          {
            this.spin_show = false;
          }
          this.spinner.hide();
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
    var width = $(window).width(); 
    if(width > 767)
    {
        this.router.navigate(['/home']);
        return;
    }
    this.router.navigate(['/mhome'])    
  }
}
