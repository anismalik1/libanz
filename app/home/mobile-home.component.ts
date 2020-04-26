import { Component, OnInit,ViewChild ,Renderer2,Inject} from '@angular/core';
import {Location} from '@angular/common';
import { FormBuilder, Validators, FormGroup,FormControl } from '@angular/forms'; 
import { ToastrManager } from 'ng6-toastr-notifications';
import {Meta,Title } from "@angular/platform-browser";
import { DOCUMENT} from "@angular/common";
import { TodoService } from '../todo.service';
import { AuthService } from '../auth.service';
import { Params } from '../shared/config/params.service';
import { Observable} from 'rxjs';
import { map, startWith} from 'rxjs/operators';
import { Router ,ActivatedRoute} from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Package } from '../packages.entities.service';
@Component({
  selector: 'app-mobile-home',
  templateUrl: './mobile-home.component.html',
  styles: []
})
export class MobileHomeComponent implements OnInit {
  public userinfo = {wallet:'',phone:'',name:''};
  public operators : any = {};
  public loop : boolean = false;
  public selectedOperator : number ;
  public rechargeAmount : number ;
  public rechargeId : number ;
  public op_list = '';
  public recharge_ini : number = 1;
  public deal_timer : number = 0;
  public mainbanners : any = [{image: "dth-recharge-banner_1.png",imageurl: "https://www.mydthshop.com/recharge/for/dth-recharge",position: "mobile-main-banner"}];
  public bottombanners : any = [{image: "rechargebill-11.jpg",imageurl: "",position: "mobile_bottom_banner"}];
  no_dues = 0;
  bill_amt : number;
  due_msg : string = 'No pending dues.';
  rechargeData : any ;
  flash_deals : any;
  all_products : any;
  product_ratings : any = [];
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
  banners : any = [];
  order : any = {};
  recommended : any;
  package_item : Package;
  packages : Package[];
  product_mpackages : Package[];
  user_cashback : any ;
  region :number = 0;
  activity : number = 0;
  options: any = [{ title: 'One',id:1},{title:  'Two',id:2},{title: 'Three',id:3}];
  filteredOptions: Observable<object>;
  filterdList : boolean = false;
  ratings : any;
  constructor(
    private _renderer2: Renderer2, 
     @Inject(DOCUMENT) private _document, 
     public todoservice : TodoService,
     private authservice : AuthService,
     private router : Router,
     private  meta : Meta,
     private title : Title, 
     private toastr : ToastrManager,
     private fb: FormBuilder,
     private spinner: NgxSpinnerService,
     public params : Params,
     private location : Location,
     private route : ActivatedRoute
  ) {
    this.spinner.hide();
   }

  ngOnInit() {
    if(this.router.url == '/home#login' || this.router.url == '/home%23login')
    {
      setTimeout(()=>{    //<<<---    using ()=> syntax
        this.authservice.authenticate();
    }, 4000);
    }  
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
    
    if(document.URL.indexOf('https://') === -1)
    {
      setTimeout(()=>{    //<<<---    using ()=> syntax
        this.open_model()
      }, 4000);
    }
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
      //this.spinner.show();
      this.todoservice.fetch_home_data(data)
      .subscribe(
        data => 
        {
          if(!$.isEmptyObject(data))
          {
            let page_data = data.PAGEDATA[0];
            
            if(page_data)
            {
              this.meta.addTag({ name: 'description', content: page_data.metaDesc });
              this.meta.addTag({ name: 'keywords', content: page_data.metaKeyword });
              this.title.setTitle(page_data.metaTitle);
            }
            
            this.banners  = data.banners;
            this.mainbanners =  this.filter_banners('mobile-main-banner',0, 0);
            this.bottombanners = this.filter_banners('mobile_bottom_banner',0, 0);
            setTimeout(()=>{   
              this.make_slider();
            }, 200);
            setTimeout(()=>{   
              this.bottom_slider()
            }, 1000);
            
            this.init_page();
            this.fetch_home_products(); 
            $('#mobile').css('display','');  
            $('#select-item').css('display',''); 
            //this.filter_banners('Big Tv');
            this.spinner.hide();
          }
        }
      )  
  }


  init_products()
  {
    if($('#init-product-script'))
    {
      $('#init-product-script').remove();
    }
    let script = this._renderer2.createElement('script');
    script.type = `text/javascript`;
    script.id = `init-product-script`;
    script.text = `
      $(document).ready(function(){
        var product = $('.product-slider').lightSlider({
          item: 1,
          auto: false,
          pauseOnHover: true,
          loop: true,
          pause: 5000,
          keyPress: true,
          controls: true,
          pager: false,
          enableDrag: true
        });
      });
      $('select').material_select(); 

    `;
    this._renderer2.appendChild(this._document.body, script);
  }

