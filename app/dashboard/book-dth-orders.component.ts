import { Component, OnInit , Renderer2,Inject,ViewContainerRef} from '@angular/core';
import { FormBuilder,Validators, FormGroup, FormControl } from '@angular/forms';

import { DOCUMENT } from "@angular/common";
import { TodoService } from '../todo.service';
import { ProductService } from '../product.service';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-book-dth-orders',
  templateUrl: './book-dth-orders.component.html',
  styles: []
})
export class BookDthOrdersComponent implements OnInit{

  bookformgroup : FormGroup;
  product_list : any;
  categories : any;
  categories_quality : any;
  category_products : any;
  product_plans : any;
  plandisabled :boolean= true;
  disabled_products : boolean = true;
  quallitydisabled : boolean = true;
  tsk_margin : any ;
  proceed_disabled : boolean = true;
  display_chip : boolean= false;
  book_status : any;
  selected_item : any = {offer_price:'',price: '',otf:0};
  step : number = 1;
  public Math : any;
  constructor( public todoservice : TodoService,
    private _renderer2: Renderer2, 
   @Inject(DOCUMENT) private _document,
  vcr: ViewContainerRef,
  public fb : FormBuilder,
  private productservice :ProductService,
  private spinner : NgxSpinnerService,
  private authservice : AuthService,private router : Router) { 
  this.bookformgroup = fb.group({
      'fname' : [null,Validators.compose([Validators.required])],
      'lname' : [null,Validators.compose([Validators.required])],
      'rmnumber' : [null,Validators.compose([Validators.required])],
      'amnumber' : [null,Validators.compose([Validators.required])],
      'address' : [null,Validators.compose([Validators.required])],
      'remark' : [null,Validators.compose([Validators.required])],
      'city' : [null,Validators.compose([Validators.required])],
      'state' : [null,Validators.compose([Validators.required])],
      'tsk_kit' : [null],
      'subid' : [null],
      'pincode' : [null,Validators.compose([Validators.required])],
      'category' : [null,Validators.compose([Validators.required])],
      'category_quality' : [null,Validators.compose([Validators.required])],
      'category_plans' : [null,Validators.compose([Validators.required])],
      'category_products' : [null,Validators.compose([Validators.required])]
     });
      this.get_categories();
      this.Math = Math;
  }
ngOnInit() {
  if($('#book-order-modal'))
  {
    $('#book-order-modal').remove();
  }
  let script = this._renderer2.createElement('script');
  script.type = `text/javascript`;
  script.id = `book-order-modal`;
  script.text = `
  $(document).ready(function(){
    $('.modal').modal();
    $('.dropdown-button').dropdown({
      inDuration: 300,
      outDuration: 225,
      constrainWidth: true, // Does not change width of dropdown to that of the activator
      hover: false, // Activate on hover
      gutter: 0, // Spacing from edge
      belowOrigin: false, // Displays dropdown below the button
      alignment: 'left'
    });
  })
  $('body').delegate('[href="#confirm-modal"]','click',function(){
    $('.modal').modal();
    $('#confirm-modal').modal('open');
  })
  `;
  this._renderer2.appendChild(this._document.body, script);
  if(!this.get_token())
    {
      let full_url = this.router.url.split('/');
      if(!full_url[2])
       full_url[2] = '';
      else
        full_url[2] = '#'+full_url[2];
      this.router.navigate(['/proceed/login/ref/'+full_url[1]+full_url[2]]);
    } 
}
category_selected(category_id)
{ 
  this.spinner.show() 
  this.productservice.fetch_products_by_category({category: category_id})
    .subscribe(
    data => 
    {
      this.product_list = data.products;
      this.spinner.hide() 
    }
    ) 
}

continue_to_change(value)
{
  
}

book_order(form)
{
  let otf_pay_method = $('[formcontrolname="otf_pay_method"]').val();
  if(!$('#tsk-margin').hasClass('hide'))
  {
    if(form.tsk_kit == null)
    {
      $('.tsk_margin').addClass('red-text').html('Please select TSK Kit');
      return false;
    }
      
  }
  if(typeof otf_pay_method != 'undefined')
  {
    if(otf_pay_method == 2)
    {
      let paytm_ref = $('[formcontrolname="paytmref"]').val();
      form.paytm_ref = paytm_ref;
    }
    form.otf_pay_method = otf_pay_method;
  } 
  form.payment_type = $('[name="payment_type"]:checked').val();
  this.spinner.show();
  form.token = this.get_token();
  this.todoservice.book_dth_order(form)
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
        if(!jQuery.isEmptyObject(data))
        {
          this.book_status = data;
          this.display_chip = true;
          this.step = 2;
         // this.router.navigate(['/order-status'],{ queryParams: {order_id: data.order_token}});
        }
        window.scroll(0, 0);
        this.spinner.hide();
      }
    ) 
}
get_product_info(item)
{
  if(item.brand_category_id == 1 )
  {
      $('#tsk-margin').removeClass('hide');
  }
  else
  {
      $('#tsk-margin').addClass('hide');
      $('#price-box').removeClass('hide');
  } 
  item.display_price = item.offer_price;
  this.selected_item = item;
  
}
back_to_form()
{
  this.step = 1;
  this.bookformgroup.controls['fname'].setValue('');
  this.bookformgroup.controls['lname'].setValue('');
  this.bookformgroup.controls['rmnumber'].setValue('');
  this.bookformgroup.controls['amnumber'].setValue('');
  this.bookformgroup.controls['address'].setValue('');
  this.bookformgroup.controls['remark'].setValue('');
  this.bookformgroup.controls['city'].setValue('');
  this.bookformgroup.controls['tsk_kit'].setValue('');
  this.bookformgroup.controls['subid'].setValue('');
  this.bookformgroup.controls['pincode'].setValue('');
  this.bookformgroup.controls['category'].setValue('');
  this.bookformgroup.controls['category_quality'].setValue('');
  this.bookformgroup.controls['category_plans'].setValue('');
  this.bookformgroup.controls['category_products'].setValue('');
  
}
apply_tsk_margin(value)
{
  
  $('#price-box').removeClass('hide');
  $('.tsk_margin').html('');
  $('.wallet-box').remove();
  let title = $('#select-quality mat-select .ng-star-inserted').text();
  
  let data : any = {token : this.get_token(),product: this.selected_item.id};
  this.todoservice.calculate_tsk_margin(data)
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
        if(!jQuery.isEmptyObject(data))
        {
          this.tsk_margin = data;
          if((title.indexOf('SD') != -1 || title.indexOf('HD') != -1) && title.indexOf('Secondary') == -1)
          {
              this.selected_item.otf = 1;
          }
  if(this.selected_item.otf == 1)
  {
     if(value == 1 )
     {
      var paytm = '';
      var wallet = '';
      if(Number(this.todoservice.get_user_wallet()) > Number(this.tsk_margin.oft_margin_rs))
      {
          wallet += '<div class="wallet-box">';
          wallet += '<input type="radio" formControlName="otf_pay_method" value="1" checked> Use Wallet (&#8377;'+this.todoservice.get_user_wallet()+')';
          wallet += '</div>';
          
      }
      else
      {
          paytm += '<div class="paytm-box">';
          paytm += '<input type="radio" formControlName="otf_pay_method" value="2" checked> Use Paytm (To 9911811317 (MYDTHSHOP))</br>';
          paytm += '<input type="text" formControlName="paytmref" placeholder="Enter Transaction Id">';
          paytm += '</div>';
      }
      
      $('.tsk_margin').after('<div id="show-pay-box">Pay for OFT Margin.'+wallet+paytm+'</div>');
      if(this.tsk_margin.cod_tsk_1 == 0 && this.tsk_margin.wallet_tsk_1 == 0)
      {
          $(".tsk_margin").html('<div class="list-offer" style="color: #54a93b">Congratulations! This kit is absolutely free with OTF Margin &#8377;'+this.tsk_margin.oft_margin_rs+'.</div>');
      }
      else
      {
          $(".tsk_margin").html('<div class="list-offer"><span>For Wallet: &#8377;'+this.tsk_margin.wallet_tsk_1+'</span><span> For COD: &#8377;'+this.tsk_margin.cod_tsk_1+'.</span></div>');
      }
      this.selected_item.display_price = this.selected_item.price-1000;
     }
     else
     {
          $('#show-pay-box').remove();
          if(this.tsk_margin.wallet_tsk_2 == this.tsk_margin.cod_tsk_2)
          {
              this.selected_item.display_price = Number(this.selected_item.price)-600 - Number(this.tsk_margin.oft_margin_rs);	
              $(".tsk_margin").html('<div class="list-offer"><span style="color: #54a93b">Congratulations! This kit is absolutely free with cashback of amount &#8377;'+(Number(this.tsk_margin.wallet_tsk_2))+' and OTF Margin is &#8377;'+ this.tsk_margin.oft_margin_rs+'</span></div>');
          }
          else
          {
              $(".tsk_margin").html('<div class="list-offer" style="color: #54a93b"><span>You will get cashback 0f amount by wallet: &#8377;'+this.tsk_margin.wallet_tsk_2+'</span><span style="color: #54a93b"> and with COD: &#8377;'+this.tsk_margin.cod_tsk_2+'</span></div>');
          }
          
     } 
  }
  else
  {
      if(value == 1)
      {
          if(this.tsk_margin.cod_tsk_1 == 0 && this.tsk_margin.wallet_tsk_1 == 0)
          {
              $(".tsk_margin").html('<div class="list-offer" style="color: #54a93b">Congratulations! This kit is absolutely free.</div>');
          }
          else
          {
              $(".tsk_margin").html('<div class="list-offer"><span>For Wallet: &#8377;'+data.wallet_tsk_1+'</span><span> For COD: &#8377;'+data.cod_tsk_1+'</span></div>');
          }
          this.selected_item.display_price = this.selected_item.price-1000;
      }
      else if(value == 2)
      {
          if(this.tsk_margin.wallet_tsk_2 == this.tsk_margin.cod_tsk_2)
          {
              this.selected_item.display_price = this.selected_item.price-600;
              $(".tsk_margin").html('<div class="list-offer"><span style="color: #54a93b">You will get cashback of amount &#8377;'+data.wallet_tsk_2+'</span></div>');
          }
          else                                                                                                                                                                            
          {
              $(".tsk_margin").html('<div class="list-offer" style="color: #54a93b"><span>You will get cashback 0f amount by wallet: &#8377;'+data.wallet_tsk_2+'</span><span style="color: #54a93b"> and with COD: &#8377;'+data.cod_tsk_2+'</span></div>');
          }	
          
      } 
  }
        }
        this.spinner.hide();
      }
    )
  
  
}
enable_plan(event)
{
  let plan = event.value;
  this.spinner.show();
  let data : any = {token : this.get_token(),catmid:plan};
  this.todoservice.fetch_products_plans(data)
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
        if(!jQuery.isEmptyObject(data))
        {
          this.product_plans = data;
        }
        this.spinner.hide();
      }
    ) 
    this.plandisabled = false;
}


