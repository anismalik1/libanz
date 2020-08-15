import { Component, OnInit,ViewContainerRef ,Renderer2,Inject} from '@angular/core';
import { Meta,Title } from "@angular/platform-browser";
import { DOCUMENT} from "@angular/common";
import {  FormControl } from '@angular/forms'
import { TodoService } from '../todo.service';
import { AuthService } from '../auth.service';
import { Router,ActivatedRoute } from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable} from 'rxjs';
import { Product } from '../product.entities';
import { ProductService } from '../product.service';
import { Package } from '../packages.entities.service';
import * as $ from 'jquery'; 

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styles: []
})
export class ProductDetailsComponent implements OnInit{
  fta_price : number;
  hide : boolean = true;
  region : any;
  fta_title : string;
  pack_selected : any = [];
  fta_pack : any = {};
  all_packs : any = [];
  channels_packs : any;
  multi_list : any;
  multi_tsk_kit : number = 2;
  circles : any;
  pincode : any;
  channels : any;
  product_category_list : any;
  product_features : any;
  product_list : any;
  multienable : boolean = false;
  display : number = 0;
  p_id : any;
  pack_id : Number;
  cat_id : any;
  channel_display = 0;
  product : Product;
  reviews : any;
  rev_count : number;
  product_id : any;
  rating : number = 0;
  rate_data : any;
  package_month : any;
  review_start = 0;
  more_display : boolean = true;
  avg_rating : DoubleRange;
  all_rating : number;
  grouped_rating : any;
  month : number = 1;
  kit : number;
  otf_margin : boolean = false;
  monthdata : any;
  packages : Package[];
  product_mpackages : Package[];
  promos : any;
  thumbs : any;
  filterdList : boolean = false;
  recommended : any;
  myControl = new FormControl();
  options: any ;
  filteredOptions: Observable<object>;
  constructor(
    private _renderer2: Renderer2, 
    @Inject(DOCUMENT) private _document, 
    private spinner : NgxSpinnerService,
    private title: Title,
    private meta : Meta,
    private vcr: ViewContainerRef,
    private toastr: ToastrManager,
    public todoservice : TodoService,
    private authservice : AuthService,
    public productservice : ProductService,
    private router : ActivatedRoute, private route : Router ) {
    this.product_categories();
    //this.init_overlay();
   }

