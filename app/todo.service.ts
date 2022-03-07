import { Injectable } from '@angular/core';
import { Router} from '@angular/router';
import { Observable } from 'rxjs';
import { fromEvent, merge ,Observer,of } from 'rxjs';
import { map, filter, pairwise } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { Meta ,Title} from '@angular/platform-browser';

// import { Headers,Http } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Pages } from './pages';
import { User } from './user';
//import { Recharge} from './recharge-entities';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
declare var window : any;

@Injectable()
export class TodoService {

  public server_url : string = "https://www.libanz.com/";
  public base_url : string = 'https://www.libanz.com/';
  public request_action = "proceed_recharge";
  public current_url : string;
  public footer : boolean = true;
  public page_data : Pages | undefined;
  public page : Pages | undefined;
  public footer_data : Pages | undefined;
  public previousUrl: string | undefined;
  public currnetURL : string | undefined;
  public cartItems : any;
  public back_link : any = '';
  private storage: Storage;
  public dropdown_add_money = {paymethod: '',paybankaccount:'',yourbankname : '' };
  public login_urls : any = ['/book-order','/booked-order-list','/recharge-status','/order-status',
  '/manage-account','/transaction-history','/commission-structure','/topup-request','/add-money',
  '/complaints','/manage-retailer','/value-transfer','/dashboard','/checkout']; 
  public page_data_urls : any = ['/mobile-postpaid','mobile'];
  constructor(private http : HttpClient,private meta : Meta,private title : Title,private sanitizer : DomSanitizer, private router : Router ,public user : User,private authservice : AuthService)
  {
    // AppComponent.isBrowser.subscribe(isBrowser => {
    //   if (isBrowser) {
    //     this.storage = localStorage;
    //   }
    // });
    // window.scrollTo(0, 0);
    this.current_url = this.router.url;
    this.createOnline$().subscribe(isOnline  => 
    {
      if(isOnline == false)
      {
        return;
      }
    } 
    );
  }
  length!: number;

  // key(index: number) {
  //   return this.storage.key(index);
  // }

  payment_template($status : any)
  {
    if($status == 1)
      return '<span class="green darken-1 padd1 white-text"> Success </span>';
    else if($status == 2)
      return '<span class="red darken-1 white-text padd1"> Failed </span>';
    else
      return '<span class="orange darken-1 white-text padd1"> Pending </span>';	
  }

  paymethod_template($method :any)
  {
    if($method == 1)
      return '<span class="orange darken-1 order-status white-text padd1"> Wallet </span>';
    else if($method == 2)
      return '<span class="blue-grey darken-3 white-text order-status padd1"> Gateway </span>';
    else if($method == 3)
      return '<span class="orange darken-3 white-text order-status padd1"> Libanz </span>';
    else if($method == 4)
      return '<span class="blue darken-3 white-text order-status padd1"> Paytm </span>';
    else if($method == 5)
      return '<span class="teal darken-3 white-text order-status padd1"> COD </span>';
    else 
      return '';  	
  }

  back_icon_template($title : string, $url : string)
  {
    let a = document.createElement('div');
    a.setAttribute("class", "bredcum-inner");

    let b = document.createElement('div');
    b.setAttribute("class", "left bredcum-top");
    
    let c = document.createElement('a');
    c.setAttribute("class", "bredcum-title");
    // c.id = "previous-event";
    c.text =  $title;
    b.appendChild(c);
    
    let b2 = document.createElement('div');
    b2.setAttribute("class", "right");
    b2.id =  "link-this";
    window.me = this;
    // b2.addEventListener('click', e => {
    //   console.log(1);
    //   window.me.router.navigate(['/product/cart']);
    // });
  

    let c2 = document.createElement('a');
    c2.id ="cart-strip-anchor";
    // c2.setAttribute("href", "/product/cart");
    
    let d2 = document.createElement('img');
    d2.setAttribute("src", 'https://www.libanz.com/web-app/assets/images/cart.png');

    let e2 = document.createElement('span');
    e2.setAttribute("class", "strip-circle");
    e2.id = "cart-count-mobile";
    e2.innerText = this.cartItemsCount();
    
    b2.appendChild(c2);
    c2.appendChild(d2);
    c2.appendChild(e2);

    a.appendChild(b);
    a.appendChild(b2);

    this.back_link = a.outerHTML;
    // console.log(this.back_link);

      setTimeout(function(){
      
        $('.cst-back').delegate('.bredcum-title','click',function(){
          if(window.location.href.includes('/recharge/'))
            window.me.router.navigate(['/']);
          else
            window.history.go(-1);  
        });
        
        $('.cst-back').delegate('#cart-strip-anchor,.right a','click',function(){
          window.me.router.navigate(['/product/cart']);
        });
  
      }, 2000);
      
    return this.back_link;
  }

