import { Component, OnInit ,Input,ViewContainerRef,PLATFORM_ID,Inject} from '@angular/core';
import { TodoService } from '../../todo.service';
import { AuthService } from '../../auth.service';
import { FormControl } from '@angular/forms'; 
import { Router } from '@angular/router'
import { Meta ,Title} from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { map, startWith} from 'rxjs/operators';
import { Observable} from 'rxjs';
import { ToastrManager } from 'ng6-toastr-notifications';
import {isPlatformBrowser} from '@angular/common';
import {BehaviorSubject} from 'rxjs';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit{
  static isBrowser = new BehaviorSubject<boolean>(null!);
  page : string;
  navigate : boolean = false;
  year :  number = new Date().getFullYear();
  options: any ;
  filterOptions : any;
  @Input() baseUrl;
  filterdList : boolean = false;
  $mini_footer : boolean = false;
  myControl = new FormControl();
  filteredOptions: Observable<object>;
  constructor( public todoservice : TodoService,
  @Inject(PLATFORM_ID) private platformId: any ,
  private toast : ToastrManager,  
  private spinner: NgxSpinnerService,
  private vcr :ViewContainerRef,
    private authservice : AuthService,
    private router : Router, private title: Title, private meta : Meta) {
      FooterComponent.isBrowser.next(isPlatformBrowser(platformId));  
      ///this.fetch_page_data();
    // window.scroll(0,0);
     if(!this.todoservice.footer_data)
     {
       this.page = 'footer';
       if(isPlatformBrowser(this.platformId)) 
        this.fetch_page_data();
     } 
   }

  navigate_to(url)
  {
    if(1 == 1)
    {
      this.router.routeReuseStrategy.shouldReuseRoute = function(){
        return false;
      }
    this.router.navigated = false;
    this.router.navigate([url]);
    } 
  }

   fetch_page_data()
   {
    let page = { page : this.page };
    if(page.page == '')
    {
        return;
    } 
    this.spinner.show();
    this.todoservice.fetch_page_data(page) 
      .subscribe(
        data => 
        {
          this.spinner.hide();
          if(this.navigate == true)
          {
            this.todoservice.set_page_data(data.PAGEDATA[0]);
            if(this.todoservice.page)
              $('#page-content').html(this.todoservice.get_page().description);
              this.navigate = false; 
          }
          //this.spinner.hide();
        }
      ) 
   }
  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
    if(this.router.url == '/' || this.router.url.includes('signup'))
    {
      this.$mini_footer = true;
    } 
  }
  fetch_list(e)
  {
    if(e.target.value.length == 1)
    {
      let data : any;
      this.todoservice.fetch_bot_list(data)
        .subscribe(
          data => 
          {
            this.options = data.bot_list;
            this.filterdList = true;
            this.filterOptions = this._filter(e.target.value);
          }
        ) 
    }
    else
    {
      this.filterOptions = this._filter(e.target.value);
    }
  }
  
  private _filter(value: string): object {
    if(this.options)
    {
      const filterValue = value.toLowerCase();
      return this.options.filter(option => option.search_words.toLowerCase().includes(value));
    }
    return {};
  }
  
  get_token()
  {
    return this.authservice.auth_token();
  }

  subscribe_newsletters(data)
  {
    if(this.get_token())
    {
      data.token = this.get_token();
    }
    if(data.email != '')
    {
      this.todoservice.subscribe_newsletters(data)
      .subscribe(
        data => 
        {
          if(data.status == true)
            this.toast.successToastr(data.msg);
          else  
            this.toast.errorToastr(data.msg);
          this.spinner.hide();
        }
      ) 
    }
    else
    {
      this.toast.errorToastr("Error! Please Enter Email.");
    }
  }
  
  search_query()
  {

  }
}

