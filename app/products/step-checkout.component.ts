import { Component, OnInit,Renderer2,Inject,ViewContainerRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms'
import { DOCUMENT } from "@angular/common";
import { TodoService } from '../todo.service';
import { AuthService } from '../auth.service';
import { ProductService } from '../product.service';
import { Headers,Http } from '@angular/http';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrManager } from 'ng6-toastr-notifications';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import { MatStepper } from '@angular/material';
import { stepper } from '../home/splash-animation';
import { Item } from '../item.entities';
//import '../../assets/css/mixin-style.sass';
declare var window: any; 

@Component({
  selector: 'app-step-checkout',
  templateUrl: './step-checkout.component.html',
  styles: [],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: {showError: true}
  },MatStepper]
})
export class StepCheckoutComponent implements OnInit {
  @ViewChild('stepper',{static: false}) private myStepper: MatStepper;
  myControl = new FormControl();
  addressformgroup : FormGroup;
  regaddressformgroup : FormGroup;
  rowaddressformgroup : FormGroup;
  addresses : any ;
  params : any = {};
  product_items : any = this.productservice.cart_items;
  only_address :number = 0 ;
  state : string ;
  month : number = 1; 
  multienable : boolean = false;
  default_address : any = {address : ''};
  edit_id : number;
  editaddress : any;
  selectedCartItem : any;
  edit : boolean = false;
  disabled : boolean = false;
  order_placed : boolean  = false;
  msg : string ;
  order_status : boolean;
  cod : boolean = false;
  cart_items : any;
  circles : any;
  pack_id : Number;
  fta_pack : any;
  product : any;
  pincode : any;
  package_month : any;
  channels_packs : any;
  region : any;
  reg_address : number = 0; 
  tab_address : any;
  ControlFormGroup : FormGroup ;
  address : any;
  months : any;
  pack_selected : any;
  options : any = {how_much_apply_to_product : 0};
  checkbox_text : any = {checkbox : false,radio : false,no_input : false};
  gosection_data : any = {to_login: false,to_order_summary : true,to_address : false,to_payment:false}
  topaybutton : boolean = false;
 
  constructor(
    public stepper : MatStepper,
    private _renderer2: Renderer2, 
    @Inject(DOCUMENT) private _document, 
    private http: Http, 
    private spinner : NgxSpinnerService,
    private vcr: ViewContainerRef,
    private toastr: ToastrManager,
    public todoservice : TodoService,
    private authservice : AuthService,
    public productservice : ProductService,
    private _formBuilder: FormBuilder,
    private router : Router
  ) {
    this.addressformgroup = this._formBuilder.group({
      'name' : [null,Validators.compose([Validators.required])],
      'contact' : [null,Validators.compose([Validators.required,Validators.pattern("[0-9]{10}")])],
      'pincode' : [null,Validators.compose([Validators.required,Validators.pattern("[0-9]{6}")])],
      'locality' : [null],
      'city' : [null,Validators.compose([Validators.required])],
      'state' : [null,Validators.compose([Validators.required])],
      'address' : [null,Validators.compose([Validators.required])],
    }); 
    this.regaddressformgroup = this._formBuilder.group({
      'contact' : [null,Validators.compose([Validators.required,Validators.pattern("[0-9]{10}")])],
      'pincode' : [null,Validators.compose([Validators.required,Validators.pattern("[0-9]{6}")])],
    });
    this.rowaddressformgroup = this._formBuilder.group({
      'row_address' : [null,Validators.compose([Validators.required])],
      'state' : [null,Validators.compose([Validators.required])]
    });
  }

  ngOnInit() {
  this.todoservice.back_icon_template('Checkout',this.todoservice.back())
  $('.mobile-footer').remove();  
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
  
  
  if(this.productservice.get_region())
  {
    this.region = this.productservice.get_region();
    // this.addressformgroup.controls['state'].setValue(this.region);
    // this.rowaddressformgroup.controls['state'].setValue(this.region);
  }
  if(this.todoservice.get_param('addr'))
  {
    this.tab_address = this.todoservice.get_param('addr');
    this.edit_address(this.tab_address);
  }

  if(this.todoservice.get_param('pincode'))
  {
    this.pincode = this.todoservice.get_param('pincode');
  }

  if(this.todoservice.get_param('tracker') && this.todoservice.get_param('tracker') == 'product')
  {
    this.params.tracker = 'product';
    this.params.id      = this.todoservice.get_param('id');
    this.product_items = this.productservice.cart_items.filter(item => item.product.id == this.todoservice.get_param('id'));
  }
    
    if(this.productservice.get_pincode())
    {
      this.pincode = this.productservice.get_pincode()
      this.addressformgroup.controls['pincode'].setValue(this.pincode);
      this.regaddressformgroup.controls['pincode'].setValue(this.pincode);
    }
    this.spinner.hide();
    this.get_checkout_data();
    this.todoservice.get_user_data();
    if(this.get_token())
    {
      if(this.todoservice.get_user_product_amount() > 0)
      {
        this.fetch_options()
      }
    }
    this.ControlFormGroup = this.addressformgroup;
     
  }

