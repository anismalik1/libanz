import { Component, OnInit,Renderer2,Inject, } from '@angular/core';
import { TodoService } from '../todo.service';
import { DOCUMENT } from "@angular/common";
import { AuthService } from '../auth.service';
import { ProductService } from '../product.service';
import { NgxSpinnerService } from 'ngx-spinner';

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
  public product : any;
  public enable_add_pack : any;
  public months : any;
  public channels_packs : any;
  public region : any;
  pack_selected : any;
  month : number;
  pack_id : number;
  fta_pack : any;
  selectedCartItem : any;
  
  constructor( 
    private _renderer2: Renderer2, 
    @Inject(DOCUMENT) private _document, 
    public todoservice : TodoService,
    private authservice : AuthService,
    private spinner : NgxSpinnerService,
    public productservice : ProductService
  ) {
      this.productservice.loadCart();
      this.refreshCart(); 
   }
   add_to_product()
   {
     this.product.pack_selected = this.pack_selected;
     //console.log(this.product);
     this.productservice.addto_cart(this.product.id,this.product);
   }

   refreshCart() : void
   {
     this.productservice.loadCart();
   }
  ngOnInit() {
    $('.copy-click').on('click',function(){			
			$('.copy-click').attr('disabled');
    });
    this.todoservice.back_icon_template('My Cart',this.todoservice.back())
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
    //this.selectedCartItem.pack_selected = this.pack_selected;
    this.enable_add_pack = true;  
    //this.productservice.addto_cart(this.selectedCartItem.product.id,this.selectedCartItem.product)
  }

  select_package(id)
  {
    this.product = id;
    this.channels_packs = [];
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
remove_new_line(str)
{
  return str.replace(/(\r\n|\n|\r|↵|rn)/g,"");
} 
initialize_collapse()
{
  this.init_accordian();
}

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
   return false;
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