  back(step) 
  {
    return 'previous';
    return window.history.go(-step);
  }

  addmoney_paymethod_template($method : number )
  {
      if($method == 1)
      return '<span class="orange darken-1 order-status white-text padd1"> Wallet to Wallet</span>';
    else if($method == 2)
      return '<span class="blue-grey darken-3 white-text order-status padd1"> Gateway to Wallet</span>';
    else if($method == 3)
      return '<span class="orange darken-3 white-text order-status padd1"> Libanz to Wallet</span>';
    else if($method == 4)
      return '<span class="blue darken-3 white-text order-status padd1"> Paytm to Wallet</span>';
    else if($method == 5)
      return '<span class="teal darken-3 white-text order-status padd1"> COD to Wallet</span>';
    else return '';  	
  }
  order_template($status :string)
  {
    if($status == 'Booked')
		return '<span class="padd1 teal darken-1 white-text"> '+$status+' </span>';
	  else if($status == 'Received')
		return '<span class="padd1 light-blue darken-1 white-text"> '+$status+' </span>';
	else if($status == 'Incomplete')
		return '<span class="padd1 orange accent-3 white-text"> '+$status+' </span>';
	else if($status == 'OnHold')
		return '<span class="padd1 purple darken-1 white-text"> '+$status+' </span>';
	else if($status == 'Delivered')
		return '<span class="padd1 green darken-1 white-text"> '+$status+' </span>';
	else if(status.toLowerCase() == 'closed')
		return '<span class="padd1 blue-grey darken-1 white-text"> '+$status+' </span>';
	else if($status.toLowerCase() == 'cancel')
		return '<span class="padd1 pink darken-1 white-text"> '+$status+' </span>';
	else if($status == 'Cancelled' || $status.toLowerCase() == 'failed')
		return '<span class="padd1 red darken-1 white-text"> '+$status+' </span>';
	else if($status == 'Success' || $status == 'Successful')  // for recharge  
		return '<span class="padd1 green darken-1 white-text"> '+$status+' </span>';
	else if($status.toLowerCase() == 'pending')  // for recharge  
		return '<span class="padd1 orange darken-1 white-text"> '+$status+' </span>';	
	else if(status.toLowerCase() == 'refund')  // for recharge  
    return '<span class="padd1 lime darken-1 white-text"> '+$status+' </span>';
	else // for recharge  
		return '<span class="padd1 lime darken-1 white-text"> '+$status+' </span>';	
  }

  createOnline$() {
    return merge<boolean>(
      fromEvent(window, 'offline').pipe(map(() => false)),
      fromEvent(window, 'online').pipe(map(() => true)),
      new Observable((sub: Observer<boolean>) => {
        sub.next(navigator.onLine);
        sub.complete();
    }));
  }

