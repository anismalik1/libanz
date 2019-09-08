import { Component, OnInit ,ViewContainerRef} from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Meta ,Title} from '@angular/platform-browser';
import { Router,ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';
import { TodoService } from '../todo.service';
import { User } from '../user';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({ 
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styles: [],
  providers: [TodoService,User,AuthService]
})
export class ContactUsComponent implements OnInit {
  contactgroup : FormGroup;
  page : any;
  constructor(private fb: FormBuilder, 
    private todoservice: TodoService,
    private spinner : NgxSpinnerService,
    private toastr: ToastsManager,
    private meta : Meta,
    private title : Title,
    private vcr: ViewContainerRef,
    private router : ActivatedRoute,
    private route : Router,
    private authservice : AuthService) { 
      this.toastr.setRootViewContainerRef(vcr);
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
      return false;
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
            $('.hero').css('background','url(https://www.mydthshop.com/accounts/assets/img/cms/'+data.PAGEDATA[0].image+')');
            $('.hero').css('background-repeat','no-repeat');
          }
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
    this.spinner.show();
    this.todoservice.save_contact_form(data)
    .subscribe(
      data => 
      {
        let b = JSON.stringify(data);
        data =  JSON.parse(b.replace(/\\/g, ''));
        this.spinner.hide();
        if(data.status == true)
        {
          this.toastr.error("Successful! We Have Received Your Query And will be back to you soon.");
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