import { Component, OnInit,Renderer2,Inject,ViewContainerRef } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms'
import { DOCUMENT } from "@angular/common";
import { TodoService } from '../todo.service';
import { AuthService } from '../auth.service';
import { ProductService } from '../product.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrManager } from 'ng6-toastr-notifications';
declare var window: any;
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styles: []
})
export class CheckoutComponent implements OnInit{
  myControl = new FormControl();
  addressformgroup : FormGroup;
  regaddressformgroup : FormGroup;
  rowaddressformgroup : FormGroup;
  addresses : any ;
  only_address :number = 0 ;
  state : string ; 
  default_address : any = {address : ''};
  edit_id : number;
  editaddress : any;
  edit : boolean = false;
  disabled : boolean = true;
  order_placed : boolean  = false;
  msg : string ;
  order_status : boolean;
  cod : boolean = false;
  coupon_enable : boolean = false;
  tsk_pay : string ; 
  otf_margin : any ;
  otfquantity : number = 0;
  cart_items : any;
  circles : any;
  pincode : any;
  region : any;
  reg_address : number = 0; 
  tab_address : any;
  address : any;
  options : any = {how_much_apply_to_product : 0};
  checkbox_text : any = {checkbox : false,radio : false,no_input : false};
constructor( public todoservice : TodoService,
  private _renderer2: Renderer2, 
   @Inject(DOCUMENT) private _document,
  private productservice : ProductService,
  private authservice : AuthService,
  private spinner : NgxSpinnerService,
  private toastr: ToastrManager,
  vcr: ViewContainerRef,
  private fb: FormBuilder,
  private router : Router) { 
    this.addressformgroup = fb.group({
      'name' : [null,Validators.compose([Validators.required])],
      'contact' : [null,Validators.compose([Validators.required,Validators.pattern("[0-9]{10}")])],
      'pincode' : [null,Validators.compose([Validators.required,Validators.pattern("[0-9]{6}")])],
      'locality' : [null],
      'city' : [null,Validators.compose([Validators.required])],
      'state' : [null,Validators.compose([Validators.required])],
      'address' : [null,Validators.compose([Validators.required])],
    }); 
    this.regaddressformgroup = fb.group({
      'contact' : [null,Validators.compose([Validators.required,Validators.pattern("[0-9]{10}")])],
      'pincode' : [null,Validators.compose([Validators.required,Validators.pattern("[0-9]{6}")])],
    });
    this.rowaddressformgroup = fb.group({
      'row_address' : [null,Validators.compose([Validators.required])],
      'state' : [null,Validators.compose([Validators.required])]
    });
   }
ngOnInit() {
  if(!this.get_token())
  {
    let full_url = this.router.url.split('/');
    if(!full_url[2])
    full_url[2] = '';
    else
      full_url[2] = '#'+full_url[2];
    this.router.navigate(['/proceed/login/ref/'+full_url[1]+full_url[2]]);
    return false;
  } 
  
  if(this.productservice.get_pincode())
  {
    this.pincode = this.productservice.get_pincode()
    this.addressformgroup.controls['pincode'].setValue(this.pincode);
    this.regaddressformgroup.controls['pincode'].setValue(this.pincode);
  }
  if(this.productservice.get_region())
  {
    this.region = this.productservice.get_region();
    this.addressformgroup.controls['state'].setValue(this.region);
    this.rowaddressformgroup.controls['state'].setValue(this.region);
  }
  if(this.todoservice.get_param('pincode'))
  {
    this.pincode = this.todoservice.get_param('pincode');
  }
  let script = this._renderer2.createElement('script');
  script.type = `text/javascript`;
  script.text = `
  $('.tooltipped').tooltip({delay: 50});
  $('body').delegate('.add-new-address','click',function(){
    $('.modal').modal();
    $('#add-new-address').modal('open');
  });
  $('body').delegate('.edit-address','click',function(){
    $('.modal').modal();
    $('#add-address').modal('open');
  });
  $(document).ready(function(){
    $('.modal').modal();
    $('[name="wallet_type"]').change(function(){
      if($(this).val() == 'card')
      {
        $('#card-box').removeClass('hide');
        $('#popular-banks').addClass('hide');
      }
      else if($(this).val() == 'wallet' || $(this).val() == 'cod' || $(this).val() == 'paytm')
      {
        $('#card-box').addClass('hide');
        $('#popular-banks').addClass('hide');
      }
      else if($(this).val() == 'net_banking')
      {
        $('#card-box').addClass('hide');
        $('#popular-banks').removeClass('hide');
      }
    });
    $('.tabs').tabs();
    $('.modal-close').on('click', function(){
      $('.modal').modal('close');
     });
     $('.modal').modal();
     $('body').delegate('.chngs1','click',function() {
      $('.checkout_1').removeClass('hide');	
      $('.checkout_2').addClass('hide');				
      $('.checkout_3').addClass('hide');				
      $('.checkout_4').addClass('hide');				
      $('.first-line').addClass('white');		
      $('.second-line').removeClass('white');		
      $('.third-line').removeClass('white');		
      $('.fourth-line').removeClass('white');	
      $('.chngs2').addClass('hide');				
      $('.chngs3').addClass('hide');				
      $('.chngs1').removeClass('hide');				
      $('.chngs4').addClass('hide');	
  });
  $('body').delegate('.ctn-che1','click', function(){
    $('.modal').modal();
      $('.checkout_1').addClass('hide');
      $('.checkout_2').removeClass('hide');			
      $('.naam1').removeClass('hide');
      $('.first-line').css('background','white');
      $('.second-line').css('background','white');
      $('.second-line').css('box-shadow','none');					
  });	
  $('body').delegate('.chngs2','click', function() {
    $('.modal').modal();
      $('.checkout_2').removeClass('hide');	
      $('.checkout_3').addClass('hide');				
      $('.checkout_4').addClass('hide');								
      $('.second-line').addClass('white');
      $('.third-line').removeClass('white');
      $('.fourth-line').removeClass('white');
      //$('.chngs3').addClass('hide');				
      $('.chngs4').addClass('hide');
 });
  $('body').delegate('.ctn-che2','click',function() {
    $('.modal').modal();
      $('.email2').removeClass('hide');	
      $('.chngs2').removeClass('hide');	
      $('.naam2').removeClass('hide');					
      $('.second-line').css('background','white');
      $('.second-line').css('box-shadow','0 2px 2px 0 rgba(0,0,0,0.14), 0 1px 5px 0 rgba(0,0,0,0.12), 0 3px 1px -2px rgba(0,0,0,0.2)');				
      $('.third-line').css('background','white');
      $('.third-line').css('box-shadow','none');									
  });
  $('body').delegate('.chngs3','click', function() {
      $('.modal').modal();
      $('.checkout_3').removeClass('hide');	
      $('.checkout_3').show();	

      $('.chngs2').addClass('hide');								
      $('.chng3').addClass('hide');								
      $('.checkout_4').addClass('hide');									
      $('.checkout_2').addClass('hide');									
      //$('.naam3').addClass('hide');									
      $('.third-line').addClass('white');									
      $('.fourth-line').removeClass('white');									
  });
  $('body').delegate('.chngs4','click', function() {
    $('.modal').modal();
      $('.checkout_4').removeClass('hide');									
      $('.chngs4').addClass('hide');				
      $('.naam4').addClass('hide');				
      $('.fourth-line').css('background','white');
      $('.fourth-line').css('box-shadow','none');									
  });
  $('body').delegate('.last-btn','click', function() {
    $('.modal').modal();
      $('.checkout_4').removeClass('hide');
      $('.cod-avial').removeClass('hide');
      $('.fourth-line').css('background','white');
      $('.fourth-line').css('box-shadow','none');
      $('.third-line').css('background','white');
      $('.third-line').css('box-shadow','0 2px 2px 0 rgba(0,0,0,0.14), 0 1px 5px 0 rgba(0,0,0,0.12), 0 3px 1px -2px rgba(0,0,0,0.2)');
  });
  });
  
  `;
  this._renderer2.appendChild(this._document.body, script);
  this.get_checkout_data();
  this.todoservice.get_user_data();
  if(this.get_token())
    {
      if(this.todoservice.get_user_product_amount() > 0)
      {
        this.fetch_options()
      }
    }
}

check_wallet_content()
{
  this.checkbox_text = {checkbox : false,radio : false,no_input : false}
  if(this.productservice.cartItemsCount() == 1 && this.todoservice.get_user_product_amount() < this.options.how_much_apply_to_product)
  {
    if(this.productservice.calculateCartAmount() > this.todoservice.get_user_wallet_amount() && this.todoservice.get_user_wallet_amount() > 0)
    {
      this.checkbox_text.checkbox = true;
      return;
    }
    else if(this.productservice.calculateCartAmount() <= this.todoservice.get_user_wallet_amount())
    {
      this.checkbox_text.radio =  true;
      return;
    }
    this.checkbox_text.no_input =  true;
  }
  else if(this.productservice.calculateCartAmount() <= this.todoservice.get_user_wallet_amount())
  {
    this.checkbox_text.radio =  true;
  }
  else
  {
    this.checkbox_text.no_input = true;
  }
}
fetch_options()
{
  this.todoservice.fetch_product_options({token : this.get_token()})
  .subscribe(
    data => 
    {
      this.options = data; 
    }
  )
}

check_bonus(index,amount)
{
  index = index + 1;
  if(this.options && amount >= this.options.apply_minimum_product && this.todoservice.get_user_product_amount() >= index * this.options.how_much_apply_to_product)
  {
    return true;
  }
  return false;
}

calculate_bonus()
{
  var amount : number = 0;
  if(this.options && this.productservice.cart_items.length > 0)
  {
    var $userwallet = this.todoservice.get_user_product_amount();
    for(var i = 0; i < this.productservice.cart_items.length;i++)
    {
      if( this.productservice.cart_items[i].product.offer_price >= this.options.apply_minimum_product && $userwallet * 1 >= this.options.how_much_apply_to_product)
      {
        $userwallet = $userwallet * 1 -  1 * this.options.how_much_apply_to_product;
        amount = amount + this.options.how_much_apply_to_product * 1;
      }
    }
  }
  return amount;
}

pay_amount()
{
  var wallet_used = '';
    if($('[name="include_wallet"]:checked').length > 0)
      wallet_used = 'wallet';
    if((this.productservice.calculateCartAmount() > this.todoservice.get_user_wallet_amount()) && wallet_used == 'wallet')
    {
      return Math.ceil(this.productservice.calculateCartAmount() - this.todoservice.get_user_wallet_amount());
    }
    return Math.ceil(this.productservice.calculateCartAmount());
}

cod_apply()
{
  let a = 0;
  if($('[name="wallet_type"]:checked').val() == 'cod' || $('[name="wallet_type"]:checked').val() == 'paytm' || $('[name="wallet_type"]:checked').val() == 'card')
  {
    this.cod = true;
    a = 1;
  }
  else
  {
    this.cod = false;
    a = 2;
  } 
}
changeState(state)
{
  this.region = state;
  this.productservice.set_region(state);
}

get_checkout_data()
{
  this.spinner.show();
  if(this.authservice.retrieveToken())
  {
    this.spinner.show();
    let data = {token : this.get_token()};
    this.todoservice.fetch_checkout_data(data)
    .subscribe(
      data => 
      {
        if(data.status == 'Invalid Token')
        {                                                     
          this.authservice.clear_session();
          this.router.navigate(['/home']);
        }
        if(data.OTFMARGIN)
        {
          this.otf_margin = data.OTFMARGIN;
        }
        if(data.CIRCLES)
        {
          this.circles = data.CIRCLES;
        }
        let b = JSON.stringify(data);
        data =  JSON.parse(b.replace(/\\/g, ''));
        if(!jQuery.isEmptyObject(data))
        {
          this.addresses = data.ADDRESSES;
        }
        this.spinner.hide();
        if(this.productservice.cart_items.length == 1)
        {
          if(this.productservice.cart_items[0].product.title.toLowerCase().includes('multi') && this.todoservice.get_user_type() == 2)
          {
            $('.second-line').hide();
            //$('.checkout_3').hide();
            $('.payment-number span').text('3');
            $('.second-line').hide();
            $('.checkout_3 .button-one').hide();
            $('.checkout_3 .button-two').removeClass('hide');
          }
        }
      }
    )  
  }
}

remove_address(id)
{
  this.edit_id = id;
  this.spinner.show();
  this
  let data : any = {token : this.get_token(), edit_id : id};
  this.todoservice.fetch_remove_address(data)
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
          this.addresses = data.ADDRESSES;
        }
        this.spinner.hide();
      }
    )  
}

