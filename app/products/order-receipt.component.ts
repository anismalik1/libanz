import { Component, OnInit } from '@angular/core';
import { TodoService } from '../todo.service';
import { ProductService } from '../product.service';
import { AuthService } from '../auth.service';
import { ActivatedRoute ,Router} from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-order-receipt',
  templateUrl: './order-receipt.component.html',
  styles: []
})
export class OrderReceiptComponent implements OnInit {
  private order_id : string;
  orders : any;
  display = 0;
  pack_amount : number = 0;
  checkbox_text : any = {checkbox : false,radio : false,no_input : false};
  constructor( public todoservice : TodoService,
    private spinner : NgxSpinnerService,  
    private authservice : AuthService,
    public productservice : ProductService,
    private router : ActivatedRoute,private route : Router) {
      
     }

  ngOnInit() {
    if(!this.get_token())
    {
      this.route.navigate(['/']);
    }
    this.router.params.subscribe(params => {
      this.order_id = params['name']; //log the value of id
    this.fetch_order_status(this.order_id);
    });
    if(this.todoservice.get_param('tracker') && this.todoservice.get_param('tracker') == 'cart')
    {
      // this.productservice.clear_cart();
      this.todoservice.clear_cart({token : this.get_token()});
    }
  }


  fetch_order_status(id)
  {
      this.spinner.show();
		  let data = {token : this.get_token(),order_id : id};
		  this.todoservice.fetch_order_status(data)
		  .subscribe(
			data => 
			{
        this.spinner.hide();
        let b = JSON.stringify(data);
        data =  JSON.parse(b.replace(/&nbsp;/g, ''));
        this.orders = data.order;
        this.display = 1;
        this.spinner.hide();
        this.todoservice.set_user_data(data.user);
      }
		  ) 
  }

  clearcart()
  {
    this.todoservice.clear_cart({token : this.get_token()})
    .subscribe(
			data => 
			{
        
      });
  }

  get_token()
  {
    return this.authservice.auth_token();
  }

  pack_data(order)
  {
    let data =  JSON.parse(order.pack_selected);
    var list = 'With <ul>';
    this.pack_amount = 0;
    let pack_data : any = {} 
    for(var i=0;i<data.length;i++)
    {
      list += '<li>'+data[i].title+'</li>';
      if( order.title && order.title.toLowerCase().includes('multi') )
        this.pack_amount = this.pack_amount + Number(data[i].multi_price);
      else
        this.pack_amount = this.pack_amount + Number(data[i].price);  
    }
    this.pack_amount = this.pack_amount * order.qty
    list+'</ul>';
    return pack_data = { list : list , amount : this.pack_amount };
  }

  decode_json(pack)
  {
    let data =  JSON.parse(pack);
    return data;
  }

  to_number(num)
  {
    return 1 * num; 
  }

  amount_payable(order)
  {
    this.pack_data(order);
    var $amount : number = order.grand_total;
    if(order.promo_cashback != null && order.promo_cashback > 0)
    {
      $amount = 1 * $amount - 1 * order.promo_cashback;
    }
    if(order.bonus_amount > 0)
    {
      $amount = 1*$amount - order.bonus_amount;
    }
    if(this.pack_amount > 0)
    {
      $amount = 1*$amount +this.pack_amount;
    }
    return $amount;
  }

  calculate_amount(order)
  {
    //console.log(order);
    let packs =  JSON.parse(order.pack_selected);
    this.pack_amount = 0;
    for(var i=0;i<packs.length;i++)
    {
      this.pack_amount = this.pack_amount + Number(packs[i].price);
    }
    return Number(order.grand_total)+ this.pack_amount;
  }

  back_to_home()
  {
    var width = $(window).width(); 
    if(width > 767)
    {
        this.route.navigate(['/home']);
        return;
    }
    this.route.navigate(['/mhome'])    
  }
}
