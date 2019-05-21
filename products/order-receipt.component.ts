import { Component, OnInit } from '@angular/core';
import { TodoService } from '../todo.service';
import { ProductService } from '../product.service';
import { AuthService } from '../auth.service';
import { ActivatedRoute } from '@angular/router';
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
  constructor( public todoservice : TodoService,
    private spinner : NgxSpinnerService,  
    private authservice : AuthService,
    private productservice : ProductService,
    private router : ActivatedRoute) {
      
     }

  ngOnInit() {
    this.router.params.subscribe(params => {
      this.order_id = params['name']; //log the value of id
    this.fetch_order_status(this.order_id);
    });
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
        //console.log(this.orders)
        this.display = 1;
        this.spinner.hide();
        this.todoservice.set_user_data(data.user)
        this.productservice.clear_cart();
      }
		  ) 
  }
  get_token()
  {
    return this.authservice.auth_token();
  }

  pack_list(pack)
  {
    let data =  JSON.parse(pack);
    var list = 'With <ul>';
    this.pack_amount = 0;
    for(var i=0;i<data.length;i++)
    {
      list += '<li>'+data[i].title+'</li>';
      this.pack_amount = this.pack_amount + Number(data[i].price);
    }
    return list+'</ul>';
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
}
