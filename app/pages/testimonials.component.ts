import { Component, OnInit,Renderer2,Inject } from '@angular/core';
import { TodoService } from '../todo.service';
import { AuthService } from '../auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { DOCUMENT } from "@angular/common";
import {Meta,Title } from "@angular/platform-browser";
import { ToastrManager } from 'ng6-toastr-notifications';


@Component({
  selector: 'app-testimonials',
  templateUrl: './testimonials.component.html',
  styles: []
})
export class TestimonialsComponent implements OnInit {

  testimonials : any;
  contactgroup : FormGroup;
  page : string = 'testimonial';
  constructor(private title: Title, public todoservice : TodoService,
    private spinner: NgxSpinnerService,private meta : Meta,
    private _renderer2: Renderer2,private fb: FormBuilder,
    private authservice : AuthService,
    private toastr: ToastrManager,
     @Inject(DOCUMENT) private _document,
    ) { 
      this.contactgroup = fb.group({
        'name' : [null,Validators.compose([Validators.required])],
        'email' : [null,Validators.compose([Validators.email])],
        'phone' : [null,Validators.compose([Validators.required,Validators.pattern("[0-9]{10}")])],
        'subject' : [null],
        'message' : [null],
      });
    }

  ngOnInit() {
    this.fetch_testimonials();
    this.fetch_page_data();
  }

  fetch_testimonials()
  {
    this.todoservice.fetch_testimonials({})
    .subscribe(
      data => 
      {
        if(data.testimonials)
        {
          this.testimonials = data.testimonials
          // this.meta.addTag({ name: 'description', content: this.todoservice.get_page().metaDesc });
          // this.meta.addTag({ name: 'keywords', content: this.todoservice.get_page().metaKeyword });
          // this.title.setTitle(this.todoservice.get_page().metaTitle);
          this.init_script();
        }
        this.spinner.hide();  
      }
    )
  }

  init_script()
  {
    if($('#init-page-script')) 
    {
      $('#init-page-script').remove();
    }
    let script = this._renderer2.createElement('script');
    script.type = `text/javascript`;
    script.id = `init-page-script`;
    script.text = `
      $(document).ready(function(){
        $(".testimonial-text").delegate('.load-more','click',function(e){
          var y = document.createElement('textarea');
          y.innerHTML = $(this).attr('title');
          $(this).parent().parent('blockquote').html(y.value);
          $(this).parent().parent().parent('.testimonial-text').css('overflow-y','scroll');
        });
      });`;
      this._renderer2.appendChild(this._document.body, script); 
  }
  
decode_html(html)
 {
  var textArea = document.createElement('textarea');
  textArea.innerHTML = html;
  return textArea.value;
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
            $('.hero img').attr('src',this.todoservice.base_url+'accounts/assets/img/cms/'+data.PAGEDATA[0].image);           
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
  see_more()
  {
    $('.testimonial-card').removeClass('hide');
    $('.see-more').remove();  
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
          this.toastr.errorToastr("Successful! We Have Received Your Query And will be back to you soon.");
        }
      }
    )  
  }
  get_token()
  {
    return this.authservice.auth_token();
  }
}