  ini_list()
  {
    if($('#init-list-script'))
    {
      $('#init-list-script').remove();
    }
	  let script = this._renderer2.createElement('script');
    script.type = `text/javascript`;
    script.id = `init-list-script`;
    script.text = `
    $(document).ready(function(){
     
    });
    `;
    this._renderer2.appendChild(this._document.body, script);
  }
call_change_section(activesection)
{
  this.gosection_data = {to_login: false,to_order_summary : false,to_address : false,to_payment:false}
  if(activesection == 'to_login')
  {
    this.gosection_data.to_login = true;
  }
  else if(activesection == 'to_order_summary')
  {
    this.gosection_data.to_order_summary = true;
  }
  else if(activesection == 'to_address')
  {
    $('.second-line').addClass('white');
    $('.third-line').removeClass('white');
    $('.fourth-line').removeClass('white');
    $('.chngs3').removeClass('hide');				
    this.gosection_data.to_address = true;
  }
  else if(activesection == 'to_payment')
  {
    $('.chng').removeClass('hide');
    $('.chngs3').removeClass('hide');				
    $('.chngs2').removeClass('hide');				
    $('.naam4').addClass('hide');				
    $('.fourth-line').css('background','white');
    $('.fourth-line').css('box-shadow','none');	
    this.gosection_data.to_payment = true;
  }
}
change_addr_form(section)
{
  if(section == 'reg-address')
    this.reg_address = 1;
  $('#add-new-address').hide();
  $('#add-row-address').hide();
  $('#reg-address').hide();
  $('#'+section).show();
  if(section == 'add-new-address')
  {
    this.ControlFormGroup = this.addressformgroup;
  }
  else if(section == 'add-row-address')
  {
    this.ControlFormGroup = this.rowaddressformgroup
  }
  else if(section == 'reg-address')
  {
    this.ControlFormGroup = this.regaddressformgroup
  }
}
check_wallet_content()
{
  this.checkbox_text = {checkbox : false,radio : false,no_input : false}
  if(this.itemCount() == 1 && this.todoservice.get_user_product_amount() < this.options.how_much_apply_to_product)
  {
    if(this.calculateAmount() > this.todoservice.get_user_wallet_amount() && this.todoservice.get_user_wallet_amount() > 0)
    {
      this.checkbox_text.checkbox = true;
      return;
    }
    else if(this.calculateAmount() <= this.todoservice.get_user_wallet_amount())
    {
      this.checkbox_text.radio =  true;
      return;
    }
    this.checkbox_text.no_input =  true;
  }
  else if(this.calculateAmount() <= this.todoservice.get_user_wallet_amount())
  {
    this.checkbox_text.radio =  true;
  }
  else
  {
    this.checkbox_text.no_input = true;
  }
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
  this.todoservice.fetch_address_(data)
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
          if(data.address.length > 0)
          {
            this.address = data.address[0];
            this.tab_address = this.address.id;
            this.myStepper.next();
          }
        }
        this.spinner.hide();
      }
    )  
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

