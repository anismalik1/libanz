import { Component, OnInit,Renderer2,PLATFORM_ID,Inject } from '@angular/core';
import { TodoService } from '../todo.service';
import { DOCUMENT } from "@angular/common";
import { AuthService } from '../auth.service';
import { ProductService } from '../product.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import {isPlatformBrowser} from '@angular/common';
import {BehaviorSubject} from 'rxjs';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styles: [],
  providers : [ProductService]
})
export class CartComponent implements OnInit{
  static isBrowser = new BehaviorSubject<boolean>(null!);
  public user = {phone:'loading',name:'loading'};
  public items : any = [];
  push_cart_id : number;
  public product : any;
  public enable_add_pack : any;
  public months : any;
  public channels_packs : any;
  public region : any;
  pack_selected : any;
  month : number = 1;
  pack_id : number;
  fta_pack : any;
  carts : any;
  cart_count : number = 0;
  selectedCartItem : any;
  multienable : boolean = false;
  constructor(
    @Inject(PLATFORM_ID) private platformId: any ,
    private route : Router, 
    private _renderer2: Renderer2, 
    @Inject(DOCUMENT) private _document, 
    public todoservice : TodoService,
    private authservice : AuthService,
    private spinner : NgxSpinnerService,
    private toast : ToastrManager,
    public productservice : ProductService
  ) {
    CartComponent.isBrowser.next(isPlatformBrowser(platformId));
   }

  ngOnInit() {
    if(!this.get_token())
    {
      let full_url = this.route.url.split('/');
      if(!full_url[2])
      full_url[2] = '';
      else
        full_url[2] = '#'+full_url[2];
      this.route.navigate(['/proceed/login/ref/'+full_url[1]+full_url[2]]);
      return;
    }
    if(isPlatformBrowser(this.platformId)) 
    {
      $('.copy-click').on('click',function(){			
        $('.copy-click').attr('disabled');
      });
    }
   
    this.todoservice.back_icon_template('My Cart',this.todoservice.back(1))
    this.user_favourites();
    return;
  }

  get_token()
  {
    return this.authservice.auth_token();
  }
  convert_to_object(string)
  {
    return JSON.parse(string);
  }

  select_pack(pack)
  { 
    if(this.fta_pack.length > 0)
      this.pack_selected = [this.fta_pack];  
    if($('#check-pack-'+pack.id).hasClass('grey-text'))
    {
      $('.when-check').addClass('grey-text');
      $('#check-pack-'+pack.id).removeClass('grey-text');
      $('#check-pack-'+this.fta_pack.id).removeClass('grey-text');
      
      this.pack_selected = [];
      //console.log(this.fta_pack);
      if(this.fta_pack.id)
        this.pack_selected = [this.fta_pack];
      this.pack_selected.push(pack);
    }
    else
    {
      if(pack.title.includes('Super Family') || this.fta_pack.price == 0)
      {
        alert("There Must be atleast two packs(FTA + Other) in this Package.");
        return false;
      }
      if(pack.title.includes('Gold Combo') || pack.title.includes('Gold HD Combo'))
      {
        alert("There Must be atleast two packs(FTA + Other) in this Package.");
        return false;
      }
      $('#check-pack-'+pack.id).addClass('grey-text');
      if(!this.fta_pack)
        this.pack_selected = [];
      else
      {
        this.pack_selected = [];
        this.pack_selected = [this.fta_pack];
      }  
    }
    this.enable_add_pack = true;  
    return true;
    //this.productservice.addto_cart(this.selectedCartItem.product.id,this.selectedCartItem.product)
  }