  ngOnInit() {
    var width = $(window).width(); 
    if(width < 767)
    {
      let uri = this.route.url.replace('product','product/amp');
      if(this.todoservice.get_param('month'))
      {
        this.month = Number(this.todoservice.get_param('month'));
        this.route.navigate([uri.split("?")[0]],{queryParams: {month: this.month}});
        return false;
      }   
      this.route.navigate([uri]);
      return false;
    }
    this.cat_id = this.todoservice.get_param('cat_id');
    this.pack_id = Number(this.todoservice.get_param('id'));
    if(this.todoservice.get_param('month'))
      this.month = Number(this.todoservice.get_param('month'));
    
    this.router.params.subscribe(params => { 
      this.p_id = params['name']; //log the value of id
      this.fetch_product_data(this.p_id,this.cat_id);
    });
    
    $('body').delegate('#stars li','mouseover', function(){
      var onStar = parseInt($(this).data('value'), 10); // The star currently mouse on
     
      // Now highlight all the stars that's not after the current hovered star
      $(this).parent().children('li.star').each(function(e){
        if (e < onStar) {
          $(this).addClass('hover');
        }
        else {
          $(this).removeClass('hover');
        }
      });
      
    }).on('mouseout', function(){
      $(this).parent().children('li.star').each(function(e){
        $(this).removeClass('hover');
      });
    });
    $('body').delegate('#stars li','click', function(){
      var onStar = parseInt($(this).data('value'), 10); // The star currently selected
      var stars = $(this).parent().children('li.star');
      
      for (var i = 0; i < stars.length; i++) {
        $(stars[i]).removeClass('selected');
      }
      
      for (i = 0; i < onStar; i++) {
        $(stars[i]).addClass('selected');
      }
      
      // JUST RESPONSE (Not needed)
      var ratingValue = parseInt($('#stars li.selected').last().data('value'), 10);
      var msg = "";
      if (ratingValue > 1) {
          msg = "Thanks! You rated this " + ratingValue + " stars.";
      }
      else {
          msg = "We will improve ourselves. You rated this " + ratingValue + " stars.";
      }
      $('.text-message').text(msg);
    });
    setTimeout(()=>{    
      if(this.pack_selected[0])
        $('#collapse-header-'+this.pack_selected[0].parent_id).click();
     }, 2000);
    if(this.get_token())
    {
      if(this.todoservice.get_user_product_amount() > 0)
      {
        this.fetch_options()
      }
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

  check_child_exist(id,childs)
  {
    for(var i = 0;i<childs.length;i++)
    {
      if(childs[i].id == id)
        return true;
    }
    return false;
  }
  tick_multi()
  {
    if($("#multi-enable").is(':checked'))
    {
      this.multienable = true;
      this.route.navigate(['/product/'+this.p_id+'/multi'])
    }
    else
    {
      this.multienable = false;
      this.route.navigate(['/product/'+this.p_id])
    }
  }
  track_record()
  {
    let data : any = { id : this.product_id}
    this.todoservice.track_record(data)
    .subscribe(
			data => 
			{
        this.spinner.hide();
        //this.fetch_product_data(this.p_id,this.cat_id);
      }
		  ) 
  }

  continue_to_change(url)
  {
    this.kit = 0;
    this.multienable = false;
    this.route.navigateByUrl('/product/'+url);
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
    return this.product_mpackages;
  }

  fetch_review_data()
  {
    this.spinner.show();
    if(!this.get_token())
    {
      $('.logup.modal-trigger')[0].click();
      this.rating = 0;
      this.toastr.errorToastr("Please Login to rate this product", 'Failed! ');
      this.spinner.hide();
      return false;
    }
    let data : any = {token : this.get_token(),product_id : this.product_id};
    this.todoservice.fetch_review_data(data)
		  .subscribe(
			data => 
			{
        this.spinner.hide();
        if(data.status == true)
        {
          this.rating = 1;
          this.rate_data = data.rated;
        }
      }
		  ) 
  }

  review_submit(form,rating)
  {
    var ratingValue = parseInt($('#stars li.selected').last().data('value'), 10);
    if(rating > 0)
    {
      ratingValue = rating;
    }

    if(ratingValue == null || ratingValue == NaN)
    {
      this.toastr.errorToastr("Please Select Rating.", 'Failed! ');
      this.spinner.hide();
      return false;
    }
    this.spinner.show();
    form.token = this.get_token();
    if(form.token == '' || form.token == null)
    {
      this.toastr.errorToastr("Please Login to rate this product.", 'Failed! ');
      this.spinner.hide();
      return false;
    }
    form.rating = ratingValue;
    form.product_id = this.product_id;
    if(!$.isEmptyObject(this.rate_data))
		{
      form.review_update = 1;
      form.id = this.rate_data.id;
    }
    form.review_start = this.review_start;  
		 this.todoservice.add_product_review(form) 
		  .subscribe(
			data => 
			{
        this.spinner.hide();
        this.reviews      = data.REVIEW;
        this.more_display = data.more_enable;
        this.rev_count    = data.ALL_REVIEW_COUNT;
        this.avg_rating   = data.ALL_AVG_RATING;
        this.all_rating   = data.ALL_RATING;
        this.grouped_rating = data.GROUPED_RATING;
      }
		  ) 
  }


  fetch_product_data(p_id,cat_id) 
	{
    this.channel_display = 0; 
      this.spinner.show();
		  let data : any = {token : this.get_token(),product_id: p_id,cat_id:cat_id,month:this.month};
      if( this.region_selected())
      {
        data.region = this.region_selected();
      }
      this.productservice.fetch_product_data(data)
		  .subscribe(
			data => 
			{
        data.PRODUCTDATA.channel_packages = data.PRODUCTDATA.channel_packages.replace(/"/g, '\'');
        this.product_features = data.specification;
        this.spinner.hide();
        let b = this.htmlToPlaintext(JSON.stringify(data));
        this.channels_packs = data.package;
        this.fta_pack = {};
        this.product = data.PRODUCTDATA;
        if (this.product.multi == 1) 
        {  
            this.multienable = true;
        }
        this.recommended = data.RECOMMENDED;
        this.recommended_slider();
        this.filter_channel_subpack();
        let cashback_data : any;
        if(data.cashback && data.cashback.length > 0 )
        {
          let user_cashback = this.check_cashback(data.cashback);
          //console.log(user_cashback);
          this.product.partnerwalletamount = user_cashback[0].amount;
        }
        else
        {
          //console.log('no cashback')
          if(this.todoservice.get_user_type() == 2)
          {
            this.product.partnerwalletamount = data.PRODUCTDATA.partner_cashback_wallet;
          }
          else
          {
            this.product.partnerwalletamount = data.PRODUCTDATA.user_cashback_wallet;
          }
        }
        this.product.cashback_data = cashback_data;
        this.circles = data.circles;
        if(data.PROMOS && data.PROMOS.length > 0)
        {
          this.promos = data.PROMOS[0];
          this.product.promos = this.promos;
        }
        if(this.circles)
        {
          if(!this.productservice.get_region())
          {
            setTimeout(()=>{    //<<<---    using ()=> syntax
              $('.religon-overlay').show();
            }, 2000);
          }
          else
          {
            this.region = this.productservice.get_region(); 
          }
        }

          
        this.thumbs = data.THUMBS;
        this.fta_title = data.fta_title;
        this.fta_price = data.fta_price;
        if(this.product.category_id == 1)
        {
          this.kit = 2;
          this.product.tsk_kit = 2;
        }
        this.product_id = this.product.id;
        this.meta.addTag({  property: 'og:title', content: this.product.meta_title });
        this.meta.addTag({ name: 'description', content: this.product.meta_description });
        this.meta.addTag({ name: 'keywords', content: this.product.meta_keyword });
        this.title.setTitle(this.product.meta_title + " With "+this.month+ ' Month Pack');
        this.productservice.setItem(this.product);
        //this.recommended  = this.filter_products(data.RECOMMENDED);
        this.reviews      = data.REVIEW;
        this.more_display = data.more_enable;
        this.rev_count    = data.ALL_REVIEW_COUNT;
        this.avg_rating   = data.ALL_AVG_RATING;
        this.all_rating   = data.ALL_RATING;
        this.grouped_rating = data.GROUPED_RATING;
        this.packages     = data.product_packages; 
        this.display      = 1;
        setTimeout(()=>{    
          $('#product-description').html(this.product.description);
          $('#offer-price').text(this.product.offer_price);
         }, 1000);
         
        if(typeof data.PACKAGEMONTH != 'undefined' )
        {
          this.package_month = data.PACKAGEMONTH;
          //console.log(this.package_month)
          if(this.package_month)
          {
            this.monthdata = [this.package_month[0]];
            //this.month = this.monthdata[0].total_month;
          }
        }
        this.init_page();
        window.scroll(0,0);
        //this.share_fb_links();
      }
    ) 
  }
  add_to_favorite(id)
  {
    $('.wishlist-'+id).addClass('active');
    if(this.pack_selected)
      this.product.pack_selected = this.pack_selected;
    if($('#kit-packages').length > 0 )
    {
      if( typeof this.kit == 'undefined' )
      {
        this.toastr.errorToastr("Please Select Kit first");
        return false;
      }
    }
    else
    {
      this.kit = 2;
    }
    if(typeof this.month == 'undefined')
    {
      this.month = 1;
      this.product.month_pack = this.month;
    }
    else
    {
      this.product.month_pack = this.month;
    }

    if(!this.get_token())
    {
      $('.logup.modal-trigger')[0].click();
      this.toastr.errorToastr("Please Login to proceed", 'Failed! ');
      return false;
    }
    if(id != this.product.id)
    {
      let product_exist = this.recommended.filter(x => x.id == id);
      var product_data : any = product_exist[0]; 
    }
    else
    {
      var product_data : any = this.product; 
    }
      
    this.spinner.show() 
    this.productservice.add_to_favorite({product : product_data,token : this.get_token()})
    .subscribe(
    data => 
    {
      this.spinner.hide();
      if(data.status == true)
      {
        localStorage.setItem('favourite', JSON.stringify(data.favourites));
        this.toastr.successToastr(data.msg);
        return false;
      }
      this.toastr.errorToastr(data.msg); 
    }
    ) 
  }

  to_number(string)
  {
    return Number(string);
  }

  fetch_all_multi(category_id,product_id)
  {
    if($('[name="pincode"]').length > 0)
    {
      var pincode =  $('[name="pincode"]').val();
      if(pincode == null || pincode == '')
      {
        this.toastr.errorToastr("Please Enter Pincode.");
        $('html, body').animate({
          scrollTop: $("#monthly-packages").offset().top
        }, 1000);
        $('[name="pincode"]').css("border-bottom", "1px solid #ff6a00");
        return false;
      }
    }
    if(!this.get_token())
    {
      $('.logup.modal-trigger')[0].click();
      this.toastr.errorToastr("Please Login to proceed", 'Failed! ');
      return false;
    }
    else
    {
      $('.checkout-with-multi')[0].click();
    }
    this.spinner.show();
    this.add_to_cart(product_id) 
    this.productservice.fetch_all_multi({category_id: category_id})
    .subscribe(
    data => 
    {
      this.spinner.hide() 
      this.multi_list = data.MULTI;
    }
    ) 
  }
  continue_to_select(multi)
  {
    if(!this.productservice.if_exist_in_cart(this.product.id))
    {
      this.add_to_cart(this.product.id);
    }

    if(!this.productservice.if_exist_in_cart(multi.id))
    {
      if(this.product.category_id == 1)
      {
        if(this.pack_selected[1])
        {
          multi.pack_selected = this.pack_selected;
          multi.pack_selected[0].price = this.pack_selected[1].multi_price;
          multi.pack_selected[1].price =  this.pack_selected[1].multi_price;
        }
        else
        {
          multi.pack_selected = this.pack_selected;
          multi.pack_selected[0].price = this.pack_selected[0].multi_price;
        } 
         multi.tsk_kit = this.multi_tsk_kit;
      }
      else
      {
        multi.pack_selected = [];
        multi.pack_selected = [this.pack_selected[0]];
        if(this.pack_selected[1])
          multi.pack_selected = [this.pack_selected[0],this.pack_selected[1]];
        if(this.pack_selected[0])
          multi.pack_selected[0].price =  this.pack_selected[0].multi_price;
        if(this.pack_selected[1])
          multi.pack_selected[1].price =  this.pack_selected[1].multi_price;
        
      }
      //console.log(multi.pack_selected);
      multi.month_pack = this.product.month_pack;
      this.productservice.addto_cart(multi.id,multi);
    } 
    this.productservice.loadCart();
    if(this.pincode != '')
    {
      this.route.navigate(['/product/checkout'],{queryParams: {pincode: this.pincode}});
      return;
    }
    this.route.navigate(['/product/checkout']);
  }
  check_cashback(cashback)
  {
    let exist = cashback.filter(x => x.services_id == this.product.id);
    if(exist.length > 0 )
    {
      return exist;
    }
    return false;
  }
  circle_selected(circle)
  {
    this.productservice.set_region(circle);
    let url = window.location.pathname;
      if(url == url)
      {
        this.route.routeReuseStrategy.shouldReuseRoute = function(){
          return false;
        }
      this.route.navigated = false;
      this.route.navigate([url],{queryParams: {month: this.month}});
      }  
    // this.todoservice.channel_category_by_circle({circle:circle,packages: this.product.channel_packages,month: this.month})
    // .subscribe(
    // data => 
    // {
    //   this.channels_packs = data.package;
    //   this.filter_channel_subpack();
    // }
    // ) 
  }
  
  region_selected()
  {
    if( localStorage.getItem('region') != null )
    {
      return JSON.parse(localStorage.getItem('region'));
    }
    return 0;
  }

  product_categories()
  {
    this.todoservice.product_categories()
		  .subscribe(
			data => 
			{
        this.product_category_list = data.categories;
      }
		  ) 
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

  load_more_review()
  {
    $('#more-display').after('<span id="loading-more">Loading...</span>');
    this.review_start += 4;
    this.fetch_more_reviews();
  }

  fetch_more_reviews()
  {
    let data : any = {product_id: this.product_id,review_start: this.review_start}
    this.todoservice.fetch_more_reviews(data)
		  .subscribe(
			data => 
			{
        this.spinner.hide();
        var a = this.reviews;
        var b = data.REVIEW;
        this.reviews = Object.assign(a, b);
        this.more_display = data.more_enable;
        $('#loading-more').remove();
      }
		  ) 
  }

  buyNow(p_id)
  {
    if(!this.get_token())
    {
      var width = $(window).width(); 
      if(width < 767)
      {
        this.open_model();
        return false;
      }
      $('.logup.modal-trigger')[0].click();
      this.toastr.errorToastr("Please Login to proceed", 'Failed! ');
      return false;
    }
    if($('[name="pincode"]').length > 0)
    {
      var pincode =  $('[name="pincode"]').val();
      if(pincode == null || pincode == '')
      {
        this.toastr.errorToastr("Please Enter Pincode.");
        $('html, body').animate({
          scrollTop: $("#monthly-packages").offset().top
        }, 1000);
        $('[name="pincode"]').css("border-bottom", "1px solid #ff6a00");
        return false;
      }
      this.product.pincode = pincode;
      this.productservice.set_pincode(pincode);
    }
    

    if(this.multienable)
    {
      var sub_id =  $('[name="subscriber_id"]').val();
      if(sub_id == null || sub_id == '')
      {
        this.toastr.errorToastr("Please Enter Subscriber Id OR Phone Number");
        $('html, body').animate({
          scrollTop: $("#monthly-packages").offset().top
        }, 1000);
        $('[name="subscriber_id"]').css("border-bottom", "1px solid #ff6a00");
        return false;
      }
      this.product.subscriber_id =sub_id;
    }
      
    if(this.pack_selected)
      this.product.pack_selected = this.pack_selected;
    if($('#kit-packages').length > 0 )
    {
      if( typeof this.kit == 'undefined' )
      {
        this.toastr.errorToastr("Please Select Kit first");
        return false;
      }
    }
    else
    {
      this.kit = 2;
    }
    if(typeof this.month == 'undefined')
    {
      this.toastr.errorToastr("Please Select Month Package first");
        return false;
    }
    else
    {
      this.product.month_pack = this.month;
    } 
    
    if(!this.productservice.if_exist_in_cart(p_id))
    {
      this.productservice.addto_cart(p_id,this.product);
      this.productservice.loadCart();
    }
    if(this.pincode != '')
    {
      this.route.navigate(['/product/checkout'],{queryParams: {pincode: this.pincode}});
      return;
    } 
    this.route.navigate(['product/checkout']);
  }

  recommended_slider()
  {
    if($('#recommend-slider-script'))
    {
      $('#recommend-slider-script').remove();
    }
    let script = this._renderer2.createElement('script');
    script.type = `text/javascript`;
    script.id = `recommend-slider-script`;
    script.text = `
      $(document).ready(function(){
        $('#recommended-slider').lightSlider({
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
      }); 
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
        $('#login-modal').modal('open');
      }); 
    `;
    this._renderer2.appendChild(this._document.body, script);
  }
  change_count(p_id,op)
  {
    let val: any = $('#update_count1').text();
    if(op == 'minus')
    {
      if(val <= 1)
        return;
      val = Number(val) - 1; 
    }
    else
    {
      val = Number(val) + 1;
    }
    $('#update_count1').text(val);
  }

  view_product(cat_id,purl)
  {
    this.route.navigate(['/product/'+purl],{ queryParams: {cat_id:cat_id ,p_id: purl}});
    this.fetch_product_data(purl,cat_id)
  }
  init_page() 
  {
    if($('#init-page-script'))
    {
      $('#init-page-script').remove();
    }
    let script = this._renderer2.createElement('script');
    script.id = `init-page-script`;
    script.type = `text/javascript`;
    script.text = `
       
        $(document).ready(function(){
          $('.collapsible').collapsible();
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
          $('#login-modal').modal();
          $('.logup.modal-trigger').click(function(){
            $('#login-modal').modal('open');
          });
          $('.cdk-overlay-container').css('z-index','99999999!important');
        });
        $.fn.isInViewport = function() {
          if($(this).length == 0 )
          {
            return false;
          }
          var elementTop = $(this).offset().top;
          var elementBottom = elementTop + $(this).outerHeight();
          var viewportTop = $(window).scrollTop();
          var viewportBottom = viewportTop + $(window).height();
          return elementBottom > viewportTop && elementTop < viewportBottom;
      };
      $(window).scroll(function (event) {
        if(!$.fn.isInViewport )
        {
          return false;
        }
        if($(window).width() >767){
        var scroll = $(window).scrollTop();
        //console.log($('.order-summary').offset().top - $('.recomended-wrapper').offset().top + $('.order-summary').height());
        if(scroll >= 1)
        {
          if($('#footer-content').isInViewport())
          {
            if(scroll - $('#footer-content').offset().top > -300)
            {
              $('.images-product').css({'position':'relative','top':'0'});
              $('.order-summary').css('position','relative');
              return;
            }
            
          }
          if($('.order-summary').isInViewport() && ($('.order-summary').offset().top - $('.recomended-wrapper').offset().top + $('.order-summary').height() >= 0 || $('.order-summary').offset().top - $('#channel-list').offset().top < 0))
            {
              $('.order-summary').css({'position':'relative','top':0,'right':0});
              return;
            }
          if ($('.product-img').isInViewport() && (scroll - $('#channel-list').offset().top < -500)) {
            $('.images-product').css({"position":"fixed","top":"106px"});
            $('.order-summary').css('position','relative');
          }
          else if($('.order-summary').isInViewport() && (scroll - $('#channel-list').offset().top >= -500) && (scroll - $('#channel-list').offset().top < 0))
          {
            //console.log(scroll - $('#channel-list').offset().top);
            $('.images-product').css({'position':'relative','top':'0'});
            //console.log(2)
          }
          else if($('.order-summary').isInViewport() && (scroll - $('#channel-list').offset().top >= -98))
          {
            $('.order-summary').css({'position':'fixed','top':'107px','right':'25px'});
          }
          else 
          {
            //console.log(1);
            $('.images-product').css({'position':'relative','top':'0'});
            $('.order-summary').css('position','relative');
          }
        }
        else
        {
          $('.images-product').css({'position':'relative','top':'0'});
        }
      }
    });
    // $(window).on('load', function(){ 
		// 	$('.religon-overlay').css('display', 'block');
		// });
		$(document).ready(function(){
			$('.more').on('click', function(){
				$('.chip').removeClass('hide');
				$('.more').addClass('hide');
			});
			$('.btn-contu').on('click', function () {
				$('.religon-overlay').css('display', 'none');	
			});
			$('.chip').on('click', function() {
				$(this).addClass('green');
      });
      
		});
    `;
    this._renderer2.appendChild(this._document.body, script);
  }

  unhide()
  {
    $('.unhide-link').remove()
    this.hide = false;
  }
  search_me(val)
  {
    let data : any = {};
    data.search = val;
    data.product_id = this.product.id;
    this.todoservice.search_pincode(data)
    .subscribe(
      data => 
      {
        if(!jQuery.isEmptyObject(data))
        {
          this.filterdList = true;
          this.filteredOptions = data;
          //console.log(this.filteredOptions)
        }
      }
    )
  }
  check_pincode()
  {
    let pincode = $('#pincode-text').val();
    $('.check-pincode-btn').text('Wait..');
    let data : any = {};
    data.pincode = pincode;
    data.product_id = this.product.id;
    this.todoservice.search_product_pincode(data)
    .subscribe(
      data => 
      {
        if(!jQuery.isEmptyObject(data))
        {
          $('.check-pincode-btn').text('Check');
          if(data.status == true)
          {
            this.product.pincode = pincode;
            $('.religon-overlay').hide();
            this.pincode = pincode;
            this.toastr.successToastr('Great! '+data.msg);
            //console.log(this.circles);
            let circle_exist = this.circles.filter(circles => circles.name.includes(data.circle));
            if(circle_exist.length > 0)
            {
              this.region  = circle_exist[0].circle_id;
            }
          }
          else
          {
            this.toastr.errorToastr('Failed! '+data.msg);
          }
        }
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
    this.calculate_amount();
  }
  
  remove_new_line(str)
  {
    //console.log(str.replace(/(\r\n|\n|\r|↵)/g,""));
    return str.replace(/(\r\n|\n|\r|↵|rn)/g,"");
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
    if(this.kit == 3)
      amount = amount + Number(this.product.price) - 1000;
    else
      amount = amount + Number(this.product.offer_price);  
    if(this.product.promos)
    {
      if(this.promos.discount <= this.promos.max_discount)
      {
        amount = amount - Number(this.promos.discount);
      }
    } 
    if(this.options && this.todoservice.get_user_product_amount() >= this.options.how_much_apply_to_product) 
      amount = amount - this.options.how_much_apply_to_product;
    return amount;
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
    $('.collapsible').collapsible(); 
    `;
    this._renderer2.appendChild(this._document.body, script);
  }

  htmlToPlaintext(text) {
    return text ? String(text).replace(/<[^>]+>/gm, '') : '';
  }

  get_token()
  {
    return this.authservice.auth_token();
  }

  initialize_collapse()
  {
    this.init_accordian();
  }

  select_month(month)
  {
    //console.log(month)
    if($('#kit-packages').length > 0 )
    {
      if( typeof this.kit == 'undefined' )
      {
        this.toastr.errorToastr("Please Select TSK Kit");
        return false;
      }
    }
    else
    {
      this.kit = 2;
    }
    //$('#monthly-packages a').removeClass('active-kp');
    //$('#month-'+month.id).addClass('active-kp');
    this.product.month_pack = month;
    this.monthdata = this.package_month.filter(pack => pack.id === month);
    $('#mrp-price').text(this.monthdata[0].package_price);
    if(this.kit == 3)
    {
      $('#offer-price').text(this.monthdata[0].package_price - 1000 );
    }
    else
    {
      $('#offer-price').text(this.monthdata[0].offer_price);
    }
    this.month = this.monthdata[0].total_month;
    this.fetch_package();
  }

  fetch_package()
  {
    this.spinner.show();
    let data = {month : this.month,circle: this.region,product: this.product_id};
      this.todoservice.fetch_pack_by_month(data)
      .subscribe(
        data => 
        {
          this.route.navigate(['/product/'+this.p_id], { queryParams: { month:  this.monthdata[0].total_month} });
          this.channels_packs = data.package;
          this.title.setTitle(this.product.meta_title + " With "+this.monthdata[0].total_month+ ' Month Pack');
          this.filter_channel_subpack();
          this.spinner.hide();
        }
      ) 
  }
  select_kit(kit)
  {
    this.kit = kit;
    this.product.tsk_kit = this.kit;
    
    if(this.kit == 3)
    {
      $('#cashback-item').hide();
      this.otf_margin = true;
      $('#offer-price').text(this.monthdata[0].package_price - 1000 );
      delete this.product.promos;  
      this.calculate_amount();
    }
    else
    {
      $('#offer-price').text(this.monthdata[0].offer_price );
      $('#cashback-item').show();
      this.product.promos = this.promos;
      this.calculate_amount();
    }
  }
  
  add_to_cart(id)
  {
    this.apply_package();
    if(this.product.category_id == 1)
    {
      this.product.tsk_kit    = this.kit;
    }
    this.product.month_pack = this.month;
    this.product.pack_selected = this.pack_selected;
    this.product.offer_price = Number($('#offer-price').text());
    this.product.price = Number($('#mrp-price').text());
    this.productservice.addto_cart(id,this.product);
    this.toastr.infoToastr("Your Item is Added to the Cart");
  }

  multi_tsk(id)
  {
    if($('[name="tskkit-'+id+'"]:checked').val() == 3)
    {
      this.multi_tsk_kit = 3;
    }
    else
    {
      this.multi_tsk_kit = 2;
    }
  }
  go_to_channel_section(opt)
  {
    $('html, body').animate({
      scrollTop: $("#channel-list").offset().top -100
    }, 1000);
    if(opt == 2)
    {
      $('.multi-text').text("Include Multibox");
    }
  }

  goto_reviews()
  {
    $('html, body').animate({
      scrollTop: $("#rating-reviews").offset().top -100
    }, 1000);
  }

  apply_package()
  {
    let data : any  = {};
    if($('#kit-packages').length > 0 )
    {
      if( typeof this.kit == 'undefined' )
      {
        this.toastr.errorToastr("Please Select TSK Kit");
        return false;
      }
    }
    else
    {
      this.kit = 2;
    }
    if(typeof this.month == 'undefined')
    {
      this.month = this.monthdata[0].total_month;
      //this.toastr.error("Please Select Month Package");
      //return false;
    }
    var monthdata = this.package_month.filter(pack => pack.id === this.month);
  }

  convert_to_json(string)
  {
    return $.parseJSON(string);
  }

  show_box()
  {
    if($('[name="payment_type"]:checked').val() == 'paytm')
    {
      $('#paytm-box').show();
    }
    else
    {
      $('#paytm-box').hide();
    }
  }

  apply_otf_margin()
  {
    if($('[name="payment_type"]:checked').val() == 'paytm')
    {
      if($('#paytm-ref').val() == '')
      {
        this.toastr.errorToastr("Please Enter the Paytm Transaction ID");
        return false;
      }
      var otf_type = 2;
    }
    else
    {
      var otf_type = 1;
    }
    this.product.otf_pay_type = otf_type;
    //$('.modal-close.close-mode').click();
  }


}

