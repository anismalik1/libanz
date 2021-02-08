import { Injectable } from '@angular/core';
import { Product } from './product.entities';
import { Item } from './item.entities';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/observable/of';
import  'rxjs/add/operator/catch';
import  'rxjs/add/operator/map';
import {AppComponent} from './app.component';
import * as $ from 'jquery';

class LocalStorage implements Storage {
  length!: number | 0;
  [name : string] : any;

  clear(): void { }
  getItem( key : string ): string | null { return null; }
  key(index: number): string | null { return null; }
  removeItem(key: string): void {}
  setItem(key: string, value: string): void {}
}

@Injectable()
export class ProductService implements Storage  {

  public server_url : string = "https://www.libanz.com/";
  public base_url : string = 'https://localhost:4200/';
  public service_url : string = 'https://www.mydthshop.com/index.php?/app_services/';
  public request_action!: string;
  public dropdown_add_money = {paymethod: '',paybankaccount:'',yourbankname : '' };
  private product : Product | any;
  private products : Product[] | any;
  // private item : Item;
  public cartItems: number = 0;
  public cart_items : Item[] = [];
  cod_invalid = false; 
  options : any;
  private storage: Storage;
  constructor(private http : HttpClient, private router : Router )
  {
    this.storage = new LocalStorage();
    // AppComponent.isBrowser.subscribe(isBrowser => {
    //   if (isBrowser) {
    //     this.storage = localStorage;
    //   }
    // });
    this.loadCart();
  } 
  length!: number;

  clear(): void {
    this.storage.clear();
  }

  getItem(key: string): string | null {
    return this.storage.getItem(key);
  }

  key(index: number): string | null {
    return this.storage.key(index);
  }

  removeItem(key: string): void {
    return this.storage.removeItem(key);
  }

  setItem(key: string, value: string): void {
    return this.storage.setItem(key, value);
  }
  get_user_product_amount()
  {
    if(this.get_user() != null)
      return Number(this.get_user().product_bonus_wallet.replace(/\,/g,""));
    else
      return 0;
  }
  get_user()
  {
    //return this.user.storage;
    let data = JSON.parse(this.storage.getItem('app_token') || '{}');
    if(data != null)
    {
      //console.log(this.user)
      return data.user; 
    } 
    return null; 
  }
  is_mboss_enable()
  {
    let airtel_all : number = 0; 
    let cart = JSON.parse(this.storage.getItem('cart') || '{}');
    if(cart != null)
    {
      for(var i =0;i<Object.keys(cart).length; i++)
      {
        let item = JSON.parse(cart[i]);
        if(item.product.title.toLowerCase().includes('airtel'))
        {
          airtel_all++;
        }
      }
      if(Object.keys(cart).length == airtel_all)
      {
        return true;
      }
    } 
    return false;
  }

