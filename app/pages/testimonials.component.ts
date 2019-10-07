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
  constructor(private title: Title, public todoservice : TodoService,
    private spinner: NgxSpinnerService,private meta : Meta,
    private _renderer2: Renderer2, 
     @Inject(DOCUMENT) private _document,
    ) { }

  ngOnInit() {
    this.fetch_testimonials();
    
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
}