edit_address(id)
{
  this.edit_id = id;
  this.spinner.show();
  if(!this.get_token())
  {
    this.router.navigate(['/']);
    return;
  }
  let data : any = {token : this.get_token(), edit_id : id};
  this.todoservice.fetch_edit_address(data)
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
          this.edit = true;
          this.editaddress = data.ADDRESS;
        }
        this.spinner.hide();
      }
    )  
}

edit_addr(form)
{
  let data = form;
  this.spinner.show();
  data.token  = this.get_token();
  data.state  = this.state;
  data.edit_id  = this.edit_id;
 
  this.todoservice.edit_address(data)
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
          this.addresses = data.ADDRESSES;
          if(Object.keys(this.addresses).length == 1)
          {
              this.only_address = 1;
          }
        }
        $('.modal-close').click();
        this.spinner.hide();
      }
    )  
}
change_addr_form(section)
{
  if(section == 'reg-address')
    this.reg_address = 1;
  $('#add-new-address').hide();
  $('#add-row-address').hide();
  $('#reg-address').hide();
  $('#'+section).show();
}
reg_addr(formdata)
{
  let data = formdata;
  this.spinner.show();
  data.token  = this.get_token();
  this.todoservice.reg_address(data)
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
          this.address = data.address;
          this.tab_address = data.address.address_id; 
          this.goto_pay();
        }
        this.spinner.hide();
      }
    ) 
}
add_new_addr(form)
{
  let data = form;
  this.spinner.show();
  data.token  = this.get_token();
  data.state  = this.state;
  this.todoservice.add_new_address(data)
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
           this.address = data.added_address; 
           this.tab_address = this.address.address_id;
          this.goto_pay();
        }
        this.spinner.hide();
      }
    )  
}
set_on_tab(addr)
{
  this.tab_address = addr;
}
goto_orders()
{
  let address = $('[name="client_address"]:checked').val()
  if(typeof address =='undefined' )
  {
    this.toastr.errorToastr("Please Add a New Address.");
    return false;
  }
  $('.checkout_1').addClass('hide');
  $('.checkout_3').removeClass('hide');
  $('.chngs1').removeClass('hide');
  $('.second-line').removeClass('white');
  $('.third-line').addClass('white');
}
goto_pay()
{
  $('.checkout_3').hide();
  $('.checkout_2').addClass('hide');
  $('.checkout_4').removeClass('hide');
  $('.chngs2').removeClass('hide');
  $('.chngs3').removeClass('hide');
  $('.third-line').removeClass('white');
  $('.fourth-line').addClass('white');
}
goto_address()
{
  $('.checkout_3').addClass('hide');
  $('.checkout_2').removeClass('hide');
  $('.chngs3').removeClass('hide');
  $('.first-line').removeClass('white');
  $('.second-line').addClass('white');
}