get_products(event)
{
  let plan = event.value;
  this.spinner.show();
  let data : any = {token : this.get_token(),proid : event.value};
  this.todoservice.fetch_products_by_plan(data)
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
        if(!jQuery.isEmptyObject(data))
        {
          this.category_products = data;
        }
        this.disabled_products = false;
        this.spinner.hide();
      }
    ) 
}
get_categories()
{
  this.spinner.show();
  let data : any = {token : this.get_token()};
  this.todoservice.product_categories()
    .subscribe(
      data => 
      {
        if(data.status == 'Invalid Token')
        {                                                     
          this.authservice.clear_session();
          this.router.navigate(['/proceed/login']);
        }
        
        if(!jQuery.isEmptyObject(data))
        {
          this.categories = data.categories;
        }
        this.spinner.hide();
      }
    )  
}

product_category()
{
  this.spinner.show();
  let data : any = {token : this.get_token()};
  this.todoservice.product_categories()
    .subscribe(
      data => 
      {
        if(data.status == 'Invalid Token')
        {                                                     
          this.authservice.clear_session();
          this.router.navigate(['/proceed/login']);
        }
        if(!jQuery.isEmptyObject(data))
        {
          this.categories = data;
        }
        this.spinner.hide();
      }
    )  
}

get_token()
{
  return this.authservice.auth_token();
}
}

