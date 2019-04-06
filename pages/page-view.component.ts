import { Component, OnInit,Pipe } from '@angular/core';
import { TodoService } from '../todo.service';
import { Router ,ActivatedRoute} from '@angular/router';
import { Meta ,Title} from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-page-view',
  templateUrl: './page-view.component.html',
  styles: []
})
export class PageViewComponent implements OnInit {
  page : string;
  page_data : any;
constructor(private title: Title, public todoservice : TodoService,private spinner: NgxSpinnerService,private router : Router, private meta : Meta, private route : ActivatedRoute) {
  this.page = route.snapshot.params['name'];
  this.spinner.show();
  this.fetch_page_data();
  window.scroll(0,0);
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

ngOnInit() {

}
toHTML(input) : any {
  return new DOMParser().parseFromString(input, "text/html").documentElement.textContent;
}
}
