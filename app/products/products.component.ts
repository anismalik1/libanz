import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { TodoService } from '../todo.service';
import { AuthService } from '../auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router,ActivatedRoute } from '@angular/router';
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
  constructor( private cartStore: ProductService,
    private spinner : NgxSpinnerService,
    public todoservice : TodoService,
    private authservice : AuthService,private router : Router,
    private route : ActivatedRoute
    ) { }
  ngOnInit() {
    this.data = {cat_id : '',page_index:0};
    this.route.params.subscribe(params => {
      this.data.cat_id = params['name'];
    });
    if(this.todoservice.get_param('cat_id') != '')
    {
      var cat = this.todoservice.get_param('cat_id');
      if(cat == 4)
      {
        this.router.navigate(['/product/listing/dish-tv']);
        return;
      }
      else if(cat == 1)
      {
        this.router.navigate(['/product/listing/tata-sky']);
        return;
      } 
      else if(cat == 2)
      {
        this.router.navigate(['/product/listing/airtel']);
        return;
      } 
      else if(cat == 3)
      {
        this.router.navigate(['/product/listing/videocon']);
        return;
      } 
    }
    var arr = this.data.cat_id.split('&&'); 

    for(var i=0;i < arr.length ;i++)
    {
      if(arr[i].includes('tata'))
        this.checked_filter.is_tatasky = true;
      if(arr[i].includes('videocon'))
        this.checked_filter.is_videocon = true; 
      if(arr[i].includes('airtel'))
        this.checked_filter.is_airtel = true; 
      if(arr[i].includes('dish'))
        this.checked_filter.is_dth = true;
      if(arr[i].includes('freetoair'))
        this.checked_filter.is_air = true;
      if(arr[i].includes('sundirect'))
        this.checked_filter.is_sundirect = true;
      if(arr[i].includes('bigtv'))
        this.checked_filter.is_bigtv = true; 
    }
    this.apply_product_filter(1);
                  
  }
 
  filter_cat()
  {
    var array : any = ''; 
    $('#brand-category input[type="checkbox"]:checked').each(function(){
      array += $(this).val()+'AND'; 
    });
    

    if(array != '')
    {
      array = array.slice(0, -3);
    }

    this.router.navigate(['/product/listing/'+array]);
    this.spinner.show();
    let filter_data : any = { cat_id : array};
    this.todoservice.get_filter_products(filter_data)
      .subscribe(
        data => 
        {
          this.spinner.hide();
          this.products = data.PRODUCTDATA;
          this.product_counts = data.COUNTS[0].numrows;
        }
      )  
  }
  apply_product_filter(page)
  {
    //console.log(page)
    var array : any = ''; 
    array = this.data.cat_id;

    let filter_data : any = { cat_id : array};
    this.data = filter_data;
    this.data.page_index = page;
    this.spinner.show();
    this.todoservice.get_filter_products(this.data)
      .subscribe(
        data => 
        {
          this.spinner.hide();
          this.products = data.PRODUCTDATA;
          this.product_counts = data.COUNTS[0].numrows;
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
