import { Component, OnInit } from '@angular/core';
import { TodoService } from '../todo.service';
import { AuthService } from '../auth.service';
import { ProductService } from '../product.service';
import { Router,ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styles: [],
  providers : [ProductService]
})
export class CartComponent implements OnInit{

  public user = {phone:'loading',name:'loading'};
  public items : any = [];
  push_cart_id : number;
  constructor( public todoservice : TodoService,
    private authservice : AuthService,
    public productservice : ProductService
  ) {
      this.productservice.loadCart();
      this.refreshCart(); 
   }

   refreshCart() : void
   {
     this.productservice.loadCart();
   }
  ngOnInit() {
    $('.copy-click').on('click',function(){			
			$('.copy-click').attr('disabled');
    });
  }
  change_count(p_id,op)
  {
    this.productservice.changeItemCount(p_id,op);
    this.refreshCart();
  }
  get_token()
  {
    return this.authservice.auth_token();
  }
  convert_to_object(string)
  {
    return JSON.parse(string);
  }
}

