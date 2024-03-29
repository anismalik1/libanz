import { Component, OnInit ,Renderer2,Inject,PLATFORM_ID } from '@angular/core';
import { Meta,Title } from "@angular/platform-browser";
import { DOCUMENT} from "@angular/common";
import { TodoService } from '../todo.service';
import { ProductService } from '../product.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import {isPlatformBrowser} from '@angular/common';
import {BehaviorSubject} from 'rxjs';

// import * as $ from 'jquery'; 
@Component({
  selector: 'app-compare-dth',
  templateUrl: './compare-dth.component.html',
  styles: []
})
export class CompareDthComponent implements OnInit {
  static isBrowser = new BehaviorSubject<boolean>(null!);
  private urls : any = '';
  public disable_compare = false;
  public compare_products : any ;
  public product_category_list : any;
  public product_list : any;
  public referer : any;
  private page: string;
  private change : boolean = false;
  public all_specifications :any;
  constructor(
    private _renderer2: Renderer2,
    @Inject(PLATFORM_ID) private platformId: any, 
    @Inject(DOCUMENT) private _document, 
    public todoservice  : TodoService,
    private productservice: ProductService, 
    private spinner: NgxSpinnerService,
    private router: Router,
    private title: Title,
    private meta : Meta
  ) { 
    CompareDthComponent.isBrowser.next(isPlatformBrowser(platformId));
    if(isPlatformBrowser(this.platformId)) 
      this.init_script();
  }

  ngOnInit() {
    this.todoservice.back_icon_template('Compare Products',this.todoservice.back(1))
    if(this.todoservice.get_param('ref') != '')
      this.referer = this.todoservice.get_param('ref')
    if(this.todoservice.get_param('urls') != '')
        this.urls = this.todoservice.get_param('urls');
    var arr = this.urls.split('-vs-');
    if(arr.length >= 4)
    {
      this.disable_compare = true;
      return;
    }
    this.apply_filter(arr); 
    this.product_categories();
    //this.fetch_page_data();
  }

  fetch_page_data()
  {
    this.page = '/product/compare-box';
   let page = {page : this.page}; 
   if(page.page == '')
   {
       return;
   }
   this.todoservice.fetch_page_data(page)
     .subscribe(
       data => 
       {
         if(data.PAGEDATA)
         {
           this.todoservice.set_page_data(data.PAGEDATA[0]);
            $('#page-content').html(this.todoservice.get_page().description);
           this.meta.addTag({ name: 'description', content: this.todoservice.get_page().metaDesc });
           this.meta.addTag({ name: 'keywords', content: this.todoservice.get_page().metaKeyword });
           this.title.setTitle(this.todoservice.get_page().metaTitle);
           window.scroll(0,0); 
         }
         this.spinner.hide();  
       }
     ) 
  }

  change_compare_list(action)
  {
    this.spinner.show();
    this.productservice.change_compare_list(action)
    .subscribe(
			data => 
			{
        this.spinner.hide();
        this.all_specifications = data.SPECIFICATIONS;
        this.compare_products = data.compare_products;
        if(this.referer != '')
        {
          this.filter_to_first();
        }
        if(this.compare_products.length >= 4)
        {
          this.disable_compare = true;
        }
        if(data.compare_content)
        {
          $('#compare-title').text(data.compare_content.title);
          this.meta.addTag({ name: 'description', content: data.compare_content.meta_description });
          this.meta.addTag({ name: 'keywords', content: data.compare_content.meta_keyword });
          this.title.setTitle(data.compare_content.meta_title);
        }
        else
        {
          this.title.setTitle("Compare List - Libanz");
        }
        //this.router.navigateByUrl('https://mydthshop.com/product/compare-box?urls='+data.compare_content.url, {skipLocationChange: true});
        if(data.compare_content)
        {
          if(this.referer != '')
          {
            this.router.navigate(['/product/compare-box'], { queryParams: { urls: $.trim(data.compare_content.url) , ref: this.referer } });
          }
          else
          {
            this.router.navigate(['/product/compare-box'], { queryParams: { urls: $.trim(data.compare_content.url) } });
          }  
        } 
      })
  }

  unbox_me(url)
  {
    this.change = true;
    this.urls = '';
    for(var i = 0;i < this.compare_products.length;i++)
    {
      this.urls += this.compare_products[i].url+'-vs-';
    }
    this.urls = this.urls.substring(0,this.urls.length-4);
    var temp = this.urls.split('-vs-');
    let arr = temp.filter(item => item !== url);
    if(arr.length < 4)
      this.disable_compare = false;
    this.change_compare_list(arr);
    this.urls = arr.join("-vs-");
    this.router.navigate(['/product/compare-box'],{ queryParams: { urls: this.urls}});
    this. init_script();
  }

  apply_filter(vsurls)
  {
    this.spinner.show();
    this.productservice.compare_urls(vsurls)
    .subscribe(
			data => 
			{
        this.spinner.hide();
        this.all_specifications = data.SPECIFICATIONS;
        this.compare_products = data.compare_products;
        if(this.referer != '')
        {
          this.filter_to_first();
        }
        if(this.compare_products.length >= 4)
        {
          this.disable_compare = true;
        }
        if(data.compare_content)
        {
          if(isPlatformBrowser(this.platformId))
            $('#compare-title').text(data.compare_content.title);
          this.meta.addTag({ name: 'description', content: data.compare_content.meta_description });
          this.meta.addTag({ name: 'keywords', content: data.compare_content.meta_keyword });
          this.title.setTitle(data.compare_content.meta_title);
        }
        else
        {
          this.title.setTitle("Compare List - Libanz");
        }
        //this.router.navigateByUrl('https://mydthshop.com/product/compare-box?urls='+data.compare_content.url, {skipLocationChange: true});
        if(data.compare_content)
        {
          if(this.referer != '')
          {
            this.router.navigate(['/product/compare-box'], { queryParams: { urls: $.trim(data.compare_content.url) , ref: this.referer } });
          }
          else
          {
            this.router.navigate(['/product/compare-box'], { queryParams: { urls: $.trim(data.compare_content.url) } });
          }  
        } 
      }
		  ) 
  }

  filter_to_first()
  {
    let matched = this.compare_products.filter(x => x.url == this.referer);
    let unmatched = this.compare_products.filter(x => x.url != this.referer);
    if(matched.length > 0)
    {
      this.compare_products = matched.concat(unmatched);
    }
  }

  trim_text(text)
  {
    if(text.length > 33)
      return $.trim(text).substring(0, 30).split(" ").slice(0, -1).join(" ") + "...";
    else
      return text;
  }
  to_json(string)
  {
    return $.parseJSON(string);
  }

  find_feature(id,product_features)
  {
    var features = $.parseJSON(product_features);
    let exist = features.filter(x => x == id);
    if(exist.length > 0 )
    {
      return true;
    }
    return false;
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

 

  continue_to_change(url)
  {
    this.urls = this.urls+'-vs-'+url;
    this.router.navigate(['/product/compare-box'],{ queryParams: { urls: this.urls}});
    var arr = this.urls.split('-vs-');
    if(arr.length == 4)
      this.disable_compare = true;
    this.apply_filter(arr);
  }

  
  init_script()
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
      $(window).scroll(function (event) {
      if($(window).width() >767){
      var scroll = $(window).scrollTop();
      if(scroll > 368)
      {
        $('.compare-top-row').removeClass('hide');
      }
      else
      {
        $('.compare-top-row').addClass('hide');
      }
    }
  });
    });
    `;
    this._renderer2.appendChild(this._document.body, script);
  }
}
