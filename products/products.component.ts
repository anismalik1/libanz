import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { TodoService } from '../todo.service';
import { AuthService } from '../auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import * as $ from 'jquery';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styles: []
})
export class ProductsComponent implements OnInit{
  data : any;
  products : any ;
  p: number = 1;
  public userinfo = {wallet:'',phone:'',name:''};
  product_counts : number = 0;
  public cart = [];
  public totalPrice: number;
  public totalQuantity: number;
  checked_filter : any = {is_tatasky : false,is_dth : false,is_airtel : false,is_jio:false,is_videocon: false,is_air:false,is_sundirect:false,is_bigtv: false,is_cod:false,is_freeship:false,is_hot_sale:false,is_best_sell:false,is_dth_cable:false,is_connector:false,is_antena:false,is_remotes:false,is_lnb:false,is_adapter:false}; 
  checked_quality : any = {is_primary: false,is_secondary : false};
  checked_str_quality : any = {is_sd: false,is_hd : false,is_4k:false};
  checked_package : any = {monthly:false,yearly:false};
  constructor( private cartStore: ProductService,private spinner : NgxSpinnerService,public todoservice : TodoService,private authservice : AuthService,private router : Router) { }
  ngOnInit() {
    this.data = {cat_id : '',page_index:0}; 
    if(this.todoservice.get_param('cat_id') != '')
        this.data.cat_id = this.todoservice.get_param('cat_id');
    
    var arr = this.data.cat_id.split(',');

    for(var i=0;i < arr.length ;i++)
    {
      if(arr[i] == 1)
        this.checked_filter.is_tatasky = true;
      if(arr[i] == 2)
        this.checked_filter.is_videocon = true; 
      if(arr[i] == 3)
        this.checked_filter.is_airtel = true; 
      if(arr[i] == 4)
        this.checked_filter.is_dth = true;
      if(arr[i] == 138)
        this.checked_filter.is_air = true;
      if(arr[i] == 241)
        this.checked_filter.is_sundirect = true;
      if(arr[i] == 210)
        this.checked_filter.is_bigtv = true; 
    }
    this.apply_product_filter(1);
                  
  }
 
  filter_cat()
  {
    var array : any = ''; 
    var array_type : any = ''; 
    var array_quality : any = ''; 
    var array_package : any = ''; 
    $('#brand-category input[type="checkbox"]:checked').each(function(){
      array += $(this).val()+','; 
    });
    $('#box-type input[type="checkbox"]:checked').each(function(){
      array_type += $(this).val()+','; 
    });
    $('#video-quality input[type="checkbox"]:checked').each(function(){
      array_quality += $(this).val()+','; 
    });

    $('#package-type input[type="checkbox"]:checked').each(function(){
      array_package += $(this).val()+','; 
    });

    if(array != '')
    {
      array = array.slice(0, -1);
    }
    if(array_type != '')
    {
      array_type = array_type.slice(0, -1);
    }
    if(array_quality != '')
    {
      array_quality = array_quality.slice(0, -1);
    }
    if(array_package != '')
    {
      array_package = array_package.slice(0, -1);
    }
    this.router.navigate(['/product/listing'],{ queryParams: { cat_id:  array,type: array_type,quality: array_quality,package: array_package} });
    this.spinner.show();
    let filter_data : any = { cat_id : array,type: array_type,quality: array_quality,package: array_package};
    this.todoservice.get_filter_products(filter_data)
      .subscribe(
        data => 
        {
          this.spinner.hide();
          let b = this.htmlToPlaintext(JSON.stringify(data));
          data =  JSON.parse(b.replace(/\\/g, ''));
          this.products = data.PRODUCTDATA;
          if(this.data.page_index == 1)
          {
            this.product_counts = data.COUNTS[0].numrows;
          }
           
        }
      )  
  }
  apply_product_filter(page)
  {
    var array : any = ''; 
    var array_type : any = ''; 
    var array_quality : any = ''; 
    var array_package : any = ''; 
    if(this.todoservice.get_param('cat_id') != '')
      array = this.todoservice.get_param('cat_id');
    if(this.todoservice.get_param('type') != '')
      array_type = this.todoservice.get_param('type');
    if(this.todoservice.get_param('quality') != '')
      array_quality = this.todoservice.get_param('quality');
    if(this.todoservice.get_param('package') != '')
      array_package = this.todoservice.get_param('package');

    let filter_data : any = { cat_id : array,type: array_type,quality: array_quality,package: array_package};
    this.data = filter_data;
    this.data.page_index = page;
    this.spinner.show();
    this.todoservice.get_filter_products(this.data)
      .subscribe(
        data => 
        {
          this.spinner.hide();
          let b = this.htmlToPlaintext(JSON.stringify(data));
          data =  JSON.parse(b.replace(/\\/g, ''));
          this.products = data.PRODUCTDATA;
          if(this.data.page_index == 1)
          {
            this.product_counts = data.COUNTS[0].numrows;
          }
           
        }
      )  
  }
  getPage(page)
  {
    this.spinner.show();
    this.apply_product_filter(page);
    this.p = page;
  }
  htmlToPlaintext(text) {
    return text ? String(text).replace(/<[^>]+>/gm, '') : '';
  }
  get_token()
  {
    return this.authservice.auth_token();
  }
}
