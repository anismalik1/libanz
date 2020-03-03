import { Component, OnInit,ViewChild ,ViewContainerRef,Renderer2,Inject,} from '@angular/core';
import { FormBuilder, Validators, FormGroup,FormControl } from '@angular/forms';
import { TodoService } from '../todo.service';
import { AuthService } from '../auth.service';
import {Location} from '@angular/common';
import { Params } from '../shared/config/params.service';
import { Observable} from 'rxjs';
import { map, startWith} from 'rxjs/operators';
import { Router ,ActivatedRoute} from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Package } from '../packages.entities.service';
import { RechargeType } from '../recharge.type';
import { Meta ,Title} from '@angular/platform-browser';
import { DOCUMENT} from '@angular/common';
import { ToastrManager } from 'ng6-toastr-notifications';
import * as $ from 'jquery';
import { element } from 'protractor';

@Component({
  selector: 'app-recharge',
  templateUrl: './recharge.component.html',
  styles: []
})
export class RechargeComponent implements OnInit {
  myControl = new FormControl();
  @ViewChild('operator', {static: false}) moperator;                                                        
  @ViewChild('postoperator', {static: false}) postoperator;                                                        
  @ViewChild('mcircle', {static: false}) mcircle;                                                        
  @ViewChild('dcircle', {static: false}) dcircle;                                                        
  @ViewChild('predataoperator', {static: false}) predataoperator;                                                        
  @ViewChild('postdataoperator', {static: false}) postdataoperator;                                                        
  public userinfo = {wallet:'',phone:'',name:''};
  public operators : any = {};
  public loop : boolean = false;
  public selectedOperator : number ;
  public rechargeAmount : number ;
  public rechargeId : number ;
  public recharge_ini : number = 1;
  public recharge_cart : any;
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
  dthminlength : number = 8;
  dthmaxlength : number = 12;
  validationtext : string = '';
  viewrange : number = 0;
  showstd : number = 0;
  mobilegroup : FormGroup;
  dthgroup : FormGroup;
  datacardgroup : FormGroup;
  landlinegroup : FormGroup;
  broadbandgroup : FormGroup;
  electricitygroup : FormGroup;
  testgroup : FormGroup;
  banners : any = [];
  gasgroup : FormGroup;
  watergroup : FormGroup;
  cablegroup : FormGroup;
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
  alloperators : any;
  selected_operator : number = 0;
  options: any = [{ title: 'One',id:1},{title:  'Two',id:2},{title: 'Three',id:3}];
  filteredOptions: Observable<object>;
  filterdList : boolean = false;
  tab_1 : boolean = false;
  tab_2 : boolean = false;
  electricity_operators :any;
  last_recharges : any;
  dthpattern : string = '';
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
    private meta : Meta,
    private toastr : ToastrManager,
    private vcr: ViewContainerRef,
  ) {
    
      this.url_name = this.activatedroute.snapshot.params['name'];
      this.ini_recharge_tabs(this.url_name);
   
      this.testgroup = this.fb.group({
        'test_id' : [null,Validators.compose([Validators.required,Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")])],
      });
     spinner.show()
    this.ini_script() ;
    if(this.get_token())
      this.get_last_recharges()  
  }

  check_list(type)
  {
    if(this.url_name.includes(type))
    {
      return 'hide'
    }
    return '';
  }

  get_last_recharges()
  {
    this.todoservice.get_last_recharges({token : this.get_token(),category: this.url_name})
    .subscribe(
      data => 
      {
        this.last_recharges = data.LAST_RECHARGE;
        this.spinner.hide();  
      }
    ) 
  }

  
  decode_data(data,action)
  {
    let jsondecode : any = [];
    if(data != '')
    {
      jsondecode = JSON.parse(data);
      if(action == 'operator')
      {
        return jsondecode.operator_title;
      }
      else if(action == 'img')
      {
        return jsondecode.operator_image;
      }
    }  
    return '';
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
    $('.tooltipped').tooltip();
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
    this.url_name = tab;
    this.show_tab(1)
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

    this.plans = [];
      if(tab == 'mobile' || tab == 'mobile-postpaid')
      {
       
        this.recharge_type.mobile = true;

        if(this.operator_id > 0 && this.region > 0)
        {
          this.get_plans(this.region,this.operator_id);
        }
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
      else if(tab == 'datacard' || tab == 'datacard-postpaid')
      {
        this.recharge_type.datacard = true;
      }
      else if(tab == 'landline')
      {
        this.recharge_type.landline = true;
      }
      this.fetch_promocode(tab);
      this.fetch_navigate_data(tab);
      this.get_last_recharges();
      
      this.mobilegroup = this.fb.group({
        'amount' : [null,[Validators.required,Validators.min(10),Validators.max(19999),Validators.pattern("[0-9]{2,5}$")]],
        // 'test_id' : [null,Validators.compose([Validators.required,Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")])],
         'operator' : [null,Validators.compose([Validators.required])],
         recharge_id: new FormControl('', [Validators.required,Validators.minLength(10)]),
        // 'recharge_id' : [null,Validators.compose([Validators.required])], //[null,[Validators.required,Validators.minLength(10),Validators.pattern("[0-9]{10}$")]],
         'circle_area' : [null,Validators.compose([Validators.required])]
       });
       this.dthgroup = this.fb.group({
         'amount' : [null,[Validators.required,Validators.min(50),Validators.max(19999),Validators.pattern("[0-9]{2,5}$")]],
          'operator' : [null,Validators.compose([Validators.required])],
          'recharge_id' : [null,Validators.compose([Validators.required,Validators.pattern(this.dthpattern)])],
        });
        this.datacardgroup = this.fb.group({
          'amount' : [null,[Validators.required,Validators.min(10),Validators.max(19999),Validators.pattern("[0-9]{2,5}$")]],
          'operator' : [null,Validators.compose([Validators.required])],
          recharge_id: new FormControl('', [Validators.required,Validators.minLength(10)]),
        });
        this.landlinegroup = this.fb.group({
          'amount' : [null,[Validators.required,Validators.min(10),Validators.max(19999),Validators.pattern("[0-9]{2,5}$")]],
          'operator' : [null,Validators.compose([Validators.required])],
          'recharge_id' : [null,Validators.compose([Validators.required])]
        });
        this.broadbandgroup = this.fb.group({
          'amount' : [null,[Validators.required,Validators.min(10),Validators.max(19999),Validators.pattern("[0-9]{2,5}$")]],
          'operator' : [null,Validators.compose([Validators.required])],
          recharge_id: new FormControl('', [Validators.required,Validators.minLength(10)]),
        });
        this.electricitygroup = this.fb.group({
         'circle' : [null],
         'amount' : [null,[Validators.required,Validators.min(10),Validators.max(19999),Validators.pattern("[0-9]{2,5}$")]],
          'operator' : [null,Validators.compose([Validators.required])],
          'recharge_id' : [null,Validators.compose([Validators.required])]
        });
        this.gasgroup = this.fb.group({
          'amount' : [null,[Validators.required,Validators.min(10),Validators.max(19999),Validators.pattern("[0-9]{2,5}$")]],
          'operator' : [null,Validators.compose([Validators.required])],
          'recharge_id' : [null,Validators.compose([Validators.required])]
        });
        this.watergroup = this.fb.group({
          'amount' : [null,[Validators.required,Validators.min(10),Validators.max(19999),Validators.pattern("[0-9]{2,5}$")]],
          'operator' : [null,Validators.compose([Validators.required])],
          'recharge_id' : [null,Validators.compose([Validators.required])]
        });
        this.cablegroup = this.fb.group({
          'amount' : [null,[Validators.required,Validators.min(10),Validators.max(19999),Validators.pattern("[0-9]{2,5}$")]],
           'operator' : [null,Validators.compose([Validators.required])],
           'recharge_id' : [null,Validators.compose([Validators.required])]
         });
  } 
  fetch_promocode(tab)
  {
    this.todoservice.fetch_promocode({operator : tab})
    .subscribe(
      data => 
      {
        this.promo_codes = data.OPERATOR_PROMOS;
        //console.log(this.promo_codes)
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
      $('#promo-content').addClass('active');
      $("#tab-1").addClass('active');
      $("#tab-2").removeClass('active');
      this.tab_1 = true; 
      this.tab_2 = false; 
    }
    else
    {
      $('#circles-content').removeClass('hide');
      $('#promo-content').addClass('hide');
      $('#circles-content').addClass('active');
      $("#tab-1").removeClass('active');
      $("#tab-2").addClass('active');
      this.tab_1 = false; 
      this.tab_2 = true; 
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
          $('#page-title').html(data.PAGEDATA[0].title);
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
    //console.log(data);
    $('.additional-text').remove()
    this.viewrange = 1;
    var operatordata = this.alloperators.filter(x => x.id == data);

    if(operatordata.amount_type == 1)
    {
      var commission = operatordata.commission;
      var type = '%';
    }
    else
    {
      var commission = operatordata.commission;
      var type = '';
    }
    var text = '';
    if(operatordata.commission_type == 1)
    {
      text = "Congrates! "+commission+type+" Amount will be Credited.";
    }
    else
    {
      text = "Additional "+commission+type+" Amount will be Deducted.";
    }
    
    
    if(commission > 0)
    {
      if(operatordata.commission_type == 1 && this.todoservice.get_user_type() == 2)
        $("#"+s+"-form .btn-flat").parent().before("<div class='col m12 green-text additional-text'>"+text+"</div>");
      else if(operatordata.commission_type == 2)
      {
        $("#"+s+"-form .btn-flat").parent().before("<div class='col m12 red-text additional-text'>"+text+"</div>");
      }
    }  
      
    this.selectedOperator = data;
    this.mobilegroup.controls['circle_area'].setValue(0);
    if(s == 'mobile')
    {
      this.operator_id = operatordata.recharge_id;
      this.mcircle.open();
      this.filter_operator_name(this.selectedOperator);
    }
    else if(s == 'dth')
    {
      if(data == 68)
      {
        this.validationtext = "Please Enter Registered Mobile No./ Viewing Card No.";
        this.dthpattern = "[0-9]{10}$";
      }else if(data == 69)
      {
        this.validationtext = "Please Enter 11 digits long Smart Card Number .";
        this.dthpattern = "[0-9]{11}$";
      }else if(data == 71)
      {
        this.dthpattern = "[1][0-9]{9}$";
        this.validationtext = "Subscriber ID starts with 1 and 10 digits long. To locate it, press the home button on remote.";
      }else if(data == 72)
      {
        this.dthpattern = "[0-9]{10}$";
        this.validationtext = "Know your Customer ID SMS 'ID' to 566777 from your registered mobile number.";
      }else if(data == 74)
      {
        this.dthpattern = "[3][0-9]{9}$";
        this.validationtext = "Customer ID starts with 3 and is 10 digits long. To locate it, press the MENU button on remote";
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
  }
    change_list(val)
  {
    if(val == 1)
    {
      $('#prepaid-list').removeClass('hide');
      $('#postpaid-list').addClass('hide');
      this.moperator.open();
    }
    else if(val == 2)
    {
      $('#postpaid-list').removeClass('hide');
      $('#prepaid-list').addClass('hide');
      this.postoperator.open();
    }
    else if(val == 3)
    {
      $('#post-datacard-list').addClass('hide');
      $('#pre-datacard-list').removeClass('hide');
      this.predataoperator.open();
    }
    else if(val == 4)
    {
      $('#post-datacard-list').removeClass('hide');
      $('#pre-datacard-list').addClass('hide');
      this.postdataoperator.open();
    }

  }
  ngOnInit() {
    let data = {token : ''};
      this.todoservice.fetch_operators(data)
      .subscribe(
        data => 
        {
            this.alloperators = data.ALLOPERATORS;
            this.operators = data.ALLOPERATORS;
            this.circles  = data.CIRCLES;
            this.spinner.hide();
            let recharge_data  = this.todoservice.get_recharge();
            if(recharge_data && !recharge_data.operator_id )
            {
              localStorage.removeItem('recharge_cart');
              return false;
            }
            this.recharge_cart = recharge_data;
            if(recharge_data.circle_id)
              this.region        = recharge_data.circle_id;
            if(this.recharge_cart != null)
            {
              //console.log(this.recharge_cart);
              if(this.recharge_cart.recharge_type == 'mobile')
              {
                this.mobilegroup.controls['recharge_id'].setValue(recharge_data.recharge_id);
                this.mobilegroup.controls['operator'].setValue(recharge_data.operator_id);
                this.mobilegroup.controls['circle_area'].setValue(this.region);
                this.mobilegroup.controls['amount'].setValue(recharge_data.recharge_amount);
              }
              else if(this.recharge_cart.recharge_type == 'dth')
              {
                this.dthgroup.controls['recharge_id'].setValue(recharge_data.recharge_id);
                this.dthgroup.controls['operator'].setValue(recharge_data.operator_id);
                this.dthgroup.controls['amount'].setValue(recharge_data.recharge_amount);
              }
              else if(this.recharge_cart.recharge_type == 'datacard')
              {
                this.datacardgroup.controls['recharge_id'].setValue(recharge_data.recharge_id);
                this.datacardgroup.controls['operator'].setValue(recharge_data.operator_id);
                this.datacardgroup.controls['amount'].setValue(recharge_data.recharge_amount);
              }
              else if(this.recharge_cart.recharge_type == 'landline')
              {
                this.landlinegroup.controls['recharge_id'].setValue(recharge_data.recharge_id);
                this.landlinegroup.controls['operator'].setValue(recharge_data.operator_id);
                this.landlinegroup.controls['amount'].setValue(recharge_data.recharge_amount);
              }
              else if(this.recharge_cart.recharge_type == 'broadband')
              {
                this.broadbandgroup.controls['recharge_id'].setValue(recharge_data.recharge_id);
                this.broadbandgroup.controls['operator'].setValue(recharge_data.operator_id);
                this.broadbandgroup.controls['amount'].setValue(recharge_data.recharge_amount);
              }
              else if(this.recharge_cart.recharge_type == 'electricity')
              {
                this.electricitygroup.controls['recharge_id'].setValue(recharge_data.recharge_id);
                this.electricitygroup.controls['operator'].setValue(recharge_data.operator_id);
                this.electricitygroup.controls['amount'].setValue(recharge_data.recharge_amount);
              }
              else if(this.recharge_cart.recharge_type == 'gas')
              {
                this.gasgroup.controls['recharge_id'].setValue(recharge_data.recharge_id);
                this.gasgroup.controls['operator'].setValue(recharge_data.operator_id);
                this.gasgroup.controls['amount'].setValue(recharge_data.recharge_amount);
              }
              else if(this.recharge_cart.recharge_type == 'water')
              {
                this.watergroup.controls['recharge_id'].setValue(recharge_data.recharge_id);
                this.watergroup.controls['operator'].setValue(recharge_data.operator_id);
                this.watergroup.controls['amount'].setValue(recharge_data.recharge_amount);
              }
              
            }
           
            this.selectedOperator = Number(recharge_data.operator_id);
            this.filter_operator_name(recharge_data.operator_id);
            this.filter_circle_name(Number(recharge_data.circle_id));
            if(this.region > 0 && recharge_data.operator_id > 0)
            {
              var operators = this.alloperators.filter(x => x.id == recharge_data.operator_id);
              //console.log(operators)  
              if(this.activity != recharge_data.activity_id)
                this.get_plans(this.region,operators[0].recharge_id);   
            } 
            this.operator_id = operators[0].recharge_id;
            this.activity = recharge_data.activity_id;

        }
      )
  }

  filter_operators(filter_id)
  {
    if( this.alloperators)
    {
      var operators = this.alloperators.filter(x => x.parent_id == filter_id);
      return operators;
    }
    
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
    else if(s == 'cable-tv' && !this.cablegroup.valid)
    {
      Object.keys(this.cablegroup.controls).forEach(field => { // {1}
        const control = this.cablegroup.get(field);            // {2}
        control.markAsTouched({ onlySelf: true });       // {3}
      });
      return;
    }
   // console.log(formdata)
    if(formdata.amount <= 0 || formdata.recharge_id.id <= 0 || formdata.operator <= 0 )
		{
      return false;
    }
    this.spinner.show();	
		this.rechargeData = {token : this.get_token(),recharge_amount: formdata.amount,recharge_id:formdata.recharge_id,operator_id:formdata.operator,circle_id: formdata.circle_area};
    if(!this.authservice.authenticate())
    {
      $('.logup.modal-trigger')[0].click();
      var time = new Date();
      this.rechargeData.recharge_type = s;
      this.rechargeData.time = time.getTime();
      this.addto_recharge_cart(this.rechargeData);
      this.spinner.hide();
      return false;
    }
    
    this.todoservice.recharge_init(this.rechargeData)
		.subscribe(
			data => 
			{
        this.spinner.hide();
        if(data.comm_p)
          this.rechargeData.commission = data.comm_p;
        else
          this.rechargeData.commission = 0; 
        this.rechargeData.operator_api_id = data.recharge_id;
        this.rechargeData.recharge_type = s;
       
			  if(data.status == 'Invalid Token')
			  {
          this.authservice.clear_session();
          return false;
			  //	this.router.navigate(['/login']);
        }
        this.ini_script();
			  if(!$.isEmptyObject(data))
			  {
          if(data.record_exist)
          {
            this.rechargeData.record_exist = data.record_exist
          }
				this.rechargeData.api_img = data.api_img;	
				this.rechargeData.cat_title = data.cat_title;	
				this.rechargeData.recharge_name = data.recharge_name;	
				this.rechargeData.title = data.title;
        this.recharge_ini = 2;
       // console.log(this.rechargeData.recharge_amount)
        if(this.todoservice.get_user_wallet_amount() < this.rechargeData.recharge_amount)
        {
          this.other_to_pay(2);
        }
        //this.router.navigate(['/recharge/'+this.url_name+'/proceed']);				
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
          this.spinner.hide();
          if(data.status == 'Invalid Token')
          {
            this.authservice.clear_session();
            return false;
          }
          if(data.status == "false")
          {
            this.toastr.errorToastr(data.msg);

            return false;
          }
          if(!$.isEmptyObject(data))
          {
            if(typeof data.red_auth != 'undefined' && data.red_auth == 'ptm')
            {
              window.location.href = "https://www.mydthshop.com/web-app/do-paytm/recharge-index.php?pt_t="+data.pt_t+"&order_id="+data.order_id+'&token='+this.get_token()+'&amount='+data.pt_amount;
            }
            else if(typeof data.red_auth != 'undefined' && data.red_auth == 'card')
            {
              window.location.href = "https://www.mydthshop.com/accounts/apis/response/recharge_pay/?order_id="+data.order_id;
            }
          else
          {
            this.router.navigate(['/orders/recharge-receipt/'+data.order_id]);
          } 
          } 
          //this.todoservice.service_url = this.todoservice.server_url+'index.php?/app_services/';
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
    this.copy_promo(this.selected_promo.unique_code);

    if(Number(this.selected_promo.min_pay) > Number(this.rechargeData.recharge_amount))
    {
      $('#response-code').text('This Promocode is applicable for Minimum Amount of Rs. '+this.selected_promo.min_pay);
      return false;
    }
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
  filter_operator(value)
  {
    if(value > 0){
      $('.inner-electricity').removeClass('hide');
      this.electricity_operators = this.filter_operators(61);
      this.electricity_operators = this.electricity_operators.filter(x => x.circle_id == value);
    }
    
  }
check_amount(s)
 {
  let v = $('#'+s+'-form [formcontrolname="recharge_id"]').val();
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
    this.mobilegroup.controls['recharge_id'].setValue(e.target.value);
    //console.log(this.mobilegroup.controls['recharge_id'].value)
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
        this.filterdList = true;
        this.filteredOptions = recharge_data;
        
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
 selected_recharge(recharge_data)
 {
   //console.log(recharge_data)
  this.region  = recharge_data.address_id;
  var decode_data = JSON.parse(recharge_data.order_data);
  this.mobilegroup.controls['recharge_id'].setValue(recharge_data.subcriber_id);
  this.mobilegroup.controls['operator'].setValue(Number(decode_data.operator_id));
  this.selected_operator = decode_data.operator_id;
  this.mobilegroup.controls['circle_area'].setValue(this.region);
  this.mobilegroup.controls['amount'].setValue(recharge_data.grand_total);
  this.selectedOperator = Number(recharge_data.operator_id);
  this.filter_operator_name(recharge_data.operator_id);
  this.filter_circle_name(Number(recharge_data.circle_id));
  if(this.region > 0 && recharge_data.operator_id > 0)
  {
  if(this.activity != recharge_data.activity_id)
    this.get_plans(this.region,decode_data.api_id);
  } 
  this.operator_id = decode_data.api_id;
  this.activity = recharge_data.activity_id;
 }
 
 get_plans(circle,operator)
 {
   //console.log(operator);
  if(this.url_name != 'mobile')
    return true; 
  if(operator == 'get')
   {
    // console.log(this.operator_id)
    operator = this.operator_id;
   }
    
    this.todoservice.get_plans({circle:circle,operator:operator})
		.subscribe(
			data => 
			{
        this.plans = data;
        if(this.plans.length > 0 )
        {
          this.show_tab(2);
          this.print_plan(this.plans[0].records,0);
          
          setTimeout(()=>{    //<<<---    using ()=> syntax
            if($('#list-0 a'))
              $('#list-0 a')[0].click();
       }, 600);
        }
          
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
  let operator = this.alloperators.filter(x => x.id == id);
  if(operator.length == 0)
    return false;
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
