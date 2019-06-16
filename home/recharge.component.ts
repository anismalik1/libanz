import { Component, OnInit,ViewChild ,Renderer2,Inject,} from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { TodoService } from '../todo.service';
import { AuthService } from '../auth.service';
import {Location} from '@angular/common';
import { Params } from '../shared/config/params.service';
import { Router ,ActivatedRoute} from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Package } from '../packages.entities.service';
import { RechargeType } from '../recharge.type';
import { Meta ,Title,DOCUMENT} from '@angular/platform-browser';
import * as $ from 'jquery';

@Component({
  selector: 'app-recharge',
  templateUrl: './recharge.component.html',
  styles: []
})
export class RechargeComponent implements OnInit {
  @ViewChild('operator') moperator;                                                        
  @ViewChild('postoperator') postoperator;                                                        
  @ViewChild('mcircle') mcircle;                                                        
  @ViewChild('dcircle') dcircle;                                                        
  @ViewChild('predataoperator') predataoperator;                                                        
  @ViewChild('postdataoperator') postdataoperator;                                                        
  public userinfo = {wallet:'',phone:'',name:''};
  public operators : any = {};
  public loop : boolean = false;
  public selectedOperator : number ;
  public rechargeAmount : number ;
  public rechargeId : number ;
  public recharge_ini : number = 1;
  promo_selected : number = 0;
  no_dues = 0;
  bill_amt : number;
  due_msg : string = 'No pending dues.';
  rechargeData : any ;
  flash_deals : any;
  tata_slides : any;
  dishtv_slides : any;
  videcone_slides : any;
  airtel_slides : any;
  instant_checked : boolean = true;
  circles : any;
  pay_step : number = 1;
  prepaid_list : number = 1;
  dthminlength : number = 0;
  dthmaxlength : number = 0;
  viewrange : number = 0;
  showstd : number = 0;
  mobilegroup : FormGroup;
  dthgroup : FormGroup;
  datacardgroup : FormGroup;
  landlinegroup : FormGroup;
  broadbandgroup : FormGroup;
  electricitygroup : FormGroup;
  banners : any = [];
  gasgroup : FormGroup;
  watergroup : FormGroup;
  order : any = {};
  package_item : Package;
  packages : Package[];
  product_mpackages : Package[];
  promo_codes : any ;
  url_name : string;
  selected_promo : any;
  region : number = 0;
  operator_id : number = 0;
  activity : number = 0;
  plans : any;
  constructor(
    private _renderer2: Renderer2, 
     @Inject(DOCUMENT) private _document, 
    public todoservice : TodoService,
    private authservice : AuthService,
    public params : Params,
    private router : Router,
    private activatedroute : ActivatedRoute,
    private fb: FormBuilder,
    public spinner : NgxSpinnerService,
    private location : Location,
    public recharge_type : RechargeType,
    private title : Title,
    private meta : Meta
  ) { 
    if(this.activatedroute.snapshot.url.length > 2 && this.activatedroute.snapshot.url[2].path != '')
    {
      if(localStorage.getItem('recharge_cart') != null)
      {
        this.rechargeData = JSON.parse(localStorage.getItem('recharge_cart'));
        this.recharge_ini = 2;

      }
      
    }
      this.url_name = this.activatedroute.snapshot.params['name'];
      this.ini_recharge_tabs(this.url_name);
    this.mobilegroup = fb.group({
      'amount' : [null,Validators.compose([Validators.required])],
       'operator' : [null,Validators.compose([Validators.required])],
       'recharge_id' : [null,Validators.compose([Validators.required])],
       'circle_area1' : [null,Validators.compose([Validators.required])]
     });
     this.dthgroup = fb.group({
       'amount' : [null,Validators.compose([Validators.required])],
        'operator' : [null,Validators.compose([Validators.required])],
        'recharge_id' : [null,Validators.compose([Validators.required])]
      });
      this.datacardgroup = fb.group({
       'amount' : [null,Validators.compose([Validators.required])],
        'operator' : [null,Validators.compose([Validators.required])],
        'recharge_id' : [null,Validators.compose([Validators.required])]
      });
      this.landlinegroup = fb.group({
       'amount' : [null,Validators.compose([Validators.required])],
        'operator' : [null,Validators.compose([Validators.required])],
        'recharge_id' : [null,Validators.compose([Validators.required])]
      });
      this.broadbandgroup = fb.group({
       'amount' : [null,Validators.compose([Validators.required])],
        'operator' : [null,Validators.compose([Validators.required])],
        'recharge_id' : [null,Validators.compose([Validators.required])]
      });
      this.electricitygroup = fb.group({
       'amount' : [null,Validators.compose([Validators.required])],
        'operator' : [null,Validators.compose([Validators.required])],
        'recharge_id' : [null,Validators.compose([Validators.required])]
      });
      this.gasgroup = fb.group({
       'amount' : [null,Validators.compose([Validators.required])],
        'operator' : [null,Validators.compose([Validators.required])],
        'recharge_id' : [null,Validators.compose([Validators.required])]
      });
      this.watergroup = fb.group({
       'amount' : [null,Validators.compose([Validators.required])],
        'operator' : [null,Validators.compose([Validators.required])],
        'recharge_id' : [null,Validators.compose([Validators.required])]
      });
      
     spinner.show()
     let data = {token : ''};
      this.todoservice.fetch_operators(data)
      .subscribe(
        data => 
        {
            this.operators = data.OPERATORS;
            this.circles  = data.CIRCLES;
            spinner.hide();
        }
      )
    this.ini_script()   
  }
  show_circles_package()
  {
    
  }
  ini_script()
  {
    if($('#init-script'))
    {
      $('#init-script').remove();
    }
	  let script = this._renderer2.createElement('script');
    script.type = `text/javascript`;
    script.id = `init-list-script`;
    script.text = `
   $(document).ready(function(){
    $('.modal').modal();
    
    });
    function pack_price(price)
    {
      $('[ng-reflect-name="amount"]').val(price);
    }
    `;
    this._renderer2.appendChild(this._document.body, script);
  }

  
  ini_recharge_tabs(tab)
  {
    this.spinner.show(); 
    this.recharge_type.mobile = false;
    this.recharge_type.dth = false;
    this.recharge_type.electricity = false;
    this.recharge_type.water = false;
    this.recharge_type.gas = false;
    this.recharge_type.broadband = false;
    this.recharge_type.cable = false;
    this.recharge_type.datacard = false;
    this.recharge_type.landline = false;
    
      if(tab == 'mobile' || tab == 'mobile-postpaid')
      {
        this.recharge_type.mobile = true;
      }
      else if(tab == 'dth-recharge')
      {
        this.recharge_type.dth = true;
      }
      else if(tab == 'electricity')
      {
        this.recharge_type.electricity = true;
      }
      else if(tab == 'water')
      {
        this.recharge_type.water = true;
      }
      else if(tab == 'gas')
      {
        this.recharge_type.gas = true;
      }
      else if(tab == 'broadband')
      {
        this.recharge_type.broadband = true;
      }
      else if(tab == 'cable')
      {
        this.recharge_type.cable = true;
      }
      else if(tab == 'datacard')
      {
        this.recharge_type.datacard = true;
      }
      else if(tab == 'landline')
      {
        this.recharge_type.landline = true;
      }
      this.fetch_promocode(tab);
      this.fetch_navigate_data(tab);
  }
  fetch_promocode(tab)
  {
    this.todoservice.fetch_promocode({operator : tab})
    .subscribe(
      data => 
      {
        this.promo_codes = data.OPERATOR_PROMOS;
        this.spinner.hide();  
      }
    ) 
  }
  