select_package(id)
{
  this.product = id;
  this.todoservice.fetch_packs_and_month({circle: this.region,product: id})
  .subscribe(
    data => 
    {
      this.months = data.PACKAGEMONTH;
      this.channels_packs = data.package;
      this.product = data.product;
      this.initialize_collapse();
      this.filter_channel_subpack();
      this.selectedCartItem = this.productservice.selectCartItemById(id);
    }
  )
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
    this.selectedCartItem.product.pack_selected = this.pack_selected;
    this.productservice.addto_cart(this.selectedCartItem.product.id,this.selectedCartItem.product)
    this.calculate_amount();
  }

  to_order_summary()
  {
    $('html, body').animate({
      scrollTop: $(".order-summary").offset().top -100
    }, 1000);
  }

  cashback_amount()
  {
    let cart :any = this.product_items;
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

  calculate_amount()
  {
    let amount : number = 0;
    if(!this.product)
      return 0;
    //console.log(this.pack_selected)
    for(var i = 0;i < this.pack_selected.length;i++)
    {
      if(this.multienable)
      {
        amount = amount + Number(this.pack_selected[i].multi_price);
      }
      else
      {
        amount = amount + Number(this.pack_selected[i].price);
      }
    }
    amount = amount + Number(this.product.offer_price);  
    // if(this.product.promos)
    // {
    //   if(this.promos.discount <= this.promos.max_discount)
    //   {
    //     amount = amount - Number(this.promos.discount);
    //   }
    // } 
    if(this.options && this.todoservice.get_user_product_amount() >= this.options.how_much_apply_to_product) 
      amount = amount - this.options.how_much_apply_to_product;
    return amount;
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
to_number(string)
{
  return Number(string);
}

remove_new_line(str)
{
  return str.replace(/(\r\n|\n|\r|↵|rn)/g,"");
}

select_month(month,id)
{
  this.month = month;
  this.fetch_package(id);
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
  if(this.selectedCartItem)
  {
    this.selectedCartItem.product.pack_selected = this.pack_selected;
    this.productservice.addto_cart(this.selectedCartItem.product.id,this.selectedCartItem.product);
  }
  
}

filter_circle(circle_id)
{
  if(circle_id == '' || !this.circles)
    return;
  let circle_record = this.circles.filter(x => x.circle_id == circle_id);
  if(circle_record.length > 0)
    return circle_record[0].name;
  else
    return circle_id
}

bonus_quantity(index)
{
  index = index;
  var $userwallet = this.todoservice.get_user_product_amount();
  for(var i = 0; i < this.product_items.length;i++)
  {
    var bonus_amount : number = 0;
    if(this.product_items[i].product.offer_price >= this.options.apply_minimum_product)
    {
      for(var j=0;j<this.product_items[i].quantity;j++)
      {
        if( $userwallet * 1 >= this.options.how_much_apply_to_product)
        {
          $userwallet = $userwallet * 1 -  1 * this.options.how_much_apply_to_product;
          bonus_amount = bonus_amount + this.options.how_much_apply_to_product * 1;
        }
      }
      if(index == i)
      {
        var inx = (bonus_amount * 1) / (1 * this.options.how_much_apply_to_product);
        return inx
      }
    }
  } 
  return 0;
}

calculate_bonus()
{
  var amount : number = 0;
  if(this.options && this.product_items.length > 0)
  {
    var $userwallet = this.todoservice.get_user_product_amount();
    for(var i = 0; i < this.product_items.length;i++)
    {
      if(this.product_items[i].product.offer_price >= this.options.apply_minimum_product)
      {
        for(var j=0;j<this.product_items[i].quantity;j++)
        {
          if( $userwallet * 1 >= this.options.how_much_apply_to_product)
          {
            $userwallet = $userwallet * 1 -  1 * this.options.how_much_apply_to_product;
            amount = amount + this.options.how_much_apply_to_product * 1;
          }
        }
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
    if((this.calculateAmount() > this.todoservice.get_user_wallet_amount()) && wallet_used == 'wallet')
    {
      return Math.ceil(this.calculateAmount() - this.todoservice.get_user_wallet_amount());
    }
    return Math.ceil(this.calculateAmount());
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
        this.app_version();
        if(data.status == 'Invalid Token')
        {                                                     
          this.authservice.clear_session();
          this.router.navigate(['/home']);
        }
        if(data.CIRCLES)
        {
          this.circles = data.CIRCLES;
        }
        if(!jQuery.isEmptyObject(data))
        {
          this.addresses = data.ADDRESSES;
        }
        this.spinner.hide();
        if(this.product_items.length == 1)
        {
          if(this.product_items[0].product.multi == 1 && this.todoservice.get_user_type() == 2)
          {
            $('.second-line').hide();
            //$('.checkout_3').hide();
            $('.payment-number span').text('3');
            $('.second-line').hide();
            this.topaybutton = true;
          }
        }
      }
    )  
  }
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
          this.params.addr = this.tab_address;
          this.router.navigate(['/product/step-checkout/'],{queryParams: this.params});
          this.myStepper.next();
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
        if(!jQuery.isEmptyObject(data))
        {
           this.address = data.added_address; 
           this.tab_address = this.address.address_id;
           this.params.addr = this.tab_address;
           this.router.navigate(['/product/step-checkout/'],{queryParams: this.params});
           this.myStepper.next();
        }
        this.spinner.hide();
      }
    )  
}

set_on_tab(addr)
{
  this.tab_address = addr;
}

