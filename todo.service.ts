import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Headers,Http } from '@angular/http';
import { AuthService } from './auth.service';
import {Pages} from './pages';
import { User} from './user';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class TodoService {

  public server_url : string = "https://www.mydthshop.com/";
  public base_url : string = 'https://www.mydthshop.com/web-app/';
  public service_url : string = 'https://www.mydthshop.com/index.php?/app_services/';
  public request_action = "proceed_recharge";
  public current_url : string;
  public footer : boolean = true;
  public page_data : Pages;
  public page : Pages;
  public footer_data : Pages ;
  public dropdown_add_money = {paymethod: '',paybankaccount:'',yourbankname : '' };
  public login_urls : any = ['/book-order','/booked-order-list','/recharge-status','/order-status',
  '/manage-account','/transaction-history','/commission-structure','/topup-request','/add-money',
  '/complaints','/manage-retailer','/value-transfer','/dashboard','/checkout']; 
  constructor(private http : Http, private router : Router ,public user : User,private authservice : AuthService)
  {
    window.scrollTo(0, 0);
    this.current_url = this.router.url;
  }

  get_user_data()
  {
    if(this.get_token())
    {
      this.fetch_user_info({token: this.get_token()})
      .subscribe(
        data => 
        {
          if(data.status == 'Invalid Token')
          {                                                     
            this.authservice.clear_session();
            this.router.navigate(['/login']);
          }
          this.set_user_data(data.USER);
        }
      )  
    }
  }

  is_footer_enabled()
  {
    if(this.login_urls.includes(this.current_url))
    {
      this.footer = false;
    } 
  }
  

  get_token()
  {
    return this.authservice.auth_token();
  }

  page_per_items()
  {
    return 10;
  }

  onTap(url)
  {
    this.router.navigate([url]);
  }
  get_param(name)
  {
    const results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if(!results){
      return 0;
    }
    return results[1] || 0;
  }

  get_user_type()
  {
    if(typeof this.user.storage != 'undefined')
      return this.user.storage.user_type;
    else
      return '';  
  }
  set_user_data(data)
  {
    let b = JSON.stringify(data);
    if(b)
      this.user.storage =  JSON.parse(b.replace(/\\/g, ''));
  }

  get_user_wallet()
  {
    if(typeof this.user.storage != 'undefined')
      return this.user.storage.wallet;
    else
      return '';
  }

  get_user_wallet_amount()
  {
    if(typeof this.user.storage != 'undefined')
      return Number(this.user.storage.wallet.replace(/\,/g,""));
    else
      return 0;
  }


  get_user_phone()
  {
    if(typeof this.user.storage != 'undefined')
      return this.user.storage.phone;
    else
      return '';  
  }

  get_user()
  {
      return this.user.storage;  
  }

  get_user_name()
  {
    if(typeof this.user.storage != 'undefined')
      return this.user.storage.name;
    else
      return '';  
  }
  
  get_user_email()
  {
    if(typeof this.user.storage != 'undefined')
      return this.user.storage.email;
    else
      return ''; 
  }

  get_user_id()
  {
    if(typeof this.user.storage != 'undefined')
      return this.user.storage.id;
    else
      return 0;  
  }

  set_page_data(data)
  {
    // let b = JSON.stringify(data);
    // this.page =  JSON.parse(b.replace(/\\/g, ''));
    this.page =  data;
  }

  set_footer_data(data)
  {
    this.footer_data =  data;
  }

  get_footer_page()
  {
    return this.footer_data
  }

  get_page()
  {
    return this.page;  
  }

  send_post_request(data) : Observable<any>
  {
    var Headers_of_api = new Headers({
      'Content-Type' : 'application/x-www-form-urlencoded'
    });
    return this.http.post(this.service_url+this.request_action,data,{headers: Headers_of_api})
    .map(res => res.json());
  }
  fetch_user_info(data)
  {
    this.request_action = 'fetch_user_info';
    return this.send_post_request(data) ; 
  }
  fetch_qr_user(data)
  {
    this.request_action = 'fetch_qr_user_info';
    return this.send_post_request(data) ; 
  }
  
  send_value(data)
  {
    this.request_action = 'send_value_to_wallet';
    return this.send_post_request(data) ; 
  }
  manage_account_info(data)
  {
    this.request_action = 'manage_account_info';
    return this.send_post_request(data) ; 
  }
  update_account(data)
  {
    this.request_action = 'update_account_info';
    return this.send_post_request(data) ; 
  }
  update_password(data)
  {
    this.request_action = 'update_password';
    return this.send_post_request(data) ; 
  }

  fetch_commissions(data)
  {
    this.request_action = 'fetch_commission_listing_by_category';
    return this.send_post_request(data) ; 
  }
  add_topup(data)
  {
    this.request_action = 'add_topup_request';
    return this.send_post_request(data) ; 
  }
  fetch_topup_request(data)
  {
	 this.request_action = 'fetch_topup_request';
    return this.send_post_request(data) ;
  }
  fetch_complaints(data)
  {
    this.request_action = 'fetch_complaints_listing';
    return this.send_post_request(data) ;
  }
  fetch_complaint_info(data)
  {
    this.request_action = 'fetch_complaint_info';
    return this.send_post_request(data) ;
  }
  fetch_operators(data)
  {
	  this.request_action = 'fetch_operators';
    return this.send_post_request(data) ;
  }
  recharge_init(data)
  {
    this.service_url = this.server_url+'index.php?/app_recharge/';   
    this.request_action = 'recharge_init';
    return this.send_post_request(data) ;
  }
  recharge_handler(data)
  {
    this.service_url = this.server_url+'index.php?/app_recharge/';   
    this.request_action = 'recharge_handler';
    return this.send_post_request(data) ; 
  }
  fetch_history(data)
  {
    this.request_action = 'fetch_history';
    return this.send_post_request(data) ;
  }
  dashboard_content(data)
  {
    this.request_action = 'fetch_dashboard_content';
    return this.send_post_request(data) ;
  }
  paging_wallet_history(data)
  {
    this.request_action = 'paging_wallet_history';
    return this.send_post_request(data) ;
  }
  paging_order_history(data)
  {
    this.request_action = 'paging_order_history';
    return this.send_post_request(data) ;
  }
  paging_recharge_history(data)
  {
    this.request_action = 'paging_recharge_history';
    return this.send_post_request(data) ;
  }
  fetch_home_data(data)
  {
    this.request_action = 'fetch_home';
    return this.send_post_request(data) ;
  }
  get_filter_products(data)
  {
	  this.request_action = 'get_filter_products';
    return this.send_post_request(data) ;
  }
  fetch_checkout_data(data)
  {
    this.request_action = 'fetch_checkout_data';
    return this.send_post_request(data) ;
  }
  add_new_address(data)
  {
    this.request_action = 'add_new_address';
    return this.send_post_request(data) ;
  }
  edit_address(data)
  {
    this.request_action = 'edit_address';
    return this.send_post_request(data) ;
  }
  fetch_edit_address(data)
  {
    this.request_action = 'fetch_edit_address';
    return this.send_post_request(data) ;
  }
  fetch_remove_address(data)
  {
    this.request_action = 'fetch_remove_address';
    return this.send_post_request(data) ;
  }
  checkout_items(data)
  {
    this.request_action = 'checkout_items';
    return this.send_post_request(data) ;
  }
  signup(data)
  {
    this.request_action = 'signup';
    return this.send_post_request(data) ; 
  }
  verify_user(data)
  {
    this.request_action = 'verify_signup';
    return this.send_post_request(data) ; 
  }
  check_amount(data)
  {
    this.service_url = this.server_url+'index.php?/app_recharge/';
    this.request_action = 'check_amount';
    return this.send_post_request(data) ; 
  }
  fetch_order_status(data)
  {
    this.request_action = 'fetch_order_status';
    return this.send_post_request(data) ; 
  }
  fetch_recharge_order_status(data)
  {
    this.request_action = 'fetch_recharge_order_status';
    return this.send_post_request(data) ; 
  }
  fetch_product_categories(data)
  {
    this.request_action = 'fetch_product_categories';
    return this.send_post_request(data) ; 
  }
  fetch_product_quality(data)
  {
    this.request_action = 'fetch_product_quality';
    return this.send_post_request(data) ; 
  }
  fetch_products_plans(data)
  {
    this.request_action = 'fetch_products_plans';
    return this.send_post_request(data) ; 
  }
  fetch_products_by_plan(data)
  {
    this.request_action = 'fetch_products_by_plan';
    return this.send_post_request(data) ; 
  }
  calculate_tsk_margin(data)
  {
    this.request_action = 'calculate_tsk_margin';
    return this.send_post_request(data) ; 
  }
  book_dth_order(data)
  {
    this.request_action = 'book_dth_order';
    return this.send_post_request(data) ; 
  }
  fetch_review_data(data)
  {
    this.request_action = 'fetch_review_data';
    return this.send_post_request(data) ;
  }

  add_product_review(data)
  {
    this.request_action = 'add_product_review';
    return this.send_post_request(data) ; 
  }

  fetch_more_reviews(data)
  {
    this.request_action = 'fetch_more_reviews';
    return this.send_post_request(data) ;
  }

  export_all_orders(data)
  {
    this.request_action = 'export_all_orders';
    return this.send_post_request(data) ; 
  }
  export_all_recharges(data)
  {
    this.request_action = 'export_all_recharges';
    return this.send_post_request(data) ; 
  }
  proceed_to_reset(data)
  {
    this.request_action = 'proceed_to_reset';
    return this.send_post_request(data) ; 
  }
  reset_password(data)
  {
    this.request_action = 'reset_password';
    return this.send_post_request(data) ; 
  }
  fetch_booked_orders(data)
  {
    this.request_action = 'fetch_booked_orders';
    return this.send_post_request(data) ; 
  }
  resend_otp(data)
  {
    this.request_action = 'resend_otp';
    return this.send_post_request(data) ; 
  }
  get_search_data(data)
  {
    this.request_action = 'get_search_data';
    return this.send_post_request(data) ; 
  }
  track_record(data)
  {
    this.request_action = 'track_record';
    return this.send_post_request(data) ; 
  }
  fetch_page_data(data)
  {
    this.request_action = 'fetch_page_data';
    return this.send_post_request(data) ; 
  }
  apply_package(data)
  {
    this.request_action = 'apply_package';
    return this.send_post_request(data) ; 
  }

  save_contact_form (data)
  {
    this.request_action = 'save_contact_form';
    return this.send_post_request(data) ; 
  }
  subscribe_newsletters(data)
  {
    this.request_action = 'subscribe_newsletters';
    return this.send_post_request(data) ;
  }
  save_faqs_form(data)
  {
    this.request_action = 'save_faqs_form';
    return this.send_post_request(data) ;
  }
  fetch_promocode(data)
  {
    this.request_action = 'fetch_promocode';
    return this.send_post_request(data) ;
  }
  apply_promo_code(data)
  {
    this.request_action = 'apply_promo_code';
    return this.send_post_request(data) ;
  }
  check_if_recharge_exist(data)
  {
    this.request_action = 'check_if_recharge_exist';
    return this.send_post_request(data) ;
  }
  product_categories()
  {
    let data = {};
    this.request_action = 'product_categories';
    return this.send_post_request(data) ;
  }
  channel_category_by_circle(data)
  {
    this.request_action = 'channel_category_by_circle';
    return this.send_post_request(data) ;
  }
}