checkout_items(type)
{
  // if(type == 2)
  // {
  //   let otf_pay : boolean = false; 
  //   let count = 0;
  //   this.otfquantity = 0;
  //   this.productservice.cart_items.forEach( item => {
  //     if(item.product.tsk_kit == 3)
  //     {
  //       otf_pay = true;
  //       count++; 
  //       this.otfquantity++;
  //     }
  //   });
  //  if($('[name="wallet_type"]:checked').val() == 'cod' && count > 0 && this.otf_margin.option_value > 0)
  //   {
  //    $('#kit-modal-a').click()
  //     return false;
  //   }
  // }

  this.spinner.show();
  let address_id = this.tab_address
  let wallet_type = $('#wallet-type input[type="radio"]:checked').val();
  let data : any = {token : this.get_token(),address_id: address_id, reg : this.reg_address, products : this.productservice.cart_items,wallet_type : wallet_type ,cart_amount: this.productservice.calculateCartAmount(),tsk_pay : this.tsk_pay};
  if($('#wallet-type [name="include_wallet"]:checked').length > 0)
    data.include_wallet = 1;
  if(this.region)
    data.region = this.region;  
  if(this.calculate_bonus() > 0)
    data.bonus = 1;   
  this.todoservice.checkout_items(data)
    .subscribe(
      data => 
      {
        this.spinner.hide();
        if(data.status == 'Invalid Token')
        {                                                     
          this.authservice.clear_session();
          this.router.navigate(['/proceed/login']);
        }
        if(!jQuery.isEmptyObject(data))
        {
          if(data.status == true)
          {
            if(typeof data.red_auth != 'undefined' && data.red_auth == 'ptm')
            {
              if(typeof data.for_tsk != 'undefined' && data.for_tsk == 1)
              {
                window.location.href = "https://www.mydthshop.com/web-app/do-paytm/tsk-index.php?pt_t="+data.pt_t+"&order_id="+data.order_id+'&token='+this.get_token()+'&amount='+data.tsk_amount;
              }
              else
              {
                if(document.URL.indexOf('android_asset') !== -1)
                {
                  var ref = window.cordova.InAppBrowser.open("https://www.mydthshop.com/web-app/do-paytm/?pt_t="+data.pt_t+"&order_id="+data.order_id+'&token='+this.get_token()+'&amount='+data.amount, '_blank', 'location=yes');
                  window.me = this;
                  ref.addEventListener('loadstart', function(event) { 
                    var urlSuccessPage = "order-receipt";
                    if (event.url.indexOf(urlSuccessPage) > 0) {
                      ref.close();
                      var orderid = event.url.replace("https://www.mydthshop.com/product/order-receipt/","");
                      window.me.router.navigate(['/product/order-receipt/'+orderid]);    
                    }
                });
                  
                }
                else
                  window.location.href = "https://www.mydthshop.com/web-app/do-paytm/?pt_t="+data.pt_t+"&order_id="+data.order_id+'&token='+this.get_token()+'&amount='+data.amount;
              }
      
            }
            else if(typeof data.red_auth != 'undefined' && data.red_auth == 'card')
            {
              if(document.URL.indexOf('android_asset') !== -1)
                {
                  var ref = window.cordova.InAppBrowser.open("https://www.mydthshop.com/accounts/apis/response/product_pay/?order_id="+data.order_id, '_blank', 'location=yes');
                  window.me = this;
                  ref.addEventListener('loadstart', function(event) { 
                    var urlSuccessPage = "order-receipt";
                    if (event.url.indexOf(urlSuccessPage) > 0) {
                      ref.close();
                      var orderid = event.url.replace("https://www.mydthshop.com/product/order-receipt/","");
                      window.me.router.navigate(['/product/order-receipt/'+orderid]);    
                    }
                });
                  
                }
                else
                  window.location.href = "https://www.mydthshop.com/accounts/apis/response/product_pay/?order_id="+data.order_id;
            }
            else
            {
              //this.order_placed = true;
              this.msg = data.msg;
              this.order_status = data.status;
              this.spinner.hide();
              this.router.navigate(['/product/order-receipt/'+data.order_id]);
            }
           
            this.productservice.cartItemsCount();
          }
        }
        
      }
    ) 
}

check_for_tsk()
{
  var pay_type : any = $('[name="payment_type"]:checked').val();
  this.tsk_pay = pay_type;
  this.checkout_items(1)
}

show_coupon(i)
{
  $('#item-detail-section-'+i+' .coupon-area').show();
}

get_token()
{
  return this.authservice.auth_token();
}

}