  loadCart() : void
   {
    this.cart_items = [];
    let cod_count :number  = 0;
    if(this.storage.getItem('cart') == null)
    {
      return;
    }
    let cart = JSON.parse(this.storage.getItem('cart') || '{}');
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

  setProductItem(products : Product)
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

  if_exist_in_cart(push_cart_id : number)
  {
    let cart :any = JSON.parse(this.storage.getItem('cart') || '{}');
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

  selectCartItemById(id : number)
  {
    let cart :any = JSON.parse(this.storage.getItem('cart') || '{}');
    let index : number = -1;
    if(cart != null)
    {
      for(var i =0;i< Object.keys(cart).length;i++)
      {
        let item :Item = JSON.parse(cart[i]);
        if(item.product.id == id)
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
    return JSON.parse(cart[index]);
  }

  addto_direct_purchase(product_item : any)
  {
    var item : any = [{
      product   : product_item,
      quantity  : 1
    }];
    this.storage.setItem('purchase',JSON.stringify(item));
      // if(push_cart_id)
      // {
       
        // if( localStorage.getItem('cart') == null )
        // {
          
        // }
        // else
        // {
        //   let cart :any = JSON.parse(localStorage.getItem('cart'));
        //   let index : number = -1;
        //   cart = cart.filter(data => data.id != push_cart_id);

        //   for(var i =0;i< Object.keys(cart).length;i++)
        //   {
        //     let temp :Item = JSON.parse(cart[i]);
        //     if(temp.product.id == push_cart_id)
        //     {
        //       cart.splice(i, 1);
        //     } 
        //   }
          
        //   if(index == -1)
        //   {
        //     cart.push(JSON.stringify(item));
        //     localStorage.setItem('cart',JSON.stringify(cart));
        //   }else
        //   {
        //     var item_2 = JSON.parse(cart[index]);
        //     item_2.quantity += 1;
        //     cart[index] = JSON.stringify(item_2);
        //     localStorage.setItem('cart',JSON.stringify(cart));
        //   }
        // }
      // } 
  }

  get_favorites()
  {
    if( this.storage.getItem('favourite') != null )
    {
      return JSON.parse(this.storage.getItem('favourite') || '{}');
    }
    return null;
  }

  set_pincode(pincode : any)
  {
    this.storage.setItem('pincode',JSON.stringify(pincode));
  }

  get_pincode()
  {
    if( this.storage.getItem('pincode') != null )
    {
      return JSON.parse(this.storage.getItem('pincode') || '{}');
    }
    return false;
  }
  set_region(region : number)
  {
    this.storage.setItem('region',JSON.stringify(region));
  }

  get_region()
  {
    if( this.storage.getItem('region') != null )
    {
      return JSON.parse(this.storage.getItem('region') || '{}');
    }
    return 0;
  }
  PurchaseItems() 
  {
    if(this.storage.getItem('purchase') != null)
    {
      let cart : any = JSON.parse(this.storage.getItem('purchase') || '{}');
      return cart;
    }
    return null;
  }

  favorite_count(type : any)
  {
    if(this.storage.getItem('favourite') != null)
    {
      let cart :any = JSON.parse(this.storage.getItem('favourite') || '{}');
      this.cartItems = cart.items.filter((item: { type: any; }) => item.type == type);;
      this.cartItems =  Object.keys(this.cartItems).length;
      return this.cartItems;
    }
    return 0;
  }

  exist_in_favourite(id : number) : boolean
  {
    //console.log(id);
    if(this.storage.getItem('favourite') != null)
    {
      let index = -1;
      let cart :any = JSON.parse(this.storage.getItem('favourite') || '{}');
      for(var i =0;i< Object.keys(cart.items).length;i++)
      {
        let item = cart.items[i];
        if(item.prod_id == id)
        {
          index = 1;
          break;
        } 
      }
      if(index == 1)
        return true;
      else
        return false;  
    }
    return false;
  }

  calculateCartAmount(items : any) : number{
    let index : number = -1;
    let amount : number = 0;
    if(items == null)
    {
      return amount;
    }
    for(var i =0;i< Object.keys(items).length;i++)
    {
      var product_amount : number = 0; 
      let item :Item = items[i];
      product_amount = item.product.offer_price* 1;
      if(item.product.multi == 1)
      {
        if(item.product.pack_selected[0])
        product_amount += Number(item.product.pack_selected[0].multi_price);
        if(item.product.pack_selected[1])
        product_amount += Number(item.product.pack_selected[1].multi_price);
      }
      else
      {
        if(item.product.pack_selected[0])
        product_amount += Number(item.product.pack_selected[0].price);
        if(item.product.pack_selected[1])
        product_amount += Number(item.product.pack_selected[1].price);
      }
      if(item.product.promos)
      {
        if(item.product.promos.discount <= item.product.promos.max_discount)
        {
          product_amount = product_amount - Number(item.product.promos.discount);
        }
      } 
      product_amount = product_amount * item.quantity;
      amount += product_amount;
    }
    return amount; 
  }
  
  cashback_amount(items : any)
  {
    let cart : any = items;
    let index : number = -1;
    let amount : number = 0;
    if(cart == null)
    {
      return amount;
    }
    for(var i =0;i< cart.length;i++)
    {
      let item :Item = cart[i];
      if(item.product.partnerwalletamount && item.product.partnerwalletamount > 0)
        amount += item.product.partnerwalletamount * item.quantity*1;
    }
    return amount; 
  }

  calculateCartAmountWithoutOffer() : number{
    let cart :any = JSON.parse(this.storage.getItem('cart') || '{}');
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

  total_savings(items : any)
  {
    let cart :any = items;
    let amount : number = 0;
    let mrp_amount : number = 0;
    let offer_amount : number = 0;
    if(cart == null) 
    {
      return amount;
    }
    
    for(var i =0;i< Object.keys(cart).length;i++)
    {
      let item :Item = cart[i];
      mrp_amount += item.product.price * item.quantity;
      if(item.product.tsk_kit && item.product.tsk_kit == 3)
      {
        offer_amount += (item.product.price -1000) * 1
      }
      else
      {
        offer_amount += item.product.offer_price * 1;
      }
      
      if(item.product.promos)
      {
        if(item.product.promos.discount <= item.product.promos.max_discount)
        {
          offer_amount = offer_amount - Number(item.product.promos.discount);
        }
      }
      if(item.product.partnerwalletamount && item.product.partnerwalletamount > 0)
        offer_amount = offer_amount - item.product.partnerwalletamount; 
      offer_amount = offer_amount * item.quantity   
    }
    return (mrp_amount - offer_amount); 
  }

  check_cashon_delivery(items :any)
  {
    let cart :any = items;
    if(cart == null)
      return false
    var index = false;
    for(var i =0;i< cart.length;i++)
    {
      let item :Item = cart[i];
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
    let $all : any = this.get_favorites();
    var favitems = $all.items.filter((item: { type: number; }) => item.type == 2);
    var array : any = {items : favitems,count : favitems.length};
    this.storage.setItem('favourite', JSON.stringify(array));

  }

  changeItemCount(id :number, op : string )
  {
    var item : Item = {
      product   : this.product,
      quantity  : 1
    };
    let cart :any = JSON.parse(this.storage.getItem('cart') || '{}');
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
      this.storage.setItem('cart',JSON.stringify(cart));
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
        if(item_2.quantity == 3)
        {
          //alert("You can not buy more that 3 Multi Box on same Contact Number.");
          return ;
        }  
        item_2.quantity += 1;
      }
      $('#update_count'+id).text(item_2.quantity);
      cart[index] = JSON.stringify(item_2);
      this.storage.setItem('cart',JSON.stringify(cart));
    }
    this.loadCart();
  }


  removeProductItem(id : number)
  {
    var item : Item = {
      product   : this.product,
      quantity  : 1
    };
    if(!id)
    {
      return;
    }
    let cart :any = JSON.parse(this.storage.getItem('cart') || '{}');
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
    this.storage.setItem('cart',JSON.stringify(cart));
  }

  get_param(name : string)
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

  send_post_request(data : any,url : string) : Observable<any>
  {
    var Headers_of_api = new HttpHeaders({ 
      'Content-Type' : 'application/x-www-form-urlencoded'
    });
    return this.http.post(url,data,{headers: Headers_of_api})
    .map(res => res)
  }

  fetch_product_data(data : any)
  {
    this.request_action = '';
    let url = this.server_url+'accounts/apis/product/fetch_product';
    return this.send_post_request(data,url) ;
  }
  fetch_channels(data : any)
  {
    this.request_action = '';
    let url = this.server_url+'accounts/apis/product/fetch_channels';
    return this.send_post_request(data,url) ;
  }
  fetch_products_by_category(data : any)
  {
    this.request_action = '';
    let url = this.server_url+'accounts/apis/product/fetch_products_by_category';
    return this.send_post_request(data,url) ;
  }
  fetch_all_multi(data : any)
  {
    this.request_action = '';
    let url = this.server_url+'accounts/apis/product/fetch_all_multi';
    return this.send_post_request(data,url) ;
  }

  compare_urls(data : any)
  {
    this.request_action = '';
    let url = this.server_url+'accounts/apis/product/compare_urls';
    return this.send_post_request(data,url) ;
  } 
  change_compare_list(data : any)
  {
    this.request_action = '';
    let url = this.server_url+'accounts/apis/product/change_compare_list';
    return this.send_post_request(data,url) ;
  } 
  share_pack_to_mail(data : any)
  {
    let url = this.server_url+'index.php?/app_services/share_pack_to_mail';
    return this.send_post_request(data,url) ;
  }

  add_to_favorite(data : any)
  {
    let url = this.server_url+'accounts/apis/product/add_to_favorite';
    return this.send_post_request(data,url) ; 
  }
}
