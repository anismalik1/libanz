import { Component, OnInit,ViewContainerRef ,Renderer2,Inject} from '@angular/core';
import { DOCUMENT,Meta,Title } from "@angular/platform-browser";
import { TodoService } from '../todo.service';
import { AuthService } from '../auth.service';
import { Router,ActivatedRoute } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
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
  region : any;
  fta_title : string;
  pack_selected : any = [];
  fta_pack : any = {};
  all_packs : any = [];
  channels_packs : any;
  circles : any;
  channels : any;
  product_category_list : any;
  product_list : any;
  multienable : boolean = false;
  display : number = 0;
  p_id : any;
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
  month : number;
  kit : number;
  otf_margin : boolean = false;
  monthdata : any;
  packages : Package[];
  product_mpackages : Package[];
  promos : any;
  thumbs : any;
  constructor(
    private _renderer2: Renderer2, 
    @Inject(DOCUMENT) private _document, 
    private spinner : NgxSpinnerService,
    private title: Title,
    private meta : Meta,
    private vcr: ViewContainerRef,
    private toastr: ToastsManager,
    public todoservice : TodoService,
    private authservice : AuthService,
    private productservice : ProductService,
    private router : ActivatedRoute, private route : Router ) {
    this.toastr.setRootViewContainerRef(vcr);
    this.product_categories();
   }
  ngOnInit() {
    this.router.params.subscribe(params => {
      if (this.route.url.includes('multi')) 
      {  
          this.multienable = true; 
      }
      this.p_id = params['name']; //log the value of id
      this.fetch_product_data(this.p_id,this.cat_id);
    });

    this.cat_id = this.todoservice.get_param('cat_id');
    //this.product_id = this.todoservice.get_param('id');
    //this.fetch_product_data(this.p_id,this.cat_id);
    // Observable.interval(100 * 60).subscribe(x => {
    //   //this.track_record();
    // });
    
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
    this.route.navigateByUrl('/product/'+url);
  }  
  // filter_channel_pack(product_pack)
  // { 
  //   //console.log(product_pack);
  //   let temp :any = [];
  //   let channel_rows = [];
  //   for(var i=0;i<product_pack.length ;i++)
  //   {
  //       temp = product_pack[i];
  //       let exist_id = this.all_packs.filter(x => x.id == temp);
  //       if(exist_id.length > 0)
  //       {
  //         channel_rows.push(exist_id[0]);
  //       }
  //   }  
  //   this.channels_packs = channel_rows; 

  // }

  filter_channel_subpack()
  { 
    this.pack_selected = [];
    for(var i=0;i<this.channels_packs.length ;i++)
      {
        if( this.channels_packs[i].title.includes("FTA") || this.channels_packs[i].title.includes('All-India'))
        {
          //console.log(this.channels_packs[i].child[0])
          if(this.channels_packs[i].child[0])
          {
            this.fta_pack = this.channels_packs[i].child[0];

            let fta_exist = this.pack_selected.filter(x => x.id == this.fta_pack.id);
            //console.log(fta_exist)
            if(fta_exist.length == 0)
            {
              this.pack_selected.push(this.fta_pack); 
            }
           break;
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
      this.toastr.error("Please Login to rate this product", 'Failed! ');
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
      this.toastr.error("Please Select Rating.", 'Failed! ');
      this.spinner.hide();
      return false;
    }
    this.spinner.show();
    form.token = this.get_token();
    if(form.token == '' || form.token == null)
    {
      this.toastr.error("Please Login to rate this product.", 'Failed! ');
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
      if(this.productservice.get_region())
      {
        this.region = this.productservice.get_region();
      } 
		  let data = {token : this.get_token(),product_id: p_id,cat_id:cat_id,region: this.region};
		  this.productservice.fetch_product_data(data)
		  .subscribe(
			data => 
			{
        data.PRODUCTDATA.channel_packages = data.PRODUCTDATA.channel_packages.replace(/"/g, '\'');
        this.spinner.hide();
        let b = this.htmlToPlaintext(JSON.stringify(data));
        this.channels_packs = data.package;
        this.fta_pack = {};
        this.filter_channel_subpack();
        this.product = data.PRODUCTDATA;
        this.circles = data.circles;
        if(data.PROMOS.length > 0)
        {
          this.promos = data.PROMOS[0];
          this.product.promos = this.promos;
        }
        if(this.circles)
        {
          if(!this.productservice.get_region())
          {
            $('.religon-overlay').show();
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
        this.meta.addTag({ name: 'description', content: this.product.metaDesc });
        this.meta.addTag({ name: 'keywords', content: this.product.metaKeyword });
        this.title.setTitle(this.product.metaTitle);
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
          if(this.package_month)
          {
            this.monthdata = [this.package_month[0]];
            this.month = this.monthdata[0].total_month;
          }
        }
        this.init_page();
        window.scroll(0,0);
      }
		  )  
  }

  circle_selected(circle)
  {
    this.region = circle;
    this.productservice.set_region(circle);
    this.todoservice.channel_category_by_circle({circle:circle,packages: this.product.channel_packages})
    .subscribe(
    data => 
    {
      this.channels_packs = data.package;
      this.filter_channel_subpack();
    }
    ) 
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
    if(this.multienable)
      this.product.subscriber_id = $('[name="subscriber_id"]').val();
    if(this.pack_selected)
      this.product.pack_selected = this.pack_selected;
    if($('#kit-packages').length > 0 )
    {
      if( typeof this.kit == 'undefined' )
      {
        this.toastr.error("Please Select Kit first");
        return false;
      }
    }
    else
    {
      this.kit = 2;
    }
    if(typeof this.month == 'undefined')
    {
      this.toastr.error("Please Select Month Package first");
        return false;
    }
    else
    {
      this.product.month_pack = this.month;
    }

    if(!this.get_token())
    {
      $('.logup.modal-trigger')[0].click();
      this.toastr.error("Please Login to proceed", 'Failed! ');
      return false;
    }
    if(!this.productservice.if_exist_in_cart(p_id))
    {
      this.productservice.addto_cart(p_id);
      this.productservice.loadCart();
    } 
    this.route.navigate(['product/checkout']);
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
        $('.collapsible').collapsible();
        $('.slider-6').lightSlider({
          item: 4,
          auto: false,
          pauseOnHover: true,
          loop: false,
          pause: 3000,
          keyPress: true,
          controls: true,
          pager: false,
          enableDrag: true,
          responsive: [
          {
            breakpoint:900,
            settings: {
              item:4
            }
          },
          {
            breakpoint:600,
            settings: {
              item:2
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
        $(document).ready(function(){
          $('#login-modal').modal();
          $('.logup.modal-trigger').click(function(){
            $('#login-modal').modal('open');
          });
          $('.cdk-overlay-container').css('z-index','99999999!important');
        });
        $.fn.isInViewport = function() {
          var elementTop = $(this).offset().top;
          var elementBottom = elementTop + $(this).outerHeight();
      
          var viewportTop = $(window).scrollTop();
          var viewportBottom = viewportTop + $(window).height();
      
          return elementBottom > viewportTop && elementTop < viewportBottom;
      };
      $(window).scroll(function (event) {
        var scroll = $(window).scrollTop();
        if(scroll >= 132)
        {
          if($('#footer-content').isInViewport())
          {
            if($(window).scrollTop() - $('#footer-content').offset().top > -300)
            {
              $('.images-product').css('position','relative');
              $('.order-summary').css('position','relative');
              return;
            }
            
          }

          if ($('.product-detail').isInViewport() && ($(window).scrollTop() - $('#channel-list').offset().top < -400)) {
            $('.images-product').css('position','fixed').css('top','0');
            $('.order-summary').css('position','relative');
          }
          else if($('.order-summary').isInViewport() && ($(window).scrollTop() - $('#channel-list').offset().top > -400) && ($(window).scrollTop() - $('#channel-list').offset().top < 0))
          {
            $('.images-product').css('position','relative');
          }
          else if($('.order-summary').isInViewport() && ($(window).scrollTop() - $('#channel-list').offset().top > 0))
          {
            $('.order-summary').css('position','fixed').css('top','0').css('right','0');
          }
          else 
          {
            $('.images-product').css('position','relative');
            $('.order-summary').css('position','relative');
          }
        }
        else
        {
          $('.images-product').css('position','relative');
        }
    });
    $(window).on('load', function(){ 
			$('.religon-overlay').css('display', 'block');
		});
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
    for(var i = 0;i < this.pack_selected.length;i++)
    {
      amount = amount + Number(this.pack_selected[i].price);
    }
    if(this.kit == 3)
      amount = amount + Number(this.product.price) - 1000;
    else
      amount = amount + Number(this.product.offer_price);  
    if(this.promos)
    {
      if(this.promos.discount <= this.promos.max_discount)
      {
        amount = amount - Number(this.promos.discount);
      }
    }  
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

    if($('#kit-packages').length > 0 )
    {
      if( typeof this.kit == 'undefined' )
      {
        this.toastr.error("Please Select TSK Kit");
        return false;
      }
    }
    else
    {
      this.kit = 2;
    }
    this.month = month;
    $('#monthly-packages a').removeClass('active-kp');
    $('#month-'+month).addClass('active-kp');
    this.product.month_pack = this.month;
    this.monthdata = this.package_month.filter(pack => pack.id === this.month);
    
    $('#mrp-price').text(this.monthdata[0].package_price);
    if(this.kit == 3)
    {
      $('#offer-price').text(this.monthdata[0].package_price - 1000 );
    }
    else
    {
      $('#offer-price').text(this.monthdata[0].offer_price);
    }
    
  }

  select_kit(kit)
  {
    this.kit = kit;
    this.product.tsk_kit = this.kit;
    
    if(this.kit == 3)
    {
      //console.log(this.monthdata)
      $('#cashback-item').hide();
      this.otf_margin = true;
      $('#offer-price').text(this.monthdata[0].package_price - 1000 );
    }
    else
    {
      $('#offer-price').text(this.monthdata[0].offer_price );
      $('#cashback-item').show();
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
    this.productservice.addto_cart(id);
    this.toastr.info("Your Item is Added to the Cart");
  }

  go_to_channel_section()
  {
    $('html, body').animate({
      scrollTop: $("#channel-list").offset().top
    }, 1000);
  }

  apply_package()
  {
    let data : any  = {};
    if($('#kit-packages').length > 0 )
    {
      if( typeof this.kit == 'undefined' )
      {
        this.toastr.error("Please Select TSK Kit");
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
        this.toastr.error("Please Enter the Paytm Transaction ID");
        return false;
      }
      var otf_type = 2;
    }
    else
    {
      var otf_type = 1;
    }
    this.product.otf_pay_type = otf_type;
    $('.modal-close.close-mode').click();
  }
}