  open_model()
  {
    if($('#init-open_model-script'))
    {
      $('#init-open_model-script').remove();
    }
    let script = this._renderer2.createElement('script');
    script.type = `text/javascript`;
    script.id = `init-open_model-script`;
    script.text = `
      $(document).ready(function(){
        $('.modal').modal();
        $('#modal-app').modal('open');
      }); 
    `;
    this._renderer2.appendChild(this._document.body, script);
  }

  fetch_home_products()
  {
    this.todoservice.fetch_home_products({token : this.get_token()})
    .subscribe(
    data => 
    {
      this.ratings          = data.rating; 
      this.user_cashback    = data.cashback;
      this.all_products     = data.products;
      this.calculate_ratings();
      this.tata_slides      = this.filter_product('tata',data.products); 
      this.airtel_slides    = this.filter_product('airtel',data.products);  
      this.dishtv_slides    = this.filter_product('dish',data.products);  
      this.videcone_slides  = this.filter_product('videocon',data.products); 
      this.recommended      = this.filter_recommended(data.products); 
      this.init_products();
    }
    ) 
  }

  check_if_favorite(product_id)
  {
    if(localStorage.getItem('favourite') == null)
    {
      return false;
    }
    let products = JSON.parse(localStorage.getItem('favourite'));
    var exist = products.items.filter(product => product.prod_id == product_id);
   
    if(exist.length > 0)
      return 'orange-text';  
    return ''; 
  }
  add_to_favorite(product)
  {

    $('.wishlist').addClass('active');

    if(!this.get_token())
    {
      $('.logup.modal-trigger')[0].click();
      this.toastr.errorToastr("Please Login to proceed", 'Failed! ');
      return false;
    }

    this.spinner.show() 
    this.todoservice.add_to_favorite({product : product,token : this.get_token()})
    .subscribe(
    data => 
    {
      this.spinner.hide();
      this.toastr.successToastr(data.msg);
      if(data.status == true)
        localStorage.setItem('favourite', JSON.stringify(data.favourites));
    }
    ) 
  }

  product_rating(product_id)
  {
    let rate = this.product_ratings.filter(x => x.id == product_id);
    //console.log(rate)
    return rate;  
  }

  calculate_ratings()
  {
    let j : any = 0;
    let rate : any = 0;
    //console.log(this.ratings);
    for(var i = 0;i < this.all_products.length;i++)
    {
      for(var k = 0;k < this.ratings.length;k++)
      {
        if(this.all_products[i].id == this.ratings[k].product_id)
        {
          rate = Number(rate) + Number(this.ratings[k].reting);
          j = Number(j) + 1;
        }
      }
      if(j == 0)
        j = 1;
      let rating = (rate/j);
      if(rating == 0)
        var prate =  '0';
      else
        var prate = rating.toFixed(1);
      this.product_ratings.push({id : this.all_products[i].id,rate : prate, rate_count : j});
    }  
    //console.log(this.product_ratings);
  }
  
  filter_recommended(categories)
  {
    let slide = categories.filter(x => x.recommended == 1);
    slide = slide.slice(0,8)
    return slide;
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
        $(document).on("click",".recharge-section",function($event) {
          var x = $event.target.nodeName;
          if(!$(x).hasClass("more-clik"))
            $('.dropdown-more').hide();
        });
        $('.tooltipped').tooltip({delay: 50});
        $('.modal').modal();
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

  make_slider()
  {
    if($('#slider-script'))
    {
      $('#slider-script').remove();
    }
    let script = this._renderer2.createElement('script');
    script.type = `text/javascript`;
    script.id = `slider-script`; 
    script.text = `
    $(document).ready(function(){
      $('.mobile-slider').lightSlider({
        item: 1,
        auto: true,
        slideMove: 1,
        loop: true,
        pause: 5000,
        speed : 1200,
        controls: false,
        keyPress: false,
        enableDrag: true,
        pager: true,
        gallery: false,
        galleryMargin: 5,
        thumbMargin: 5,
        currentPagerPosition: 'middle',
        responsive : [],
        onSliderLoad : function()
        {
          $('.mobile-slider li').css('display','block');
        }
      });
    })
      `;
    this._renderer2.appendChild(this._document.body, script);
  }

  bottom_slider()
  {
    if($('#bottom-slider-script'))
    {
      $('#bottom-slider-script').remove();
    }
    let script = this._renderer2.createElement('script');
    script.type = `text/javascript`;
    script.id = `bottom-slider-script`; 
    script.text = `
    $(document).ready(function(){
      $('#bottom-slider').lightSlider({
        item: 1,
        speed : 1200,
        pause : 5000,
        loop:true,
        auto: true,
        controls: false,
        keyPress: false,
        enableDrag: true,
        pager: true,
        gallery: false,
        galleryMargin: 5,
        thumbMargin: 5,
        currentPagerPosition: 'middle',
    });
    })
      `;
    this._renderer2.appendChild(this._document.body, script);
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

  get_token()
  {
    return this.authservice.auth_token();
  }
}
