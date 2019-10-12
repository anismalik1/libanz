import { Component, OnInit,Renderer2,Inject } from '@angular/core';
import { TodoService } from '../todo.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DOCUMENT,Meta,Title } from "@angular/platform-browser";

@Component({
  selector: 'app-testimonials',
  templateUrl: './testimonials.component.html',
  styles: []
})
export class TestimonialsComponent implements OnInit {

  testimonials : any;
  page : string = 'testimonial';
  constructor(private title: Title, public todoservice : TodoService,
    private spinner: NgxSpinnerService,private meta : Meta,
    private _renderer2: Renderer2, 
     @Inject(DOCUMENT) private _document,
    ) { }

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
}
