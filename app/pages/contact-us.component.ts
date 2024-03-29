import { Component, OnInit ,ViewContainerRef,Inject,PLATFORM_ID} from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Meta ,Title} from '@angular/platform-browser';
import { Router,ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';
import { TodoService } from '../todo.service';
import { User } from '../user';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrManager } from 'ng6-toastr-notifications';
import {isPlatformBrowser} from '@angular/common';
import {BehaviorSubject} from 'rxjs';

// import * as $ from 'jquery';
@Component({ 
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styles: [],
  providers: [TodoService,User,AuthService]
})
export class ContactUsComponent implements OnInit {
  contactgroup : FormGroup;
  static isBrowser = new BehaviorSubject<boolean>(null!);
  page : any;
  constructor(private fb: FormBuilder, 
    @Inject(PLATFORM_ID) private platformId: any,
    public todoservice: TodoService,
    private spinner : NgxSpinnerService,
    private toastr: ToastrManager,
    private meta : Meta,
    private title : Title,
    private vcr: ViewContainerRef,
    private router : ActivatedRoute,
    private route : Router,
    private authservice : AuthService) { 
      ContactUsComponent.isBrowser.next(isPlatformBrowser(platformId));
      this.contactgroup = fb.group({
        'name' : [null,Validators.compose([Validators.required])],
        'email' : [null,Validators.compose([Validators.required])],
        'subject' : [null],
        'message' : [null],
      });
      this.router.params.subscribe(params => {
        this.page = params['name']; //log the value of id
      });
    }

  ngOnInit() {
    this.todoservice.back_icon_template('Contact Us',this.todoservice.back(1))
    if(this.page == null)
    {
      this.page = 'contact-us'
    }
    this.fetch_page_data();
  }

fetch_page_data()
{
  if(this.page == null || this.page == '')
  {
      return;
  }
  this.spinner.show(); 
  this.todoservice.fetch_page_data({page : this.page})
    .subscribe(
      data => 
      {
        if(data.PAGEDATA)
        {
          this.todoservice.set_page_data(data.PAGEDATA[0]);
          if(data.PAGEDATA[0].image != '')
          {
            if(isPlatformBrowser(this.platformId))
              $('.hero img').attr('src',this.todoservice.base_url+'accounts/assets/img/cms/'+data.PAGEDATA[0].image);
          }
          if(isPlatformBrowser(this.platformId))
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
  contact_submit(data)
  {
    if(this.get_token())
    {
      data.token  = this.get_token();
    }
    data.which_form = 1;
    
    this.spinner.show();
    this.todoservice.save_contact_form(data)
    .subscribe(
      data => 
      {
        this.spinner.hide();
        if(data.status == true)
        {
          this.contactgroup.controls['name'].setValue(null);
          this.contactgroup.controls['email'].setValue(null);
          this.contactgroup.controls['subject'].setValue(null);
          this.contactgroup.controls['message'].setValue(null);
          this.contactgroup.markAsUntouched()
          if(isPlatformBrowser(this.platformId))
            $('[href="#modal-success"]')[0].click();
          //this.toastr.error("Successful! We Have Received Your Query And will be back to you soon.");
        }
        else
        {
          this.toastr.errorToastr("Sorry! Your query is not recorded. Please try later.");
          //this.toastr.error("Successful! We Have Received Your Query And will be back to you soon.");
        }
      }
    )  
  }
  toHTML(input) : any {
    return new DOMParser().parseFromString(input, "text/html").documentElement.textContent;
  }
  get_token()
  {
    return this.authservice.auth_token();
  }
}