  select_package(id)
  {
    this.product = id;
    // this.selectedCartItem = this.convert_to_object(json);
    this.selectedCartItem = this.carts.filter(x => x.prod_id == id)[0];
    console.log(this.selectedCartItem);
    this.todoservice.fetch_packs_and_month({circle: this.region,product: id})
    .subscribe(
      data => 
      {
        this.enable_add_pack = false;
        this.months = data.PACKAGEMONTH;
        this.channels_packs = data.package;
        this.product = data.product;
        this.initialize_collapse();
        this.filter_channel_subpack();
      }
    )
  }

add_to_product()
{
  this.selectedCartItem.product.pack_selected = this.pack_selected;
  this.add_to_favorite(this.selectedCartItem);
}

add_to_favorite(product : any)
{
  if(!this.get_token())
  {
    $('.logup.modal-trigger')[0].click();
    return;
  }
  $('.favorite-'+product.id).addClass('active');
  this.spinner.show() 
  this.todoservice.add_to_favorite({product : product,type : 'cart',token : this.get_token()})
  .subscribe(
  data => 
  {
    this.spinner.hide();
    if(data.status == true)
    {
      this.toast.successToastr(data.msg);
      localStorage.setItem('favourite', JSON.stringify(data.favourites));
      this.carts = data.favourites.items.filter(items => items.type == 1);
      this.cart_count =  this.carts.length;
    }
    return true;  
  }
  ) 
}
  user_favourites()
  {
    this.spinner.show();
    this.todoservice.user_favourites({token: this.get_token()})
        .subscribe(
          data => 
          {
            if(!jQuery.isEmptyObject(data))
            {
              this.spinner.hide();
              if(data.status && data.status == 'Invalid Token')
              {
                return false;
              }
             
              localStorage.setItem('favourite', JSON.stringify(data.favourites));
              this.carts = data.favourites.items.filter(items => items.type == 1);
              this.cart_count =  this.carts.length;
            }
            return true;
          }
        )  
  }
  removeItem(id)
  {
    this.spinner.show();
    this.todoservice.remove_favourites({product_id : id,type : 'cart',token: this.get_token()})
    .subscribe(
      data => 
      {
        if(!jQuery.isEmptyObject(data))
        {
          this.spinner.hide();
          if(data.status && data.status == 'Invalid Token')
          {
            return;
          }
          localStorage.setItem('favourite', JSON.stringify(data.favourites));
          this.carts = data.favourites.items.filter(items => items.type == 1);
          this.cart_count =  this.carts.length;
        }
      }
    )
  }

remove_new_line(str)
{
  return str.replace(/(\r\n|\n|\r|↵|rn)/g,"");
} 
initialize_collapse()
{
  this.init_accordian();
}

fetch_channels(item){}

check_child_exist(id,childs)
{
  for(var i = 0;i<childs.length;i++)
  {
    if(childs[i].id == id)
      return true;
  }
  return false;
}

fetch_package(id)
{
  this.spinner.show();
  let data = {circle: this.region,product: id,month:this.month};
    this.todoservice.fetch_pack_by_month(data)
    .subscribe(
      data => 
      {
        this.channels_packs = data.package;
        this.filter_channel_subpack();
        this.spinner.hide();
        this.initialize_collapse();
      }
    ) 
}

select_month(month,id)
{
  this.month = month;
  this.fetch_package(id);
}

init_accordian() 
{
  if($('#accordian-script'))
  {
    $('#accordian-script').remove();
  }
  let script = this._renderer2.createElement('script');
  script.type = `text/javascript`;
  script.id = `accordian-script`;
  script.text = `
  $(document).ready(function(){
  $('.collapsible').collapsible(); 
  });
  `;
  this._renderer2.appendChild(this._document.body, script);
}

to_order_summary()
  {
    $('html, body').animate({
      scrollTop: $(".order-summary").offset().top - 60
    }, 1000);
  }
filter_channel_subpack()
{ 
  this.pack_selected = [];
  if(!this.channels_packs)
   return;
  //console.log(this.channels_packs); 
  
  for(var i=0;i<this.channels_packs.length ;i++)
    {
      //console.log(this.channels_packs[i])
      if( this.channels_packs[i].default_selected == 1 || this.pack_id)
      {
        if(this.channels_packs[i].child[0])
        {
          for(var j=0;j<this.channels_packs[i].child.length ;j++)
          {
            //console.log("child"+this.channels_packs[i].child[j]);
            if(this.channels_packs[i].child[j].default_selected == 2)
            {
              this.fta_pack = this.channels_packs[i].child[j];
            }
            else if(this.channels_packs[i].child[j].default_selected == 1 || this.pack_id == this.channels_packs[i].child[j].id)
            {
              this.pack_selected.push(this.channels_packs[i].child[j]); 
            }
          }
          
          let fta_exist = this.pack_selected.filter(x => x.id == this.fta_pack.id);
          if(fta_exist.length == 0)
          {
            this.pack_selected.push(this.fta_pack); 
          }
          
        }
         
      }
      if(this.channels_packs[i].title.includes('North-India Super Family') || (this.fta_pack.price == 0  && this.pack_selected.length < 2))
      {
        let fta_exist = this.pack_selected.filter(x => x.id == this.channels_packs[i].child[0].id);
        if(fta_exist.length == 0)
        {
          this.pack_selected.push(this.channels_packs[i].child[0]); 
        }
      }
  } 
  //console.log(this.fta_pack);
  if(this.fta_pack.price == 0 )
  {
    for(var i=0;i < this.channels_packs.length ;i++)
    {
      //console.log(this.channels_packs[i]);
      if(this.channels_packs[1])
      {
        this.channels_packs[1].child[0].default_selected = 1;
        this.channels_packs[1].default_selected = 1;
      }
      
      if(this.product.url.includes('standard'))
      {
        this.channels_packs[i].child =  this.channels_packs[i].child.filter(x => x.title.includes('HD') == false);
      }
      
    }
  }
  if(this.pack_selected.length > 0)
  {
    //this.selectedCartItem.pack_selected = this.pack_selected;
    //this.productservice.addto_cart(this.selectedCartItem.product.id,this.selectedCartItem.product);
  }
  
}
}

