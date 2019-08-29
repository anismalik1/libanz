import { Component, OnInit,ViewContainerRef } from '@angular/core';
import { TodoService } from '../todo.service';
import { AuthService } from '../auth.service';
import { Router ,ActivatedRoute} from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Meta ,Title} from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
@Component({
  selector: 'app-merchant',
  templateUrl: './merchant.component.html',
  styles: []
})
export class MerchantComponent implements OnInit {
  page : any;
  contactgroup : FormGroup;
  constructor(private title: Title, public todoservice : TodoService,
    private spinner: NgxSpinnerService,private router : Router,private fb: FormBuilder,
     private meta : Meta, private route : ActivatedRoute,
     private authservice : AuthService,
     private vcr: ViewContainerRef,
    private toastr: ToastsManager,) { 
      this.toastr.setRootViewContainerRef(vcr);
      this.page = 'accounts/'+route.snapshot.url[0].path;
      this.spinner.show();
      this.fetch_page_data();
      window.scroll(0,0);
      this.contactgroup = fb.group({
        'name' : [null,Validators.compose([Validators.required])],
        'email' : [null,Validators.compose([Validators.email])],
        'phone' : [null,Validators.compose([Validators.required,Validators.pattern("[0-9]{10}")])],
        'subject' : [null],
        'message' : [null],
      });
     }

  ngOnInit() {
    
  }

  fetch_page_data()
  {
   let page = {page : this.page}; 
   if(page.page == '')
   {
       return false;
   }
   this.todoservice.fetch_page_data(page)
     .subscribe(
       data => 
       {
         if(data.PAGEDATA)
         {
           this.todoservice.set_page_data(data.PAGEDATA[0]);
           if(data.PAGEDATA[0].image != '')
             $('.hero').css('background','url(https://www.mydthshop.com/accounts/assets/img/cms/'+data.PAGEDATA[0].image+')');
             $('.hero').css('background-repeat','no-repeat');
           $('#page-content').after(this.todoservice.get_page().description);
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
    data.token  = this.get_token();
    this.spinner.show();
    if(this.page.includes("merchant"))
      data.which_form = 3;
    else 
      data.which_form = 4; 

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

  get_token()
  {
    return this.authservice.auth_token();
  }
}