calculateAmount() : number
{
let cart : any = this.product_items;
let amount : number = 0;
if(cart == null)
{
  return amount;
}
for(var i =0;i< cart.length;i++)
{
  var product_amount : number = 0; 
  let item :Item = cart[i];
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

itemCount()
{
  return this.product_items.length;
}

checkout_items(type)
{
  this.spinner.show();
  if(this.tab_address)
    var address_id = this.tab_address;
  let wallet_type = $('#wallet-type input[type="radio"]:checked').val();
  let p_data : any = [];
  for(var i = 0;i < this.product_items.length;i++)
  {
    let pkarr = [];
    for(var j = 0;j < this.product_items[i].product.pack_selected.length;j++)
    {
      pkarr.push(this.product_items[i].product.pack_selected[j].p_id);
    }
    let arr = {p_id : this.product_items[i].product.id,pk : pkarr,qty: this.product_items[i].quantity }
    if(this.product_items[i].product.promos)
      arr['pr_id'] = this.product_items[i].product.promos.id;
    if(this.product_items[i].product.month_pack)
      arr['month_pack'] = this.product_items[i].product.month_pack;
    if(this.product_items[i].product.pincode)
      arr['pincode'] = this.product_items[i].product.pincode;
    if(this.product_items[i].product.subscriber_id)
      arr['subscriber_id'] = this.product_items[i].product.subscriber_id;      
    p_data.push(arr);  
  }
  let data : any = {token : this.get_token(),address_id: address_id, reg : this.reg_address, p_data : p_data,wallet_type : wallet_type ,cart_amount: this.calculateAmount()};
  if($('#wallet-type [name="include_wallet"]:checked').length > 0)
    data.include_wallet = 1;
  if(this.region)
    data.region = this.region;  
  if(this.calculate_bonus() > 0)
    data.bonus = 1;
  this.disabled = true;     
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
          if(data.error && data.error == 'balance_error')
          {
            this.toastr.errorToastr("InSufficient Balance.");
            return false;
          }
          if(data.status == true)
          {
            if(typeof data.red_auth != 'undefined' && data.red_auth == 'ptm')
            {
              if(typeof data.for_tsk != 'undefined' && data.for_tsk == 1)
              {
                window.location.href = this.todoservice.base_url+"web-app/do-paytm/tsk-index.php?pt_t="+data.pt_t+"&order_id="+data.order_id+'&token='+this.get_token()+'&amount='+data.tsk_amount;
              }
              else
              {
                if(document.URL.indexOf('android_asset') !== -1)
                {
                  var ref = window.cordova.InAppBrowser.open(this.todoservice.base_url+"web-app/do-paytm/?pt_t="+data.pt_t+"&order_id="+data.order_id+'&token='+this.get_token()+'&amount='+data.amount, '_blank', 'location=yes');
                  window.me = this;
                  ref.addEventListener('loadstart', function(event) { 
                    var urlSuccessPage = "order-receipt";
                    if (event.url.indexOf(urlSuccessPage) > 0) {
                      ref.close();
                      var orderid = event.url.replace(this.todoservice.base_url+"product/order-receipt/","");
                      window.me.router.navigate(['/product/order-receipt/'+orderid]);    
                    }
                });
                  
                }
                else
                  window.location.href = this.todoservice.base_url+"web-app/do-paytm/?pt_t="+data.pt_t+"&order_id="+data.order_id+'&token='+this.get_token()+'&amount='+data.amount;
              }
      
            }
            else if(typeof data.red_auth != 'undefined' && data.red_auth == 'card')
            {
              if(document.URL.indexOf('android_asset') !== -1)
                {
                  var ref = window.cordova.InAppBrowser.open(this.todoservice.base_url+"accounts/apis/response/product_pay/?order_id="+data.order_id, '_blank', 'location=yes');
                  window.me = this;
                  ref.addEventListener('loadstart', function(event) { 
                    var urlSuccessPage = "order-receipt";
                    if (event.url.indexOf(urlSuccessPage) > 0) {
                      ref.close();
                      var orderid = event.url.replace(this.todoservice.base_url+"product/order-receipt/","");
                      window.me.router.navigate(['/product/order-receipt/'+orderid]);    
                    }
                });
                  
                }
                else
                  window.location.href = this.todoservice.base_url+"accounts/apis/response/product_pay/?order_id="+data.order_id;
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

initialize_collapse()
{
  this.init_accordian();
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

app_version()
{
    var Headers_of_api = new Headers({
        'Content-Type' : 'application/x-www-form-urlencoded'
      });
    this.http.post(this.todoservice.base_url+'accounts/apis/home/app_version', { }, {headers: Headers_of_api}).subscribe(
        data => {
            let response = $.parseJSON(data['_body'])
            if(response.version && response.alert == 'on')
            {
              if(document.URL.indexOf('android_asset') !== -1)
              {
                  if(window.cordova.getAppVersion)
                  {
                    window.appversion = response.version;
                    if(response.app_text)
                    {
                      window.apptext = response.app_text;
                    }
                    window.cordova.getAppVersion.getVersionCode(function(version){
                        if(version *1 < window.appversion *1 )
                        {
                          setTimeout(()=>{    //<<<---    using ()=> syntax
                            $('.religon-overlay').show();
                            if(window.apptext && window.apptext != '')
                            {
                              $('.religon-overlay #custom-text').text(window.apptext);
                            }
                          }, 1000);
                        } 
                    });  
                  }
                } 
            }
        }
    )
  }        

update_application()
{
  if(window.cordova)
    window.cordova.plugins.market.open("mydth.app");
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
