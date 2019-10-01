import { Component, OnInit,ViewChild ,Renderer2,Inject} from '@angular/core';
import {Location} from '@angular/common';
import { FormBuilder, Validators, FormGroup,FormControl } from '@angular/forms'; 
import { DOCUMENT,Meta,Title } from "@angular/platform-browser";
import { TodoService } from '../todo.service';
import { AuthService } from '../auth.service';
import { Params } from '../shared/config/params.service';
import { Observable} from 'rxjs';
import { map, startWith} from 'rxjs/operators';
import { Router ,ActivatedRoute} from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Package } from '../packages.entities.service';
import * as $ from 'jquery';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles : []
})

export class HomeComponent implements OnInit {
  myControl = new FormControl();
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
  public op_list = '';
  public recharge_ini : number = 1;
  public deal_timer : number = 0;
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
  user_cashback : any ;
  region :number = 0;
  activity : number = 0;
  options: any = [{ title: 'One',id:1},{title:  'Two',id:2},{title: 'Three',id:3}];
  filteredOptions: Observable<object>;
  filterdList : boolean = false;
  constructor(
    private _renderer2: Renderer2, 
     @Inject(DOCUMENT) private _document, 
     public todoservice : TodoService,
     private authservice : AuthService,
     private router : Router,
     private  meta : Meta,
     private title : Title, 
     private fb: FormBuilder,
     private spinner: NgxSpinnerService,
     public params : Params,
     private location : Location,
     private route : ActivatedRoute
  ) {
    if(!this.get_token())
    {
      this.authservice.clear_session();
    }
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
   back_to_recharge()
   {
     this.recharge_ini = 1;
     setTimeout(()=>{    
      $('#mobile').css('display','');  
      $('#select-item').css('display',''); 
     this.ini_list(); 
     }, 500);
     
   }
   changeCircle(id)
   {
    this.filter_circle_name(id);
   }
   next_to(s,control,e)
   {
     if(s == 'mobile')
     {
      if( this.check_if_not_digits(e))
      {
        this.mobilegroup.controls['recharge_id'].setValue(e.target.value.replace(/\D/g,''));
      }
       this.rechargeId = e.target.value;
      let recharge_id = String(this.rechargeId);  
      if(recharge_id.length <= 2)
        return false;
      this.todoservice.check_if_recharge_exist({recharge_id: recharge_id})
      .subscribe(
        data => 
        {
          let recharge_data = data.RECHARGEID;
          this.region = Number(recharge_data.circle_id);
          if(!$.isEmptyObject(recharge_data))
          {
            this.filterdList = true;
            this.filteredOptions = recharge_data;
            this.mobilegroup.controls['operator'].setValue(recharge_data.operator_id);
            this.mobilegroup.controls['circle_area'].setValue(Number(recharge_data.circle_id));
            this.selectedOperator = recharge_data.operator_id;
            this.filter_operator_name(recharge_data.operator_id);
            this.filter_circle_name(Number(recharge_data.circle_id));
            var url = '';
          
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
   
   circle_selected(circle_id)
   {
    this.todoservice.get_operator_api_id({operator_id: this.selectedOperator})
    .subscribe(
      data => 
      {
        if(!$.isEmptyObject(data))
        {
          var recharge_data :any = {circle_id : circle_id,operator_id : this.selectedOperator , operator_api_id: data.OPERATOR[0].recharge_id,recharge_id: this.rechargeId,title :  'mobile'};
          this.navigate_to(recharge_data);
        }
        this.spinner.hide();
      }
    )  
    
   }

   navigate_to(recharge_data)
   {
      var url ='';
      if(recharge_data.title.toLowerCase() == 'mobile')
      {
        url = 'mobile';
      }
      else if(recharge_data.title.toLowerCase() == 'dth-recharge')
      {
        url = 'dth-recharge';
      }
      else if(recharge_data.title.toLowerCase() == 'electricity')
      {
        url = 'electricity';
      }
      else if(recharge_data.title.toLowerCase() == 'water')
      {
        url = 'water';
      }
      else if(recharge_data.title.toLowerCase() == 'gas')
      {
        url = 'gas';
      }
      else if(recharge_data.title.toLowerCase() == 'broadband')
      {
        url = 'broadband';
      }
      else if(recharge_data.title.toLowerCase() == 'cable')
      {
        url = 'cable';
      }
      else if(recharge_data.title.toLowerCase() == 'datacard')
      {
        url = 'datacard';
      }
      else if(recharge_data.title.toLowerCase() == 'landline')
      {
        url = 'landline';
      }
      this.todoservice.set_recharge('recharge_cart',recharge_data);
      this.router.navigate(['/recharge/'+url]);
   } 
   
  onTap(url)
  {
    this.router.navigate([url]);
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
  other_to_pay(paystep)
  {
    this.pay_step = paystep;
  }
  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    ); 
    if(this.router.url == '/home#login' || this.router.url == '/home%23login')
    {
      setTimeout(()=>{    //<<<---    using ()=> syntax
        this.authservice.authenticate();
   }, 4000);
    }
    this.mobilegroup = this.fb.group({
      'amount' : [null,Validators.compose([Validators.required])],
       'operator' : [null,Validators.compose([Validators.required])],
       'recharge_id' : [null,Validators.compose([Validators.required])],
       'circle_area' : [null,Validators.compose([Validators.required])]
     });
     this.dthgroup = this.fb.group({
       'amount' : [null,Validators.compose([Validators.required])],
        'operator' : [null,Validators.compose([Validators.required])],
        'recharge_id' : [null,Validators.compose([Validators.required])]
      });
      this.datacardgroup = this.fb.group({
       'amount' : [null,Validators.compose([Validators.required])],
        'operator' : [null,Validators.compose([Validators.required])],
        'recharge_id' : [null,Validators.compose([Validators.required])]
      });
      this.landlinegroup = this.fb.group({
       'amount' : [null,Validators.compose([Validators.required])],
        'operator' : [null,Validators.compose([Validators.required])],
        'recharge_id' : [null,Validators.compose([Validators.required])]
      });
      this.broadbandgroup = this.fb.group({
       'amount' : [null,Validators.compose([Validators.required])],
        'operator' : [null,Validators.compose([Validators.required])],
        'recharge_id' : [null,Validators.compose([Validators.required])]
      });
      this.electricitygroup = this.fb.group({
       'amount' : [null,Validators.compose([Validators.required])],
        'operator' : [null,Validators.compose([Validators.required])],
        'recharge_id' : [null,Validators.compose([Validators.required])]
      });
      this.gasgroup = this.fb.group({
       'amount' : [null,Validators.compose([Validators.required])],
        'operator' : [null,Validators.compose([Validators.required])],
        'recharge_id' : [null,Validators.compose([Validators.required])]
      });
      this.watergroup = this.fb.group({
       'amount' : [null,Validators.compose([Validators.required])],
        'operator' : [null,Validators.compose([Validators.required])],
        'recharge_id' : [null,Validators.compose([Validators.required])]
      }); 
  this.spinner.show();  
	this.fetch_operators();
  this.fetch_home_data();
  if(!this.get_token())
  {
    this.todoservice.set_user_data({name:''});
  } 
   
    $('#search').focus(function(){
      $('.search-result').removeClass('hide');
    });
    $('#search').focusout(function(){
      $('.search-result').addClass('hide');
    });
  }
  private _filter(value: string): object {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.title.toLowerCase().indexOf(filterValue) === 0);
  }
  fetch_home_data()
  {   
      let data = {};
      if(this.get_token())
      {
        data = {token : this.get_token()};
      }
      
      this.todoservice.fetch_home_data(data)
      .subscribe(
        data => 
        {
          // data =  JSON.parse(data.replace(/"/g, "'"));
          // let b = JSON.stringify(data);
          // data =  JSON.parse(b.replace(/\\/g, ''));
          if(!$.isEmptyObject(data))
          {
            let page_data = data.PAGEDATA[0] 
            if(page_data)
            {
              this.meta.addTag({ name: 'description', content: page_data.metaDesc });
              this.meta.addTag({ name: 'keywords', content: page_data.metaKeyword });
              this.title.setTitle(page_data.metaTitle);
            }
            this.user_cashback = data.cashback;
            this.banners          = data.banners;
            this.tata_slides      = this.filter_product('tata',data.products); 
            this.airtel_slides    = this.filter_product('airtel',data.products);  
            this.dishtv_slides    = this.filter_product('dish',data.products);  
            this.videcone_slides  = this.filter_product('videocon',data.products); 
            
            this.init_page();
            $('#mobile').css('display','');  
            $('#select-item').css('display',''); 
            //this.tick_deal_timer();
            this.filter_banners('Big Tv');
          }
          this.spinner.hide();
        }
      )  
  }

  check_cashback(product_id)
  {
    //console.log(product_id);
    //console.log(this.user_cashback);
    if(!this.user_cashback)
      return true;
    let exist = this.user_cashback.filter(x => x.services_id == product_id);
    if(exist.length > 0 )
    {
      return exist;
    }
    return false;
  }

  filter_product(key,categories)
  {
    let temp :any = [];
    let new_slides = [];
    for(var i=0;i<categories.length ;i++)
    {
        temp = categories[i];
        let startIndex = temp.title.toLowerCase().indexOf(key.toLowerCase());
        if (startIndex != -1) {
          new_slides.push(categories[i]); 
        }
    }
    return new_slides;
  }

  filter_products(slider_data)
  {
    let temp :any = [];
    let new_slides = [];
    for(var i=0;i<slider_data.length ;i++)
    {
        temp = slider_data[i];
        if(new_slides.length > 0)
        {
          let exist_id = new_slides.filter(x => x.id == temp.id);
          if(exist_id.length > 0)
          {
            continue;
          }
        }
        if(temp.user_id)
        {
          let slide = slider_data.filter(x => x.user_id == this.todoservice.get_user_id());
          if(slide.length > 0)
          {
            new_slides.push(slide);  
          }
          else
          {
            new_slides.push(slider_data[i]);
          }
        }
        else
        {
          new_slides.push(slider_data[i]);
        }
        
        
    }
    return new_slides;
  }

  
  filter_banners(position,from = 0,limit = 0)
  {
    let banner: any = [];
    let ln = limit;
    if(limit == 0)
    {
      ln =  this.banners.length
    }
   
    for(var i = from; i < this.banners.length ;i++)
    {
        if(this.banners[i].position == position)
        {   
            banner.push(this.banners[i]);
        }
        if(banner.length == ln)
        {
          break;
        }
    }
    return banner;
  }
  get_package_of_product(id)
  {
    this.product_mpackages = [];
    for(var i=0;i<this.packages.length ;i++)
    {
        if(this.packages[i].product_id == id)
        {   
            this.product_mpackages.push(this.packages[i]);
            //this.packages.splice(i, 1);
        }
    }
    //console.log(this.packages)
    return this.product_mpackages;
  }
toTimestamp(strDate){
 var datum = Date.parse(strDate);
 return datum/1000;
}
  // tick_deal_timer()
  // {
  //   if(this.deal_timer <= 0)
  //   {
  //     $('#flash-deal-section').hide();
  //     return false;
  //   }
  //   let sec0bj = this.secondsToTime(this.deal_timer);
  //   setTimeout(() => {
  //     this.tick_deal_timer(); 
  //   }, 1000);
  //   //let timer = sec0bj.days + '' +sec0bj.hours +''+sec0bj.minutes + ' '+sec0bj.seconds+'';
  //   if(sec0bj.days < 10)
  //     $('#tiles .days').text('0'+sec0bj.days); 
  //   else
  //     $('#tiles .days').text(sec0bj.days);
    
  //   if(sec0bj.hours < 10)
  //     $('#tiles .hours').text('0'+sec0bj.hours); 
  //   else
  //     $('#tiles .hours').text(sec0bj.hours);

  //   if(sec0bj.minutes < 10)
  //     $('#tiles .mins').text('0'+sec0bj.minutes); 
  //   else
  //     $('#tiles .mins').text(sec0bj.minutes);
  //   if(sec0bj.seconds < 10)
  //     $('#tiles .seconds').text('0'+sec0bj.seconds); 
  //   else
  //     $('#tiles .seconds').text(sec0bj.seconds);     
  //   this.deal_timer = this.deal_timer - 1;
  // } 
  
  secondsToTime(mseconds)
  {
    var difference_ms = mseconds * 1000;
    //take out milliseconds
    difference_ms = difference_ms/1000;
    var seconds = Math.floor(difference_ms % 60);
    difference_ms = difference_ms/60; 
    var minutes = Math.floor(difference_ms % 60);
    difference_ms = difference_ms/60; 
    var hours = Math.floor(difference_ms % 24);  
    var days = Math.floor(difference_ms/24);
    
    return { days : days , hours : hours, minutes : minutes, seconds : seconds };
  }

	fetch_operators()
	{
	    let data = {token : ''};
      this.todoservice.fetch_operators(data)
      .subscribe(
        data => 
        {
          this.operators = data.OPERATORS;
          this.circles = data.CIRCLES;
          if(!$.isEmptyObject(this.operators))
          {
            this.ini_list();
            this.loop = true;	
          }
          this.spinner.hide();
        }
      )  
	}
  init_page() 
  {
    if($('#init-page-script'))
    {
      $('#init-page-script').remove();
    }
    let script = this._renderer2.createElement('script');
    script.type = `text/javascript`;
    script.id = `init-page-script`;
    script.text = `
      $(document).ready(function(){ $('[href="#mobile"]').click();
        $('.slider-5').lightSlider({
          item: 4,
          auto: false,
          loop: false,
          pause: 3000,
          controls: true,
          pager: false,
          responsive: [
          {
            breakpoint:900,
            settings: {
              item:3
            }
          },
          {
            breakpoint:600,
            settings: {
              item:1
            }
          },
          {
            breakpoint:380,
            settings: {
              item:1
            }
          }
          ]
        });
        $('.slider-66').lightSlider({
          item: 4,
          auto: false,
          loop: false,
          pause: 3000,
          controls: true,
          pager: false,
          responsive: [
          {
            breakpoint:900,
            settings: {
              item:3
            }
          },
          {
            breakpoint:600,
            settings: {
              item:1
            }
          },
          {
            breakpoint:380,
            settings: {
              item:1
            }
          }
          ]
        });
        $('.slider-7').lightSlider({
          item: 4,
          auto: false,
          loop: false,
          controls: true,
          pager: false,
          responsive: [
          {
            breakpoint:900,
            settings: {
              item:3
            }
          },
          {
            breakpoint:600,
            settings: {
              item:1
            }
          },
          {
            breakpoint:380,
            settings: {
              item:1
            }
          }
          ]
        });
        $('.slider-8').lightSlider({
          item: 4,
          auto: false,
          loop: false,
          controls: true,
          pager: false,
          responsive: [
          {
            breakpoint:900,
            settings: {
              item:3
            }
          },
          {
            breakpoint:600,
            settings: {
              item:1
            }
          },
          {
            breakpoint:380,
            settings: {
              item:1
            }
          }
          ]
        });
      })
        
        $(document).on("click",".recharge-section",function($event) {
          var x = $event.target.nodeName;
          if(!$(x).hasClass("more-clik"))
            $('.dropdown-more').hide();
        });
        $('.tooltipped').tooltip({delay: 50});
        $('.modal').modal();
        var flashdeal = $('.flash-deal-slider').lightSlider({
          item: 1,
          auto: true,
          pauseOnHover: true,
          loop: true,
          pause: 5000,
          keyPress: true,
          controls: true,
          pager: false,
          enableDrag: true,
          responsive: [
          {
            breakpoint:900,
            settings: {
              item:1	
            }
          },
          {
            breakpoint:600,
            settings: {
              item:1
            }
          },
          {
            breakpoint:380,
            settings: {
              item:1
            }
          }, 
         
          ],
          onBeforeSlide: function (el) {
            $('#select-slide li a').removeClass('active');
            $('#select-slide li:nth-child('+(el.getCurrentSlideCount()+1)+') a').addClass('active');
            
        }
        });
        $('#select-slide').delegate('li','click',function(){
          var child = $(this).find('.data-slide').text();
          flashdeal.goToSlide(Number(child));
        });
        
        $('.retailer-slider').lightSlider({
          item: 1,
          auto: true,
          pauseOnHover: true,
          loop: true,
          pause: 5000,
          keyPress: true,
          controls: true,
          pager: false,
          enableDrag: true,
          responsive: [
          {
            breakpoint:900,
            settings: {
              item:1
            }
          },
          {
            breakpoint:600,
            settings: {
              item:1
            }
          },
          {
            breakpoint:380,
            settings: {
              item:1
            }
          }
          ]
        });
             
      // Hide sideNav
      $('.button-collapse1').on('click', function () {
        $('.side-nav').sideNav('hide');
      });
    
      $('.modal-close').on('click', function(){
       $('.modal').modal('close');
      });
    `;
    this._renderer2.appendChild(this._document.body, script);
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
    $('.tabs').tabs();

    $(document).ready(function(){
    $('.dropdown-more-click').click(function(){
      $('.dropdown-more').toggle();
    });
    $(".dropdown-more").delegate('li','click',function(e){
      e.preventDefault();
      var targetli = $('#select-item > li:nth-child(9)').html();
      $('#select-item > li:nth-child(9)').html(this.innerHTML);
      this.innerHTML = targetli;
      $('#select-item > li:nth-child(9) a')[0].click();
      $('.dropdown-more-click').click()
    }); 
    });
    
    `;
    this._renderer2.appendChild(this._document.body, script);
  }
  changeOperator(data,s)
  {
    this.viewrange = 1;
    this.selectedOperator = data;
    if(s == 'mobile')
    {
      this.filter_operator_name(data);
      this.mobilegroup.controls['circle_area'].setValue('');
      this.mcircle.open();
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
    }
    else if(s == 'landline')
    {
      this.showstd = 1;
    }
    else if(s == 'broadband')
    {
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
    }
  }
  recharge_init(s,formdata)
  {
    let circle = 0;
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
    if(formdata.circle_id)
      circle = formdata.circle_id
    this.spinner.show();	
		this.rechargeData = {token : this.get_token(),recharge_amount: formdata.amount,recharge_id:formdata.recharge_id,operator_id:formdata.operator,circle_id: formdata.circle_area};
    this.todoservice.recharge_init(this.rechargeData)
		.subscribe(
			data => 
			{
        this.spinner.hide();
        this.rechargeData.operator_api_id = data.recharge_id;
        this.todoservice.set_recharge('recharge_cart',this.rechargeData);
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
 
 continue_back()
 {
	 this.router.navigate(['/home']);
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
  get_token()
  {
    return this.authservice.auth_token();
  }

  
}
