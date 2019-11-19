import { Component, OnInit,Pipe } from '@angular/core';
import { TodoService } from '../todo.service';
import { Router ,ActivatedRoute} from '@angular/router';
import { Meta ,Title} from '@angular/platform-browser';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AuthService } from '../auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
  selector: 'app-page-view',
  templateUrl: './page-view.component.html',
  styles: []
})
export class PageViewComponent implements OnInit {
  page : string;
  page_data : any;
  contactgroup : FormGroup;
  form_enable : boolean = false;
constructor(private title: Title, public todoservice : TodoService,
  private spinner: NgxSpinnerService,private router : Router,
  private fb: FormBuilder,
  private toastr: ToastsManager,
  private authservice : AuthService,
   private meta : Meta, private route : ActivatedRoute) {
  this.page = route.snapshot.params['name'];
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
          {
            $('.hero').css('background','url(https://www.mydthshop.com/accounts/assets/img/cms/'+data.PAGEDATA[0].image+')');
            $('.hero').css('background-repeat','no-repeat');            
          }
          $('#page-content').html(this.todoservice.get_page().description);
          this.meta.addTag({ name: 'description', content: this.todoservice.get_page().metaDesc });
          this.meta.addTag({ name: 'keywords', content: this.todoservice.get_page().metaKeyword });
          this.title.setTitle(this.todoservice.get_page().metaTitle);
          window.scroll(0,0);
          
          // $( "#page-content .testimonial-text blockquote" ).each(function( index ) {
          //   if(  $( this ).html().length > 300)
          //   {
          //     $(this).html("<span class='partial-testimnial'>"+$.trim($(this).html()).substring(0, 300).split(" ").slice(0, -1).join(" ") + "</span><a href='javascript:' onclick=\"$(this).remove();$(this).html($(this).html())\" class='blue-text'>...Load More</a>");
          //   }
          // }); 
        }
        this.spinner.hide();  
      }
    ) 
 }

ngOnInit() {
  if(this.router.url == '/p/24-7' || this.router.url == '/p/jio-fiber' || this.router.url == '/p/airtel-xstream' || this.router.url == '/p/dishsmrt-hub')
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
        this.toastr.error("Successful! We Have Received Your Query And will get back to you soon.");
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
