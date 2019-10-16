import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Headers,Http } from '@angular/http';
import { AuthService } from './auth.service';
import {Pages} from './pages';
import { User} from './user';
//import { Recharge} from './recharge-entities';
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
          //console.log(data);
          if(data.status == 'Invalid Token')
          {                                                     
            this.authservice.clear_session();
            this.router.navigate(['/login']);
          }
          this.set_user_data(data.USER);
          let storeddata = JSON.parse(localStorage.getItem('app_token'));
          if(storeddata != null)
          {
            storeddata.user = data.USER; 
            localStorage.setItem('app_token',JSON.stringify(storeddata));
          } 
          
        }
      )  
    }
    else
    {
      this.authservice.clear_session();
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
    //console.log(this.get_user().user_type);
    if(this.get_user() != null)
      return this.get_user().user_type;
    else
      return '';  
  }

  set_user_data(data)
  {
      this.user.storage =  data;
  }

  get_user_wallet()
  {
    if(this.get_user() != null)
      return this.get_user().wallet;
    else
      return '';
  }

  get_user_wallet_amount()
  {
    if(this.get_user() != null)
      return Number(this.get_user_wallet().replace(/\,/g,""));
    else
      return 0;
  }


  get_user_phone()
  {
    if(this.get_user() != null)
      return this.get_user().phone;
    else
      return '';  
  }

  get_user()
  {
    //return this.user.storage;
    let data = JSON.parse(localStorage.getItem('app_token'));
    if(data != null)
    {
      //console.log(this.user)
      return data.user; 
    } 
    return null; 
  }

  get_user_name()
  {
    let data = JSON.parse(localStorage.getItem('app_token'));
    if(data != null)
    {
      return data.user.name; 
    } 
    return ''; 
  }

  get_user_avatar()
  {
    let data = JSON.parse(localStorage.getItem('app_token'));
    if(data != null)
    {
      return data.user.avatar; 
    } 
    return ''; 
  }
  
  get_user_email()
  {
    let data = JSON.parse(localStorage.getItem('app_token'));
    if(data != null)
    {
      return data.user.email; 
    } 
    return ''; 
  }

  get_user_id()
  {
    if(this.get_user() != null)
      return this.get_user().id;
    else
      return '';  
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

  get_recharge()
  {
    let data = JSON.parse(localStorage.getItem('recharge_cart'));
    if(data != null)
    {
      return data; 
    } 
    return null; 
  }

  public set_recharge(storage_name,content:Object) {
    localStorage.setItem(storage_name, JSON.stringify(content));
  }

  send_post_request(data,url) : Observable<any>
  {
    var Headers_of_api = new Headers({
      'Content-Type' : 'application/x-www-form-urlencoded'
    });
    return this.http.post(url,data,{headers: Headers_of_api})
    .map(res => res.json());
  }
  fetch_user_info(data)
  {
    
    let url = this.server_url+'index.php?/app_services/fetch_user_info';
    return this.send_post_request(data,url) ; 
  }

  fetch_qr_user(data)
  {
    let url = this.server_url+'index.php?/app_services/fetch_qr_user_info';
    return this.send_post_request(data,url) ; 
  }
  
  fetch_user_notifications(data)
  {
    let url = this.server_url+'accounts/apis/home/notifications';
    return this.send_post_request(data,url) ; 
  }
  user_favourites(data)
  {
    let url = this.server_url+'accounts/apis/product/user_favourites';
    return this.send_post_request(data,url) ; 
  }
  remove_favourites(data)
  {
    let url = this.server_url+'accounts/apis/product/remove_favourites';
    return this.send_post_request(data,url) ;
  }

  get_operator_api_id(data)
  {
    let url = this.server_url+'accounts/apis/home/get_operator_api_id';
    return this.send_post_request(data,url) ; 
  }

  send_value(data)
  {
    let url = this.server_url+'index.php?/app_services/send_value_to_wallet';
    return this.send_post_request(data,url) ; 
  }
  manage_account_info(data)
  {
    
    let url = this.server_url+'index.php?/app_services/manage_account_info';
    return this.send_post_request(data,url) ; 
  }
  update_account(data)
  {
    
    let url = this.server_url+'index.php?/app_services/update_account_info';
    return this.send_post_request(data,url) ; 
  }
  update_password(data)
  {
    
    let url = this.server_url+'index.php?/app_services/update_password';
    return this.send_post_request(data,url) ; 
  }

  fetch_commissions(data)
  {
    
    let url = this.server_url+'index.php?/app_services/fetch_commission_listing_by_category';
    return this.send_post_request(data,url) ; 
  }
  add_topup(data)
  {
    
    let url = this.server_url+'index.php?/app_services/add_topup_request';
    return this.send_post_request(data,url) ; 
  }
  fetch_topup_request(data)
  {
   
   let url = this.server_url+'index.php?/app_services/fetch_topup_request';
    return this.send_post_request(data,url) ;
  }
  
  
  fetch_operators(data)
  {
    let url = this.server_url+'index.php?/app_services/fetch_operators';
    return this.send_post_request(data,url) ;
  }
  recharge_init(data)
  {
    let url = this.server_url+'index.php?/app_recharge/recharge_init'; 
    return this.send_post_request(data,url) ;
  }
  recharge_handler(data)
  {
    let url = this.server_url+'index.php?/app_recharge/recharge_handler'; 
    return this.send_post_request(data,url) ; 
  }
  
  fetch_history(data)
  {
    let url = this.server_url+'index.php?/app_services/fetch_history';
    return this.send_post_request(data,url) ;
  }
  dashboard_content(data)
  {
    let url = this.server_url+'index.php?/app_services/fetch_dashboard_content';
    return this.send_post_request(data,url) ;
  }
  paging_wallet_history(data)
  {
    let url = this.server_url+'index.php?/app_services/paging_wallet_history';
    return this.send_post_request(data,url) ;
  }
  paging_order_history(data)
  {
    let url = this.server_url+'index.php?/app_services/paging_order_history';
    return this.send_post_request(data,url) ;
  }
  
  fetch_home_data(data)
  {
    let url = this.server_url+'index.php?/app_services/fetch_home';
    return this.send_post_request(data,url) ;
  }
  get_filter_products(data)
  {
    let url = this.server_url+'index.php?/app_services/get_filter_products';
    return this.send_post_request(data,url) ;
  }
  fetch_checkout_data(data)
  {
    let url = this.server_url+'index.php?/app_services/fetch_checkout_data';
    return this.send_post_request(data,url) ;
  }
  
  edit_address(data)
  {
    let url = this.server_url+'index.php?/app_services/edit_address';
    return this.send_post_request(data,url) ;
  }
  fetch_edit_address(data)
  {
    let url = this.server_url+'index.php?/app_services/fetch_edit_address';
    return this.send_post_request(data,url) ;
  }
  fetch_remove_address(data)
  {
    let url = this.server_url+'index.php?/app_services/fetch_remove_address';
    return this.send_post_request(data,url) ;
  }
  checkout_items(data)
  {
    let url = this.server_url+'index.php?/app_services/checkout_items';
    return this.send_post_request(data,url) ;
  }
  signup(data)
  {
    let url = this.server_url+'index.php?/app_services/signup';
    return this.send_post_request(data,url) ; 
  }
  verify_user(data)
  {
    let url = this.server_url+'index.php?/app_services/verify_signup';
    return this.send_post_request(data,url) ; 
  }
  check_amount(data)
  {
    let url = this.server_url+'index.php?/app_recharge/check_amount';
    return this.send_post_request(data,url) ; 
  }
  fetch_order_status(data)
  {
    let url = this.server_url+'index.php?/app_services/fetch_order_status';
    return this.send_post_request(data,url) ; 
  }
  fetch_recharge_order_status(data)
  {
    let url = this.server_url+'index.php?/app_services/fetch_recharge_order_status';
    return this.send_post_request(data,url) ; 
  }
  fetch_product_categories(data)
  {
    let url = this.server_url+'index.php?/app_services/fetch_product_categories';
    return this.send_post_request(data,url) ; 
  }
  fetch_product_quality(data)
  {
    let url = this.server_url+'index.php?/app_services/fetch_product_quality';
    return this.send_post_request(data,url) ; 
  }
  fetch_products_plans(data)
  {
    let url = this.server_url+'index.php?/app_services/fetch_products_plans';
    return this.send_post_request(data,url) ; 
  }
  fetch_products_by_plan(data)
  {
    let url = this.server_url+'index.php?/app_services/fetch_products_by_plan';
    return this.send_post_request(data,url) ; 
  }
  calculate_tsk_margin(data)
  {
    let url = this.server_url+'index.php?/app_services/calculate_tsk_margin';
    return this.send_post_request(data,url) ; 
  }
  book_dth_order(data)
  {
    let url = this.server_url+'index.php?/app_services/book_dth_order';
    return this.send_post_request(data,url) ; 
  }
  fetch_review_data(data)
  {
    
    let url = this.server_url+'index.php?/app_services/fetch_review_data';
    return this.send_post_request(data,url) ;
  }

  add_product_review(data)
  {
    
    let url = this.server_url+'index.php?/app_services/add_product_review';
    return this.send_post_request(data,url) ; 
  }

  fetch_more_reviews(data)
  {
    
    let url = this.server_url+'index.php?/app_services/fetch_more_reviews';
    return this.send_post_request(data,url) ;
  }

  export_all_orders(data)
  {
    
    let url = this.server_url+'index.php?/app_services/export_all_orders';
    return this.send_post_request(data,url) ; 
  }
  export_all_recharges(data)
  {
    
    let url = this.server_url+'index.php?/app_services/export_all_recharges';
    return this.send_post_request(data,url) ; 
  }
  proceed_to_reset(data)
  {
    
    let url = this.server_url+'index.php?/app_services/proceed_to_reset';
    return this.send_post_request(data,url) ; 
  }
  reset_password(data)
  {
    
    let url = this.server_url+'index.php?/app_services/reset_password';
    return this.send_post_request(data,url) ; 
  }
  fetch_booked_orders(data)
  {
    
    let url = this.server_url+'index.php?/app_services/fetch_booked_orders';
    return this.send_post_request(data,url) ; 
  }
  resend_otp(data)
  {
    
    let url = this.server_url+'index.php?/app_services/resend_otp';
    return this.send_post_request(data,url) ; 
  }
  get_search_data(data)
  {
    
    let url = this.server_url+'index.php?/app_services/get_search_data';
    return this.send_post_request(data,url) ; 
  }
  track_record(data)
  {
    
    let url = this.server_url+'index.php?/app_services/track_record';
    return this.send_post_request(data,url) ; 
  }
  fetch_page_data(data)
  {
    
    let url = this.server_url+'index.php?/app_services/fetch_page_data';
    return this.send_post_request(data,url) ; 
  }
  apply_package(data)
  {
    
    let url = this.server_url+'index.php?/app_services/apply_package';
    return this.send_post_request(data,url) ; 
  }

  save_contact_form (data)
  {
    
    let url = this.server_url+'index.php?/app_services/save_contact_form';
    return this.send_post_request(data,url) ; 
  }
  subscribe_newsletters(data)
  {
    
    let url = this.server_url+'index.php?/app_services/subscribe_newsletters';
    return this.send_post_request(data,url) ;
  }
  save_faqs_form(data)
  {
    
    let url = this.server_url+'index.php?/app_services/save_faqs_form';
    return this.send_post_request(data,url) ;
  }
  fetch_promocode(data)
  {
    
    let url = this.server_url+'index.php?/app_services/fetch_promocode';
    return this.send_post_request(data,url) ;
  }
  apply_promo_code(data)
  {
    
    let url = this.server_url+'accounts/apis/offers/apply_promo_code';
    return this.send_post_request(data,url) ;
  }
  check_if_recharge_exist(data)
  {
    
    let url = this.server_url+'index.php?/app_services/check_if_recharge_exist';
    return this.send_post_request(data,url) ;
  }
  product_categories()
  {
    let data = {};
    let url = this.server_url+'index.php?/app_services/product_categories';
    return this.send_post_request(data,url) ;
  }
  channel_category_by_circle(data)
  {
    
    let url = this.server_url+'index.php?/app_services/channel_category_by_circle';
    return this.send_post_request(data,url) ;
  }

  fetch_blogs(data)
  {
    
    let url = this.server_url+'index.php?/app_services/fetch_blogs';
    return this.send_post_request(data,url) ;
  }
  fetch_blogs_by_category(data)
  {
    
    let url = this.server_url+'index.php?/app_services/fetch_blogs_by_category';
    return this.send_post_request(data,url) ;
  }
  fetch_single_blog(data)
  {
    
    let url = this.server_url+'index.php?/app_services/fetch_single_blog';
    return this.send_post_request(data,url) ;
  }
  submit_comment(data)
  {
    
    let url = this.server_url+'index.php?/app_services/submit_comment';
    return this.send_post_request(data,url) ;
  }

  get_plans(data)
  {
    let url = this.server_url+'accounts/apis/plan_api/plans';
    return this.send_post_request(data,url) ;
  }

  faqs_list(data)
  {
    let url = this.server_url+'accounts/apis/home/faqs_list';
    return this.send_post_request(data,url) ;
  }
  print_faq(data)
  {
    let url = this.server_url+'accounts/apis/home/single_faq';
    return this.send_post_request(data,url) ;
  }
 
  fetch_pack_by_month(data)
  {
    let url = this.server_url+'accounts/apis/product/fetch_pack_by_month';
    return this.send_post_request(data,url) ; 
  }
  fetch_bot_list(data)
  {
    let url = this.server_url+'accounts/apis/home/fetch_bot_list';
    return this.send_post_request(data,url) ; 
  }
  defalut_queries(data)
  {
    let url = this.server_url+'accounts/apis/page/default_queries';
    return this.send_post_request(data,url) ; 
  }

  send_feed(data)
  {
    let url = this.server_url+'accounts/apis/home/send_feed';
    return this.send_post_request(data,url) ;
  }

  fetch_recharge_history(data)
  {
    let url = this.server_url+'accounts/apis/orders/fetch_recharge_history';
    return this.send_post_request(data,url) ;
  }

  paging_recharge_history(data)
  {
    let url = this.server_url+'accounts/apis/orders/paging_recharge_history';
    return this.send_post_request(data,url) ;
  }

  fetch_orders_history(data)
  {
    let url = this.server_url+'accounts/apis/orders/fetch_orders_history';
    return this.send_post_request(data,url) ;
  }
  paging_orders_history(data)
  {
    let url = this.server_url+'accounts/apis/orders/paging_orders_history';
    return this.send_post_request(data,url) ;
  }
  fetch_transaction_history(data)
  {
    let url = this.server_url+'accounts/apis/orders/fetch_transaction_history';
    return this.send_post_request(data,url) ;
  }
  
  paging_transaction_history(data)
  {
    let url = this.server_url+'accounts/apis/orders/paging_transaction_history';
    return this.send_post_request(data,url) ;
  }
  export_recharge(data)
  {
    let url = this.server_url+'accounts/apis/export/export_recharge';
    return this.send_post_request(data,url) ;
  }
  export_dth_orders(data)
  {
    let url = this.server_url+'accounts/apis/export/export_dth_orders';
    return this.send_post_request(data,url) ;
  }
  fetch_recent_orders(data)
  {
    let url = this.server_url+'accounts/apis/orders/fetch_recent_orders';
    return this.send_post_request(data,url) ;
  }

  fetch_transactions(data)
  {
    let url = this.server_url+'accounts/apis/orders/fetch_transactions';
    return this.send_post_request(data,url) ;
  }
  add_complaint(data)
  {
    let url = this.server_url+'accounts/apis/orders/add_complaint';
    return this.send_post_request(data,url) ;
  }
  fetch_complaints(data)
  {
    
    let url = this.server_url+'accounts/apis/orders/fetch_complaints_listing';
    return this.send_post_request(data,url) ;
  }

  fetch_complaint_info(data)
  {
    
    let url = this.server_url+'accounts/apis/orders/fetch_complaint_info';
    return this.send_post_request(data,url) ;
  }
  search_pincode(data)
  {
    
    let url = this.server_url+'accounts/apis/product/search_pincode';
    return this.send_post_request(data,url) ;
  }
  search_product_pincode(data)
  {
    
    let url = this.server_url+'accounts/apis/product/search_product_pincode';
    return this.send_post_request(data,url) ;
  }
  add_new_address(data)
  {
    let url = this.server_url+'index.php?/app_services/add_new_address';
    return this.send_post_request(data,url) ;
  }
  reg_address(data)
  {
    let url = this.server_url+'index.php?/app_services/reg_address';
    return this.send_post_request(data,url) ;
  }
  fetch_testimonials(data)
  {
    let url = this.server_url+'accounts/apis/page/testimonials';
    return this.send_post_request(data,url) ;
  }
  upload_avatar(data)
  {
    let url = this.server_url+'accounts/apis/home/upload_avatar';
    return this.send_post_request(data,url) ;
  }
  fetch_package_data(data)
  {
    let url = this.server_url+'accounts/apis/product/fetch_package_by_category';
    return this.send_post_request(data,url) ;
  }
  share_channel_pack_on_mail(data)
  {
    let url = this.server_url+'accounts/apis/product/share_channel_pack_on_mail';
    return this.send_post_request(data,url) ;
  }
  get_faqs_search_keywords(data)
  {
    let url = this.server_url+'accounts/apis/page/get_faqs_search_keywords';
    return this.send_post_request(data,url) ;
  }
  search_faqs_list(data)
  {
    let url = this.server_url+'accounts/apis/page/get_faqs_search_list';
    return this.send_post_request(data,url) ;
  }
}