  show_tab(action)
  {
    if(action == 1)
    {
      $('#circles-content').addClass('hide');
      $('#promo-content').removeClass('hide');
      $('#promo-content').addClass('active')
    }
    else
    {
      $('#circles-content').removeClass('hide');
      $('#promo-content').addClass('hide');
      $('#circles-content').addClass('active')
    }
  }
  fetch_navigate_data(page)
  {
    this.todoservice.fetch_page_data({page : page})
    .subscribe(
      data => 
      {
        if(data.PAGEDATA)
        {
          $('#short-content').html(data.PAGEDATA[0].shortDescription);
          $('#long-content').html(data.PAGEDATA[0].description);
          this.meta.addTag({ name: 'description', content: data.PAGEDATA[0].metaDesc });
          this.meta.addTag({ name: 'keywords', content: data.PAGEDATA[0].metaKeyword });
          this.title.setTitle(data.PAGEDATA[0].metaTitle);
          window.scroll(0,0); 
        }
        this.spinner.hide();  
      }
    ) 
  }
  htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g,'&gt;').replace(/"/g, '&quot;');
  }
  navigate_to(tab)
  {
    this.ini_recharge_tabs(tab);
  }
  changeOperator(data,s)
  {
    this.viewrange = 1;
    this.selectedOperator = data;
    if(s == 'mobile')
    {
      this.mcircle.open();
      this.filter_operator_name(this.selectedOperator);
    }
    else if(s == 'dth')
    {
      if(data == 68)
      {
        this.dthminlength = 11;
        this.dthmaxlength = 11;
      }else if(data == 69)
      {
        this.dthminlength = 8;
        this.dthmaxlength = 12;
        this.viewrange = 0;
      }else if(data == 71)
      {
        this.dthminlength = 10;
        this.dthmaxlength = 10;
      }else if(data == 72)
      {
        this.dthminlength = 8;
        this.dthmaxlength = 12;
        this.viewrange = 0;
      }else if(data == 74)
      {
        this.dthminlength = 10;
        this.dthmaxlength = 10;
      }
    }
    else if(s == 'card')
    {
      this.dcircle.open();
      this.filter_operator_name(this.selectedOperator);
    }
    else if(s == 'landline')
    {
      this.showstd = 1;
    }
    else if(s == 'broadband')
    {
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
    }
  }
  ngOnInit() {
  }

  show_operator(type)
  {
    if(type == 'prepaid')
    {
      $('#prepaid-list').removeClass('hide');
      $('#postpaid-list').addClass('hide');
      this.navigate_to('mobile');
    }
    else
    {
      $('#prepaid-list').addClass('hide');
      $('#postpaid-list').removeClass('hide');
      this.navigate_to('mobile-postpaid');
    }
  }
  recharge_init(s,formdata)
  {
    if(!this.authservice.authenticate())
    {
      $('.logup.modal-trigger')[0].click();
      return false;
    }

    if(s == 'mobile' && !this.mobilegroup.valid)
    {
      Object.keys(this.mobilegroup.controls).forEach(field => { // {1}
        const control = this.mobilegroup.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
      return;
    }
    else if(s == 'dth' && !this.dthgroup.valid)
    {
      Object.keys(this.dthgroup.controls).forEach(field => { // {1}
        const control = this.dthgroup.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
      return;
    }
    else if(s == 'datacard' && !this.datacardgroup.valid)
    {
      Object.keys(this.datacardgroup.controls).forEach(field => { // {1}
        const control = this.datacardgroup.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
      return;
    }
    else if(s == 'landline' && !this.landlinegroup.valid)
    {
      Object.keys(this.landlinegroup.controls).forEach(field => { // {1}
        const control = this.landlinegroup.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
      return;
    }
    else if(s == 'broadband' && !this.broadbandgroup.valid)
    {
      Object.keys(this.broadbandgroup.controls).forEach(field => { // {1}
        const control = this.broadbandgroup.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
      return;
    }
    else if(s == 'electricity' && !this.electricitygroup.valid)
    {
      Object.keys(this.electricitygroup.controls).forEach(field => { // {1}
        const control = this.electricitygroup.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
      return;
    }
    else if(s == 'gas' && !this.gasgroup.valid)
    {
      Object.keys(this.gasgroup.controls).forEach(field => { // {1}
        const control = this.gasgroup.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
      return;
    }
    else if(s == 'water' && !this.watergroup.valid)
    {
      Object.keys(this.watergroup.controls).forEach(field => { // {1}
        const control = this.watergroup.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
      return;
    }
    
    
    if(formdata.amount <= 0 || formdata.recharge_id <= 0 || formdata.operator <= 0 )
		{
      return false;
    }
    this.spinner.show();	
		this.rechargeData = {token : this.get_token(),recharge_amount: formdata.amount,recharge_id:formdata.recharge_id,operator_id:formdata.operator};
    this.todoservice.recharge_init(this.rechargeData)
		.subscribe(
			data => 
			{
				this.spinner.hide();
			  if(data.status == 'Invalid Token')
			  {
          this.authservice.clear_session();
          return false;
			  //	this.router.navigate(['/login']);
			  }
			  let b = JSON.stringify(data);
			  data =  JSON.parse(b.replace(/\\/g, ''));
			  if(!$.isEmptyObject(data))
			  {
				this.rechargeData.api_img = data.api_img;	
				this.rechargeData.cat_title = data.cat_title;	
				this.rechargeData.recharge_name = data.recharge_name;	
				this.rechargeData.title = data.title;
        this.recharge_ini = 2;
        this.addto_recharge_cart(this.rechargeData);
        this.router.navigate(['/recharge/'+this.url_name+'/proceed']);
        this.todoservice.service_url = this.todoservice.server_url+'index.php?/app_services/'; 				
			  }
			}
		  );
		
  }

recharge_handle()
 {
  if(!this.authservice.authenticate())
  {
      return false;
  }
  this.spinner.show();
  this.rechargeData.payment_type = $('[name="payment_type"]:checked').val(); 
	this.todoservice.recharge_handler(this.rechargeData)
	.subscribe(
        data => 
        {
          if(data.status == 'Invalid Token')
          {
            this.authservice.clear_session();
            return false;
          }
          let b = JSON.stringify(data);
          data =  JSON.parse(b.replace(/\\/g, ''));
          if(!$.isEmptyObject(data))
          {
            if(typeof data.red_auth != 'undefined' && data.red_auth == 'ptm')
            {
              window.location.href = "https://www.mydthshop.com/web-app/do-paytm/recharge-index.php?pt_t="+data.pt_t+"&order_id="+data.order_id+'&token='+this.get_token()+'&amount='+data.pt_amount;
            }
            else if(typeof data.red_auth != 'undefined' && data.red_auth == 'card')
            {
              window.location.href = "https://www.mydthshop.com/index.php?/app_responses/recharge_pay/?order_id="+data.order_id;
            }
          else
          {
            this.router.navigate(['/orders/recharge-receipt/'+data.unique_id]);
          } 
          } 
          this.todoservice.service_url = this.todoservice.server_url+'index.php?/app_services/';
        }
      )
 }
 other_to_pay(paystep)
  {
    this.pay_step = paystep;
  }
  addto_recharge_cart(data)
  {
    localStorage.setItem('recharge_cart',JSON.stringify(data));
  }

  copy_promo(name)
  {
    $('#place-promocode').val(name);
    //this.apply_promo();
  }
  promoselected(promo)
  {
    $('#response-code').text('');
    this.selected_promo = promo;
    this.copy_promo(this.selected_promo.name);
  }
  apply_promo()
  {
    let name = $('#place-promocode').val();
    if(name == '' || name == null )
    {
      $('#response-code').text('Please Enter Promo code');
      return false;
    }
    $('#apply-promo').text('WAIT..');
    this.todoservice.apply_promo_code({token:this.get_token(),promo: name,recharge_data : this.rechargeData})
		.subscribe(
			data => 
			{
        this.spinner.hide();
        $('#apply-promo').text('APPLY');
			  if(data.status == 'Invalid Token')
			  {
          this.authservice.clear_session();
          return false;
			  //	this.router.navigate(['/login']);
        }
        
			  let b = JSON.stringify(data);
			  data =  JSON.parse(b.replace(/\\/g, ''));
			  if(!$.isEmptyObject(data))
			  {
          if(data.status == true)
          {
            $('.modal-close').click();
            this.promo_selected = 1;
            this.rechargeData.promo_key = data.promo_key; 
          }
          else
          {
            $('#response-code').text(data.response);
          }
			  }
			}
		  );
  }
check_amount(s)
 {
  let v = $('#'+s+' [formControlName="recharge_id"]').val();
  if( typeof this.selectedOperator != 'undefined' || v != '')
  {
    $('#'+s+' .calc-amount-btn').text('Please Wait...');
    let data : any = {phone: v,operator: this.selectedOperator};
    this.todoservice.check_amount(data)
	  .subscribe(
        data => 
        {
          $('#'+s+' .calc-amount-btn').text('PROCEED');
          let b = JSON.stringify(data);
          data =  JSON.parse(b.replace(/\\/g, ''));
          if(!$.isEmptyObject(data))
          {
            if(data.status == 1)
            {
              if(data.amount > 0)
              {
                this.bill_amt = data.amount;
                if(s == 'landline')
                {
                  this.landlinegroup.controls['amount'].setValue(this.bill_amt);
                }
                else if(s == 'electricity')
                {
                  this.electricitygroup.controls['amount'].setValue(this.bill_amt);
                }
                else if(s == 'gas')
                {
                  this.gasgroup.controls['amount'].setValue(this.bill_amt);
                }
                else if(s == 'water')
                {
                  this.watergroup.controls['amount'].setValue(this.bill_amt);
                }
                
                $('#'+s+' .electric-cls1').removeClass('m5');
                $('#'+s+' .electric-cls2').removeClass('m5');
                $('#'+s+' .electric-cls-btn').addClass('hide');
                $('#'+s+' .electric-cls3').removeClass('hide');
                $('#'+s+' .electric-cls1').addClass('m3');
                $('#'+s+' .electric-cls2').addClass('m4');
              }
            }  
            else if(data.status == 2)
            {
              alert(data.message);
              this.due_msg = data.message;
            }
            else
            {
              alert('Someting Wrong. Try later');
            }
          }
        }
      )
  }
  else
  {
    alert('Enter a valid Number and Provider');
  }
 }
 
 next_to(s,control,e)
 {
  if(s == 'mobile')
  {
   if( this.check_if_not_digits(e))
   {
     this.mobilegroup.controls['recharge_id'].setValue(e.target.value.replace(/\D/g,''));
   }
   let recharge_id = e.target.value;
   if(recharge_id.length <= 2)
     return false;
   this.todoservice.check_if_recharge_exist({recharge_id: recharge_id})
   .subscribe(
     data => 
     {
       let recharge_data = data.RECHARGEID;
       if(!$.isEmptyObject(recharge_data))
       {
         this.region = recharge_data.circle_id;
         this.mobilegroup.controls['operator'].setValue(recharge_data.operator_id);
         this.selectedOperator = recharge_data.operator_id;
         this.filter_operator_name(recharge_data.operator_id);
         this.filter_circle_name(Number(recharge_data.circle_id));
         if(this.region > 0 && recharge_data.operator_id > 0)
         {
          if(this.activity != recharge_data.activity_id)
            this.get_plans(this.region,recharge_data.operator_api_id);
         } 
         this.operator_id = recharge_data.operator_api_id;
         this.activity = recharge_data.activity_id;
        }
       else
       {
         if(control == 'recharge_id' && this.mobilegroup.controls[control].valid && !this.operators.selected)
         {
           if($('.mobile-recharge-type:checked').val() == 1)
           {
             this.moperator.open();
           }
           else{
             this.postoperator.open();
           }
         }
       }
       this.spinner.hide();
     }
   )  
   
  }
   else if(s == 'dth')
   {
    if( this.check_if_not_digits(e))
    {
      this.dthgroup.controls['recharge_id'].setValue(e.target.value.replace(/\D/g,''));
    }
   }
   else if(s == 'datacard')
   {
    if( this.check_if_not_digits(e))
    {
      this.datacardgroup.controls['recharge_id'].setValue(e.target.value.replace(/\D/g,''));
    }
    if(control == 'recharge_id' && this.datacardgroup.controls[control].valid)
    {
      
      if($('.data-card-type:checked').val() == 1)
      {
        this.predataoperator.open();
      }
      else{
        this.postdataoperator.open();
      }
    }
   }
   else if(s == 'datacard')
   {
    
   }  
 }
 get_plans(circle,operator)
 {
   if(operator == 'get')
   {
    operator = this.operator_id;
   }
    
    this.todoservice.get_plans({circle:circle,operator:operator})
		.subscribe(
			data => 
			{
        this.plans = data;
      }    
		  );
 } 

 print_plan(data,id)
  {
    
    $("#circles-content li").removeClass('active');
    $("#list-"+id).addClass('active');
    var plan_list = '';
    for(var i=0;i<data.length;i++)
    {
      plan_list += '<tr><td>'+data[i].desc+'</td><td>'+data[i].validity+'</td><td><a class="pack-price" href="javascript:" onclick="pack_price('+data[i].rs+')">'+data[i].rs+'</a></td></tr>';
    }
    $('#print-data').html(plan_list);
  }

 filter_circle_name(id)
 {
  this.circles.selected = this.circles.filter(x => x.circle_id == id);
 } 

 filter_operator_name(id)
   {
    let operator = this.operators.MOBILEPREPAID.filter(x => x.id == id);
    if(!operator)
    operator = this.operators.MOBILEPOSTPAID.filter(x => x.id == id);
    this.operators.selected = operator;
    this.operator_id = operator[0].recharge_id;
   }

 check_if_not_digits(dig)
 {
  let evt = (dig) ? dig : event;
  var charCode = (dig.charCode) ? dig.charCode : ((dig.keyCode) ? dig.keyCode :
     ((dig.which) ? dig.which : 0));
  if (charCode > 31 && (charCode < 65 || charCode > 90) &&
     (charCode < 97 || charCode > 122)) {
     return false;  
  }
  return true;
 } 
 copyToClipboard(): void {
  $('#inputcopyId').select();
  document.execCommand('copy');
}
  get_token()
  {
    return this.authservice.auth_token();
  }
}
