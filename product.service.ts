import { Injectable } from '@angular/core';
import { Product } from './product.entities';
import { Item } from './item.entities';
import { Observable } from 'rxjs/Observable';
import { Headers,Http,HttpModule } from '@angular/http';
import 'rxjs/add/observable/of';
import  'rxjs/add/operator/catch';
import  'rxjs/add/operator/map';
import * as $ from 'jquery';

@Injectable()
export class ProductService {

  public server_url : string = "https://www.mydthshop.com/";
  public base_url : string = 'http://localhost:4200/';
  public service_url : string = 'https://www.mydthshop.com/index.php?/app_services/';
  public request_action : string ;
  public dropdown_add_money = {paymethod: '',paybankaccount:'',yourbankname : '' };
  private product : Product;
  private products : Product[];
  private item : Item;
  public cartItems: number = 0;
  public cart_items : Item[] = [];
  cod_invalid = false; 
  constructor(private http : Http )
  {
    this.loadCart();
  } 
 
  loadCart() : void
   {
    this.cart_items = [];
    let cod_count :number  = 0;
    let cart = JSON.parse(localStorage.getItem('cart'));
    if(cart != null)
    {
      for(var i =0;i<Object.keys(cart).length; i++)
      {
        let item = JSON.parse(cart[i]);
        if(item.product.cod_available && Number(item.product.cod_available) == 0)
        {
          cod_count = cod_count + 1;
        }
        this.cart_items.push({
          product : item.product,
          quantity : item.quantity
        });
      }

      if(cod_count > 0)
      {
        this.cod_invalid = true;
      }
    } 
   }

  setItem(products : Product)
  {
      this.product = products;
  }

  getItems() : Product[]
  {
    return this.products;
  }

  select_by_id(id : number) 
  {
    for(var i=0;i<this.products.length ;i++)
    {
        if(this.products[i].id == id)
        {   
            return id;
        }
    }
    return -1;
  }

  if_exist_in_cart(push_cart_id)
  {
    let cart :any = JSON.parse(localStorage.getItem('cart'));
    let index : number = -1;
    if(cart != null)
    {
      for(var i =0;i< Object.keys(cart).length;i++)
      {
        let item :Item = JSON.parse(cart[i]);
        if(item.product.id == push_cart_id)
        {
          index = i;
          break;
        } 
      }
    }
    
    if(index == -1)
    {
     return false;
    }
    return true;
  }
  addto_cart(id : number)
  {
    let push_cart_id = id;
      if(push_cart_id)
      {
        var item : Item = {
          product   : this.product,
          quantity  : 1
        };
        if( localStorage.getItem('cart') == null )
        {
          let cart :any = [];
          cart.push(JSON.stringify(item));
          localStorage.setItem('cart',JSON.stringify(cart));
        }
        else
        {
          let cart :any = JSON.parse(localStorage.getItem('cart'));
          let index : number = -1;
          for(var i =0;i< Object.keys(cart).length;i++)
          {
            let item :Item = JSON.parse(cart[i]);
            if(item.product.id == push_cart_id)
            {
              index = i;
              break;
            } 
          }
          
          if(index == -1)
          {
            cart.push(JSON.stringify(item));
            localStorage.setItem('cart',JSON.stringify(cart));
          }else
          {
            var item_2 = JSON.parse(cart[index]);
            item_2.quantity += 1;
            cart[index] = JSON.stringify(item_2);
            localStorage.setItem('cart',JSON.stringify(cart));
          }
        }
        this.loadCart();
      }
      else
      {

      }
    this.cartItemsCount();   
  }

  set_region(region)
  {
    localStorage.setItem('region',JSON.stringify(region));
  }

  get_region()
  {
    if( localStorage.getItem('region') != null )
    {
      return JSON.parse(localStorage.getItem('region'));
    }
    return false;
  }
  cartItemsCount() 
  {
    if(localStorage.getItem('cart') != null)
    {
      let cart :any = JSON.parse(localStorage.getItem('cart'));
      this.cartItems =  Object.keys(cart).length;
      return this.cartItems;
    }
    return 0;
  }

  calculateCartAmount() : number{
    let cart :any = JSON.parse(localStorage.getItem('cart'));
    let index : number = -1;
    let amount : number = 0;
    if(cart == null)
    {
      return amount;
    }
    for(var i =0;i< Object.keys(cart).length;i++)
    {
      let item :Item = JSON.parse(cart[i]);
      if(item.product.tsk_kit && item.product.tsk_kit == 3)
      {
        amount += (item.product.price -1000) * item.quantity
      }
      else
      {
        amount += item.product.offer_price * item.quantity;
      }
      if(item.product.pack_selected[0])
        amount += Number(item.product.pack_selected[0].price);
      if(item.product.pack_selected[1])
        amount += Number(item.product.pack_selected[1].price);
      if(item.product.promos)
      {
        if(item.product.promos.discount <= item.product.promos.max_discount)
        {
          amount = amount - Number(item.product.promos.discount);
        }
      }  
    }
    return amount; 
  }