  get_user_data()
  {
    if(this.get_token())
    {
      this.fetch_user_info({token: this.get_token()})
      .subscribe(
        (        data: { status: string; USER: any; })  => 
        {
          //console.log(data : any);
          if(data.status == 'Invalid Token')
          {                                                     
            this.authservice.clear_session();
            this.router.navigate(['/proceed/login']);
          }
          this.set_user_data(data.USER);
          let storeddata : any = JSON.parse( localStorage.getItem('app_token') || '{}');
          if( storeddata != null )
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

  onTap(url : string)
  {
    this.router.navigate([url]);
  }
  get_param(name : string)
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

  set_urls(url : string)
  {
    let urls = {previousUrl : url[0],currnetURL : url[1]};
    localStorage.setItem('urls',JSON.stringify(urls));
  }

  get_urls()
  {
    let urls = JSON.parse(localStorage.getItem('urls') || '{}');
    if(urls != null)
    {
      return urls; 
    } 
    return null; 
  }
  
  get_days_left() 
  {
    //console.log(this.get_user().user_type);
    if(this.get_user() != null)
      return Number(this.get_user().days_left);
    else
      return 0;  
  }

  is_subscribed_lead() 
  {
    //console.log(this.get_user().user_type);
    if(this.get_user() != null)
      return Number(this.get_user().is_lead_subscriber);
    else
      return 0;  
  }

  get_active_pack()
  {
    if(this.get_user() != null)
      return this.get_user().pack_active;
    else
      return '';  
  }

  set_user_data(data : any)
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

  get_lead_subscription()
  {
    if(this.get_user() != null)
      return this.get_user().is_lead_subscriber;
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

  get_user_recharge_amount()
  {
    if(this.get_user().recharge_bonus_wallet == 0)
      return 0;
    if(this.get_user() != null)
      return Number(this.get_user().recharge_bonus_wallet.replace(/\,/g,""));
    else
      return 0;
  }

  get_user_product_amount()
  {
    if(this.get_user().product_bonus_wallet == 0)
      return 0;
    if(this.get_user() != null)
      return Number(this.get_user().product_bonus_wallet.replace(/\,/g,""));
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
    let data = JSON.parse(localStorage.getItem('app_token') || '{}');
    
    if(data != null)
    {
      //console.log(this.user)
      return data.user; 
    } 
    return null; 
  }

  get_user_name() 
  {
    if(this.get_user() != null)
    {
      return this.get_user().name; 
    } 
    return ''; 
  }
  cartItemsCount() 
  {
    if(localStorage.getItem('favourite') != null)
    {
      let cart :any = JSON.parse(localStorage.getItem('favourite') || '{}');
      this.cartItems = cart.items.filter((item: { type: number; }) => item.type == 1);;
      this.cartItems =  Object.keys(this.cartItems).length;
      return this.cartItems;
    }
    return 0;
  }

  get_user_avatar()
  {
    let data = JSON.parse(localStorage.getItem('app_token') || '{}');
    if(data != null)
    {
      if(data.user)
        return data.user.avatar;   
    } 
    return ''; 
  }

  get_user_characters()
  {
    let data = JSON.parse(localStorage.getItem('app_token') || '{}');
    if(data != null)
    {
      return data.user.capital_chars; 
    } 
    return ''; 
  }
  
  get_user_email()
  {
    let data = JSON.parse(localStorage.getItem('app_token') || '{}');
    //console.log(data)
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

  set_page_data(data : any)
  {
    // let b = JSON.stringify(data);
    // this.page =  JSON.parse(b.replace(/\\/g, ''));
    this.page =  data;
  }

  set_footer_data(data : any)
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
    let data = JSON.parse(localStorage.getItem('recharge_cart') || '{}');
    if(data != null)
    {
      return data; 
    } 
    return null; 
  }

  public set_data(storage_name : any,content:Object) {
    localStorage.setItem(storage_name, JSON.stringify(content));
  }

  public set_recharge(storage_name : any,content:Object) {
    localStorage.setItem(storage_name, JSON.stringify(content));
  }

  send_post_request(data : any,url : string) : Observable<any>
  {
    var Headers_of_api = new HttpHeaders({
      'Content-Type' : 'application/x-www-form-urlencoded'
    });
    return this.http.post( url, data, { headers: Headers_of_api } )
    .map(res => res)
    .catch(this.handleError);
  }

  private handleError(error: Response) { 
    //alert("Something Wrong.");
    console.error(error); 
    // $('.spinner-wrapper').hide();
    return Observable.throw(error.json()); 
 }
  fetch_user_info(data : any)
  {
    
    let url = this.server_url+'accounts/apis/home/fetch_user_info';
    return this.send_post_request(data,url) ; 
  }

  fetch_qr_user(data : any)
  {
    let url = this.server_url+'accounts/apis/home/fetch_qr_user_info';
    return this.send_post_request(data,url) ; 
  }
  
  fetch_user_notifications(data : any)
  {
    let url = this.server_url+'accounts/apis/home/notifications';
    return this.send_post_request(data,url) ; 
  }
  notification_read(data : any)
  {
    let url = this.server_url+'accounts/apis/home/notification_read';
    return this.send_post_request(data,url) ; 
  }
  user_favourites(data : any)
  {
    let url = this.server_url+'accounts/apis/product/user_favourites';
    return this.send_post_request(data,url) ; 
  }
  remove_favourites(data : any)
  {
    let url = this.server_url+'accounts/apis/product/remove_favourites';
    return this.send_post_request(data,url) ;
  }

  clear_cart(data : any)
  {
    let url = this.server_url+'accounts/apis/product/clear_cart';
    return this.send_post_request(data,url) ;
  }

  get_operator_api_id(data : any)
  {
    let url = this.server_url+'accounts/apis/home/get_operator_api_id';
    return this.send_post_request(data,url) ; 
  }

  send_value(data : any)
  {
    let url = this.server_url+'accounts/apis/home/send_value_to_wallet';
    return this.send_post_request(data,url) ; 
  }
  manage_account_info(data : any)
  {
    
    let url = this.server_url+'accounts/apis/home/manage_account_info';
    return this.send_post_request(data,url) ; 
  }
  update_account(data : any)
  {
    
    let url = this.server_url+'index.php?/app_services/update_account_info';
    return this.send_post_request(data,url) ; 
  }
  update_password(data : any)
  {
    
    let url = this.server_url+'accounts/apis/home/update_password';
    return this.send_post_request(data,url) ; 
  }

  fetch_commissions(data : any)
  {
    let url = this.server_url+'accounts/apis/home/fetch_commission_listing_by_category';
    return this.send_post_request(data,url) ; 
  }

  add_topup(data : any)
  {
    let url = this.server_url+'accounts/apis/orders/add_topup_request';
    return this.send_post_request(data,url) ; 
  }
  fetch_topup_request(data : any)
  {
   
   let url = this.server_url+'accounts/apis/orders/fetch_topup_request';
    return this.send_post_request(data,url) ;
  }
  
  
  fetch_operators(data : any)
  {
    let url = this.server_url+'accounts/apis/home/fetch_operators';
    return this.send_post_request(data,url) ;
  }
  recharge_init(data : any)
  {
    let url = this.server_url+'accounts/apis/recharge/recharge_init'; 
    return this.send_post_request(data,url) ;
  }
  check_operator(data : any)
  {
    let url = this.server_url+'accounts/apis/recharge/check_operator'; 
    return this.send_post_request(data,url) ;
  }
  recharge_handler(data : any)
  {
    let url = this.server_url+'accounts/apis/recharge/recharge_handler'; 
    return this.send_post_request(data,url) ; 
  }

  fetch_dthorder_id(data : any)
  {
    let url = this.server_url+'accounts/apis/recharge/fetch_dthorder_id'; 
    return this.send_post_request(data,url) ; 
  }

  
  fetch_history(data : any)
  {
    let url = this.server_url+'index.php?/app_services/fetch_history';
    return this.send_post_request(data,url) ;
  }
  dashboard_content(data : any)
  {
    let url = this.server_url+'index.php?/app_services/fetch_dashboard_content';
    return this.send_post_request(data,url) ;
  }
  paging_wallet_history(data : any)
  {
    let url = this.server_url+'index.php?/app_services/paging_wallet_history';
    return this.send_post_request(data,url) ;
  }
  paging_order_history(data : any)
  {
    let url = this.server_url+'index.php?/app_services/paging_order_history';
    return this.send_post_request(data,url) ;
  }
  
  fetch_home_data(data : any)
  {
    let url = this.server_url+'accounts/apis/home/fetch_home';
    return this.send_post_request(data,url) ;
  }
  get_filter_products(data : any)
  {
    let url = this.server_url+'accounts/apis/product/get_filter_products';
    return this.send_post_request(data,url) ;
  }
  if_phone_registered(data : any)
  {
    let url = this.server_url+'accounts/apis/product/if_phone_registered';
    return this.send_post_request(data,url) ;
  }
  fetch_checkout_data(data : any)
  {
    let url = this.server_url+'accounts/apis/product/fetch_checkout_data';
    return this.send_post_request(data,url) ;
  }
  
  // edit_address(data : any)
  // {
  //   let url = this.server_url+'index.php?/app_services/edit_address';
  //   return this.send_post_request(data,url) ;
  // }
  // fetch_edit_address(data)
  // {
  //   let url = this.server_url+'index.php?/app_services/fetch_edit_address';
  //   return this.send_post_request(data,url) ;
  // }
  // fetch_remove_address(data)
  // {
  //   let url = this.server_url+'index.php?/app_services/fetch_remove_address';
  //   return this.send_post_request(data,url) ;
  // }
  checkout_items(data : any)
  {
    let url = this.server_url+'accounts/apis/orders/checkout_items';
    return this.send_post_request(data,url) ;
  }
  
  signup(data : any)
  {
    let url = this.server_url+'accounts/apis/home/update_signup_details';
    return this.send_post_request(data,url) ; 
  }
  check_phone(data : any)
  {
    let url = this.server_url+'accounts/apis/home/check_phone';
    return this.send_post_request(data,url) ; 
  }
  verify_user(data : any)
  {
    let url = this.server_url+'accounts/apis/home/verify_signup';
    return this.send_post_request(data,url) ; 
  }
  check_amount(data : any)
  {
    let url = this.server_url+'accounts/apis/recharge/check_amount';
    return this.send_post_request(data,url) ; 
  }
  fetch_order_status(data : any)
  {
    let url = this.server_url+'accounts/apis/orders/fetch_order_status';
    return this.send_post_request(data,url) ; 
  }
  fetch_recharge_order_status(data : any)
  {
    let url = this.server_url+'accounts/apis/recharge/fetch_recharge_order_status';
    return this.send_post_request(data,url) ; 
  }
  fetch_product_categories(data : any)
  {
    let url = this.server_url+'index.php?/app_services/fetch_product_categories';
    return this.send_post_request(data,url) ; 
  }
  fetch_product_quality(data : any)
  {
    let url = this.server_url+'index.php?/app_services/fetch_product_quality';
    return this.send_post_request(data,url) ; 
  }
  fetch_products_plans(data : any)
  {
    let url = this.server_url+'index.php?/app_services/fetch_products_plans';
    return this.send_post_request(data,url) ; 
  }
  fetch_products_by_plan(data : any)
  {
    let url = this.server_url+'index.php?/app_services/fetch_products_by_plan';
    return this.send_post_request(data,url) ; 
  }
  calculate_tsk_margin(data : any)
  {
    let url = this.server_url+'index.php?/app_services/calculate_tsk_margin';
    return this.send_post_request(data,url) ; 
  }
  book_dth_order(data : any)
  {
    let url = this.server_url+'index.php?/app_services/book_dth_order';
    return this.send_post_request(data,url) ; 
  }
  fetch_review_data(data : any)
  {
    
    let url = this.server_url+'accounts/apis/product/fetch_review_data';
    return this.send_post_request(data,url) ;
  }

  add_product_review(data : any)
  {
    
    let url = this.server_url+'accounts/apis/product/add_product_review';
    return this.send_post_request(data,url) ; 
  }

  fetch_more_reviews(data : any)
  {
    
    let url = this.server_url+'accounts/apis/product/fetch_more_reviews';
    return this.send_post_request(data,url) ;
  }

  export_all_orders(data : any)
  {
    
    let url = this.server_url+'index.php?/app_services/export_all_orders';
    return this.send_post_request(data,url) ; 
  }
  export_all_recharges(data : any)
  {
    
    let url = this.server_url+'index.php?/app_services/export_all_recharges';
    return this.send_post_request(data,url) ; 
  }
  proceed_to_reset(data : any)
  {
    
    let url = this.server_url+'accounts/apis/home/proceed_to_reset';
    return this.send_post_request(data,url) ; 
  }
  reset_password(data : any)
  {
    
    let url = this.server_url+'accounts/apis/home/reset_password';
    return this.send_post_request(data,url) ; 
  }
  fetch_booked_orders(data : any)
  {
    
    let url = this.server_url+'index.php?/app_services/fetch_booked_orders';
    return this.send_post_request(data,url) ; 
  }
  resend_otp(data : any)
  {
    
    let url = this.server_url+'accounts/apis/home/resend_otp';
    return this.send_post_request(data,url) ; 
  }
  get_search_data(data : any)
  {
    
    let url = this.server_url+'accounts/apis/home/get_search_data';
    return this.send_post_request(data,url) ; 
  }
  track_record(data : any)
  {
    
    let url = this.server_url+'index.php?/app_services/track_record';
    return this.send_post_request(data,url) ; 
  }
  fetch_page_data(data : any)
  {
    let url = this.server_url+'accounts/apis/page/fetch_page_data';
    return this.send_post_request(data,url) ; 
  }
  apply_package(data : any)
  {
    
    let url = this.server_url+'index.php?/app_services/apply_package';
    return this.send_post_request(data,url) ; 
  }

  save_contact_form (data : any)
  {
    
    let url = this.server_url+'accounts/apis/query/save_contact_form';
    return this.send_post_request(data,url) ; 
  }
  subscribe_newsletters(data : any)
  {
    
    let url = this.server_url+'accounts/apis/query/subscribe_newsletters';
    return this.send_post_request(data,url) ;
  }
  save_faqs_form(data : any)
  {
    
    let url = this.server_url+'accounts/apis/query/save_faqs_form';
    return this.send_post_request(data,url) ;
  }
  fetch_promocode(data : any)
  {
    
    let url = this.server_url+'accounts/apis/home/fetch_promocode';
    return this.send_post_request(data,url) ;
  }
  apply_promo_code(data : any)
  {
    
    let url = this.server_url+'accounts/apis/offers/apply_promo_code';
    return this.send_post_request(data,url) ;
  }
  check_if_recharge_exist(data : any)
  {
    
    let url = this.server_url+'accounts/apis/recharge/check_if_recharge_exist';
    return this.send_post_request(data,url) ;
  }
  product_categories()
  {
    let data = {};
    let url = this.server_url+'accounts/apis/product/product_categories';
    return this.send_post_request(data,url) ;
  }
  channel_category_by_circle(data : any)
  {
    
    let url = this.server_url+'accounts/apis/product/channel_category_by_circle';
    return this.send_post_request(data,url) ;
  }

  fetch_blogs(data : any)
  {
    let url = this.server_url+'accounts/apis/page/fetch_blogs';
    return this.send_post_request(data,url) ;
  }
  fetch_blogs_by_category(data : any)
  {
    
    let url = this.server_url+'accounts/apis/page/fetch_blogs_by_category';
    return this.send_post_request(data,url) ;
  }
  fetch_single_blog(data : any)
  {
    
    let url = this.server_url+'accounts/apis/page/fetch_single_blog';
    return this.send_post_request(data,url) ;
  }

  submit_comment(data : any)
  {
    
    let url = this.server_url+'accounts/apis/page/submit_comment';
    return this.send_post_request(data,url) ;
  }

  fetch_post_comments(data : any)
  {
    
    let url = this.server_url+'accounts/apis/page/fetch_post_comments';
    return this.send_post_request(data,url) ;
  }
  get_plans(data : any)
  {
    let url = this.server_url+'accounts/apis/plan_api/plans';
    return this.send_post_request(data,url) ;
  }

  faqs_list(data : any)
  {
    let url = this.server_url+'accounts/apis/home/faqs_list';
    return this.send_post_request(data,url) ;
  }
  print_faq(data : any)
  {
    let url = this.server_url+'accounts/apis/home/single_faq';
    return this.send_post_request(data,url) ;
  }
 
  fetch_pack_by_month(data : any)
  {
    let url = this.server_url+'accounts/apis/product/fetch_pack_by_month';
    return this.send_post_request(data,url) ; 
  }
  fetch_bot_list(data : any)
  {
    let url = this.server_url+'accounts/apis/home/fetch_bot_list';
    return this.send_post_request(data,url) ; 
  }
  defalut_queries(data : any)
  {
    let url = this.server_url+'accounts/apis/page/default_queries';
    return this.send_post_request(data,url) ; 
  }

  send_feed(data : any)
  {
    let url = this.server_url+'accounts/apis/home/send_feed';
    return this.send_post_request(data,url) ;
  }

  fetch_recharge_history(data : any)
  {
    let url = this.server_url+'accounts/apis/orders/fetch_recharge_history';
    return this.send_post_request(data,url) ;
  }

  paging_recharge_history(data : any)
  {
    let url = this.server_url+'accounts/apis/orders/paging_recharge_history';
    return this.send_post_request(data,url) ;
  }

  fetch_orders_history(data : any)
  {
    let url = this.server_url+'accounts/apis/orders/fetch_orders_history';
    return this.send_post_request(data,url) ;
  }
  paging_orders_history(data : any)
  {
    let url = this.server_url+'accounts/apis/orders/paging_orders_history';
    return this.send_post_request(data,url) ;
  }
  fetch_transaction_history(data : any)
  {
    let url = this.server_url+'accounts/apis/orders/fetch_transaction_history';
    return this.send_post_request(data,url) ;
  }
  
  paging_transaction_history(data : any)
  {
    let url = this.server_url+'accounts/apis/orders/paging_transaction_history';
    return this.send_post_request(data,url) ;
  }

  fetch_transaction_by_key(data : any)
  {
    let url = this.server_url+'accounts/apis/orders/fetch_transaction_by_key';
    return this.send_post_request(data,url) ;
  }

  export_recharge(data : any)
  {
    let url = this.server_url+'accounts/apis/export/export_recharge';
    return this.send_post_request(data,url) ;
  }
  export_dth_orders(data : any)
  {
    let url = this.server_url+'accounts/apis/export/export_dth_orders';
    return this.send_post_request(data,url) ;
  }
  fetch_recent_orders(data : any)
  {
    let url = this.server_url+'accounts/apis/orders/fetch_recent_orders';
    return this.send_post_request(data,url) ;
  }

  fetch_transactions(data : any)
  {
    let url = this.server_url+'accounts/apis/orders/fetch_transactions';
    return this.send_post_request(data,url) ;
  }
  check_complaint(data : any)
  {
    let url = this.server_url+'accounts/apis/orders/check_complaint';
    return this.send_post_request(data,url) ;
  }
  add_complaint(data : any)
  {
    let url = this.server_url+'accounts/apis/orders/add_complaint';
    return this.send_post_request(data,url) ;
  }
  add_comment(data : any)
  {
    let url = this.server_url+'accounts/apis/orders/add_comment';
    return this.send_post_request(data,url) ;
  }
  fetch_complaints(data : any)
  {
    
    let url = this.server_url+'accounts/apis/orders/fetch_complaints_listing';
    return this.send_post_request(data,url) ;
  }

  fetch_complaint_by_key(data : any)
  {
    
    let url = this.server_url+'accounts/apis/orders/fetch_complaint_by_key';
    return this.send_post_request(data,url) ;
  }

  fetch_complaint_info(data : any)
  {
    let url = this.server_url+'accounts/apis/orders/fetch_complaint_info';
    return this.send_post_request(data,url) ;
  }
  search_pincode(data : any)
  {
    let url = this.server_url+'accounts/apis/product/search_pincode';
    return this.send_post_request(data,url) ;
  }

  search_pincode_by_key(data :any)
  {
    let url = this.server_url+'accounts/apis/product/search_pincode_by_key';
    return this.send_post_request(data,url) ;
  }
  search_product_pincode(data : any)
  {
    let url = this.server_url+'accounts/apis/product/search_product_pincode';
    return this.send_post_request(data,url) ;
  }
  subscribe_plan(data : any)
  {
    let url = this.server_url+'accounts/apis/home/subscribe_plan';
    return this.send_post_request(data,url) ;
  }
  add_new_address(data : any)
  {
    let url = this.server_url+'accounts/apis/product/add_new_address';
    return this.send_post_request(data,url) ;
  }
  fetch_address_(data : any)
  {
    let url = this.server_url+'accounts/apis/product/fetch_address';
    return this.send_post_request(data,url) ;
  }
  reg_address(data : any)
  {
    let url = this.server_url+'accounts/apis/product/reg_address';
    return this.send_post_request(data,url) ;
  }
  fetch_testimonials(data : any)
  {
    let url = this.server_url+'accounts/apis/page/testimonials';
    return this.send_post_request(data,url) ;
  }
  upload_avatar(data : any)
  {
    let url = this.server_url+'accounts/apis/home/upload_avatar';
    return this.send_post_request(data,url) ;
  }
  fetch_package_data(data : any)
  {
    let url = this.server_url+'accounts/apis/product/fetch_package_by_category';
    return this.send_post_request(data,url) ;
  }
  share_channel_pack_on_mail(data : any)
  {
    let url = this.server_url+'accounts/apis/product/share_channel_pack_on_mail';
    return this.send_post_request(data,url) ;
  }
  get_faqs_search_keywords(data : any)
  {
    let url = this.server_url+'accounts/apis/page/get_faqs_search_keywords';
    return this.send_post_request(data,url) ;
  }
  search_faqs_list(data : any)
  {
    let url = this.server_url+'accounts/apis/page/get_faqs_search_list';
    return this.send_post_request(data,url) ;
  }
  choose_box_for_this_pack(data : any)
  {
    let url = this.server_url+'accounts/apis/product/choose_box_for_this_pack';
    return this.send_post_request(data,url) ;
  }
  fetch_addmoney_order(data : any)
  {
    let url = this.server_url+'accounts/apis/orders/fetch_addmoney_order';
    return this.send_post_request(data,url) ;
  }

  fetch_addmoney_calculation(data : any)
  {
    let url = this.server_url+'accounts/apis/orders/fetch_addmoney_calculation';
    return this.send_post_request(data,url) ;
  }
  fetch_wallet_to_bank_calculation(data : any)
  {
    let url = this.server_url+'accounts/apis/orders/fetch_wallet_to_bank_calculation';
    return this.send_post_request(data,url) ;
  }
  get_last_recharges(data : any)
  {
    let url = this.server_url+'accounts/apis/orders/get_last_recharges';
    return this.send_post_request(data,url) ;
  }
  add_to_favorite(data : any)
  {
    let url = this.server_url+'accounts/apis/product/add_to_favorite';
    return this.send_post_request(data,url) ; 
  }
  remove_avatar(data : any)
  {
    let url = this.server_url+'accounts/apis/home/remove_avatar';
    return this.send_post_request(data,url) ; 
  }
  fetch_home_products(data : any)
  {
    let url = this.server_url+'accounts/apis/home/fetch_home_products';
    return this.send_post_request(data,url) ; 
  }

  search_order(data : any)
  {
    let url = this.server_url+'accounts/apis/orders/search_order';
    return this.send_post_request(data,url) ; 
  }
  fetch_recent_transfer(data : any)
  {
    let url = this.server_url+'accounts/apis/orders/fetch_recent_transfer';
    return this.send_post_request(data,url) ; 
  }
  fetch_rental_plan(data : any)
  {
    let url = this.server_url+'accounts/apis/page/fetch_rental_plan';
    return this.send_post_request(data,url) ; 
  }
  fetch_plan_data(data : any)
  {
    let url = this.server_url+'accounts/apis/page/fetch_plan_data';
    return this.send_post_request(data,url) ; 
  }
  subcribe_plan(data : any)
  {
    let url = this.server_url+'accounts/apis/orders/subcribe_plan';
    return this.send_post_request(data,url) ; 
  }
  check_if_user_exist(data : any)
  {
    let url = this.server_url+'accounts/apis/orders/check_if_user_exist';
    return this.send_post_request(data,url) ;
  }
  fetch_order(data : any)
  {
    let url = this.server_url+'accounts/apis/orders/fetch_order';
    return this.send_post_request(data,url) ;
  }

  app_version(data : any)
  {
    let url = this.server_url+'accounts/apis/home/app_version';
    return this.send_post_request(data,url) ;
  }
  check_device(data : any)
  {
    let url = this.server_url+'accounts/apis/home/check_device';
    return this.send_post_request(data,url) ;
  }
  fetch_recharge_options(data : any) 
  {
    let url = this.server_url+'accounts/apis/home/fetch_recharge_options';
    return this.send_post_request(data,url) ;
  }

  fetch_product_options(data : any)
  {
    let url = this.server_url+'accounts/apis/home/fetch_product_options';
    return this.send_post_request(data,url) ;
  }
  cancel_order(data : any)
  {
    let url = this.server_url+'accounts/apis/orders/cancel_order';
    return this.send_post_request(data,url) ;
  }
  fetch_page_categories(data : any)
  {
    let url = this.server_url+'accounts/apis/page/fetch_page_categories';
    return this.send_post_request(data,url) ;
  }

  get_circles(data : any)
  {
    let url = this.server_url+'accounts/apis/home/get_circles';
    return this.send_post_request(data,url) ;
  }
  get_pincode_circles(data : any)
  {
    let url = this.server_url+'accounts/apis/home/get_pincode_circles';
    return this.send_post_request(data,url) ;
  }
  get_pincodes_(data : any)
  {
    let url = this.server_url+'accounts/apis/home/get_pincodes_';
    return this.send_post_request(data,url) ;
  }
  add_user_bank(data : any)
  {
    let url = this.server_url+'accounts/apis/home/add_user_bank';
    return this.send_post_request(data,url) ; 
  }
  banks(data : any)
  {
    let url = this.server_url+'accounts/apis/home/banks';
    return this.send_post_request(data,url) ; 
  }
  user_banks(data : any)
  {
    let url = this.server_url+'accounts/apis/home/user_banks';
    return this.send_post_request(data,url) ; 
  }
  send_money_to_bank(data : any)
  {
    let url = this.server_url+'accounts/apis/home/send_money_to_bank';
    return this.send_post_request(data,url) ; 
  }

  recent_comments(data : any)
  {
    let url = this.server_url+'accounts/apis/orders/recent_comments';
    return this.send_post_request(data,url) ; 
  }

  fetch_packs_and_month(data : any)
  {
    let url = this.server_url+'accounts/apis/product/fetch_packs_and_month';
    return this.send_post_request(data,url) ; 
  }
  fetch_order_detail(data : any)
  {
    let url = this.server_url+'accounts/apis/product/fetch_order_detail';
    return this.send_post_request(data,url) ; 
  }
  fetch_my_leads(data : any)
  {
    let url = this.server_url+'accounts/apis/lead/myleads';
    return this.send_post_request(data,url) ; 
  }
}
