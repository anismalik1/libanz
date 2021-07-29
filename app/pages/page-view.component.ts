import { Component, OnInit,PLATFORM_ID,Inject } from '@angular/core';
import { TodoService } from '../todo.service';
import { PagesService } from '../pages.service';
import { Router ,ActivatedRoute} from '@angular/router';
import { Meta ,Title} from '@angular/platform-browser';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthService } from '../auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrManager } from 'ng6-toastr-notifications';
import {isPlatformBrowser} from '@angular/common';
import {BehaviorSubject} from 'rxjs';

@Component({
  selector: 'app-page-view',
  templateUrl: './page-view.component.html',
  styles: []
})
export class PageViewComponent implements OnInit {
  static isBrowser = new BehaviorSubject<boolean>(null!);
  page : string;
  page_data : any;
  contactgroup : FormGroup;
  form_enable : boolean = false;
  public ref : any;
constructor(private title: Title, public todoservice : TodoService,
  public pageservice : PagesService,
  @Inject(PLATFORM_ID) private platformId: any ,
  private spinner: NgxSpinnerService,private router : Router,
  private fb: FormBuilder,
  private toastr: ToastrManager,
  private authservice : AuthService,
   private meta : Meta, private route : ActivatedRoute) {
    PageViewComponent.isBrowser.next(isPlatformBrowser(platformId));
  this.page = route.snapshot.params['name'];
  this.spinner.show();
  this.fetch_page_data();
  if(isPlatformBrowser(this.platformId)) 
    window.scroll(0,0);
  this.contactgroup = fb.group({
    'name' : [null,Validators.compose([Validators.required])],
    'email' : [null,Validators.compose([Validators.email])],
    'phone' : [null,Validators.compose([Validators.required,Validators.pattern("[0-9]{10}")])],
    'subject' : [null],
    'message' : [null],
  });

 }

 page_content()
 {
  var content = ''; 
  if(this.pageservice.page_data)
    content = this.pageservice.page_data.description;
   return content;
 }

 fetch_page_data()
 {
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
          this.spinner.hide();
          this.todoservice.set_page_data(data.PAGEDATA[0]);
          this.pageservice.page_data = data.PAGEDATA[0];
          this.meta.addTag({ name: 'description', content: this.todoservice.get_page().metaDesc });
          this.meta.addTag({ name: 'keywords', content: this.todoservice.get_page().metaKeyword });
          this.title.setTitle(this.todoservice.get_page().metaTitle);
          
          // if(data.PAGEDATA[0].image != '' && data.PAGEDATA[0].image != undefined)
          // {
          //   if(isPlatformBrowser(this.platformId)) 
          //     $('.hero img').attr('src',this.todoservice.base_url+'accounts/assets/img/cms/'+data.PAGEDATA[0].image);           
          // }
          // else
          // {
          //   if(isPlatformBrowser(this.platformId)) 
          //     $('.hero').remove(); 
          // }
          this.todoservice.back_icon_template(this.todoservice.get_page().title,this.todoservice.back(1))
          if(isPlatformBrowser(this.platformId))  
            window.scroll(0,0);
        }
        this.spinner.hide();  
      }
    ) 
 }

ngOnInit() {
  if(this.todoservice.get_param('ref'))
  {
    this.ref = this.todoservice.get_param('ref')
  }
  if(this.router.url == '/p/24-x-7-support' || this.router.url == '/p/jio-fiber' || this.router.url == '/p/airtel-xstream' || this.router.url == '/p/dishsmrt-hub')
  {
    this.form_enable = true;
  }
}
contact_submit(data)
{
  data.token  = this.get_token();
  this.spinner.show();
  if(this.router.url == '/p/24-7') 
    data.which_form = 5;
  else if(this.router.url == '/p/jio-fiber') 
    data.which_form = 6;
  else if(this.router.url == '/p/airtel-xstream') 
    data.which_form = 7; 
  else if(this.router.url == '/p/dishsmrt-hub') 
    data.which_form = 8;     

  this.todoservice.save_contact_form(data)
  .subscribe(
    data => 
    {
      let b = JSON.stringify(data);
      data =  JSON.parse(b.replace(/\\/g, ''));
      this.spinner.hide();
      if(data.status == true)
      {
        this.toastr.successToastr("Successful! We Have Received Your Query And will get back to you soon.");
      }
    }
  )  
}
get_token()
{
  return this.authservice.auth_token();
}
toHTML(input) : any {
  return new DOMParser().parseFromString(input, "text/html").documentElement.textContent;
}
}