  calculateCartAmountWithoutOffer() : number{
    let cart :any = JSON.parse(localStorage.getItem('cart'));
    let index : number = -1;
    let amount : number = 0;
    if(cart == null)
    {
      return amount;
    }
    for(var i =0;i< Object.keys(cart).length;i++)
    {
      let item :Item = JSON.parse(cart[i]);
      amount += item.product.price * item.quantity;
      
    }
    return amount;
  }

  total_savings()
  {
    let cart :any = JSON.parse(localStorage.getItem('cart'));
    let index : number = -1;
    let amount : number = 0;
    let mrp_amount : number = 0;
    let offer_amount : number = 0;
    if(cart == null) 
    {
      return amount;
    }
    for(var i =0;i< Object.keys(cart).length;i++)
    {
      let item :Item = JSON.parse(cart[i]);
      mrp_amount += item.product.price * item.quantity;
      if(item.product.tsk_kit && item.product.tsk_kit == 3)
      {
        offer_amount += (item.product.price -1000) * item.quantity
      }
      else
      {
        offer_amount += item.product.offer_price * item.quantity;
      }
      
      if(item.product.promos)
      {
        if(item.product.promos.discount <= item.product.promos.max_discount)
        {
          offer_amount = offer_amount - Number(item.product.promos.discount);
        }
      }  
    }
    return (mrp_amount - offer_amount); 
  }

  check_cashon_delivery()
  {
    let cart :any = JSON.parse(localStorage.getItem('cart'));
    var index = false;
    for(var i =0;i< Object.keys(cart).length;i++)
    {
      let item :Item = JSON.parse(cart[i]);
      if(item.product.cod_available != 1)
      {
        index = true;
      } 
    }
    //console.log(index);
    return index;
  }
  clear_cart()
  {
    localStorage.removeItem('cart');
  }

  changeItemCount(id :number, op)
  {
    var item : Item = {
      product   : this.product,
      quantity  : 1 
    };
    let cart :any = JSON.parse(localStorage.getItem('cart'));
    let index : number = -1;
    for(var i =0;i< Object.keys(cart).length;i++)
    {
      let item :Item = JSON.parse(cart[i]);
      if(item.product.id == id)
      {
        index = i;
        break;
      }
    }
    
    if(index == -1)
    {
      cart.push(JSON.stringify(item));
      localStorage.setItem('cart',JSON.stringify(cart));
    }
    else
    {
      var item_2 = JSON.parse(cart[index]);
      if(op == 'minus' && item_2.quantity > 1)
      {
        item_2.quantity -= 1;
      }
      else if(op == 'add')
      {
        item_2.quantity += 1;
      }
      $('#update_count'+id).text(item_2.quantity);
      cart[index] = JSON.stringify(item_2);
      localStorage.setItem('cart',JSON.stringify(cart));
    }
    this.loadCart();
  }

  removeItem(id : number)
  {
    var item : Item = {
      product   : this.product,
      quantity  : 1 
    };
    if(!id)
    {
      return false;
    }
    let cart :any = JSON.parse(localStorage.getItem('cart'));
    let index : number = -1;
    for(var i =0;i< Object.keys(cart).length;i++)
    {
      let item :Item = JSON.parse(cart[i]);
      if(item.product.id == id)
      {
        index = i;
        cart.splice(index, 1);
      }
    }
    localStorage.setItem('cart',JSON.stringify(cart));
    this.loadCart();
    this.cartItemsCount();
  }

  get_param(name)
  {
    const results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if(!results){
      return 0;
    }
    return results[1] || 0;
  }

  findItem(id:number) : Product
  {
    return this.products[this.select_by_id(id)];
  }

  send_post_request(data) : Observable<any>
  {
    var Headers_of_api = new Headers({ 
      'Content-Type' : 'application/x-www-form-urlencoded'
    });
    return this.http.post(this.service_url+this.request_action,data,{headers: Headers_of_api})
    .map(res => res.json());
  }

  fetch_product_data(data)
  {
	  this.request_action = 'fetch_product';
    return this.send_post_request(data) ;
  }
  fetch_channels(data)
  {
    this.request_action = 'fetch_channels';
    return this.send_post_request(data) ;
  }
  fetch_products_by_category(data)
  {
    this.request_action = 'fetch_products_by_category';
    return this.send_post_request(data) ;
  }
}
