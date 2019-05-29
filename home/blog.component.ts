import { Component, OnInit } from '@angular/core';
import { Meta,Title } from "@angular/platform-browser";
import { TodoService } from '../todo.service';
import { AuthService } from '../auth.service';
import { User } from '../user';
import { NgxSpinnerService } from 'ngx-spinner';

import { Router } from '@angular/router';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styles: [],
  providers: [TodoService,User,AuthService]
})
export class BlogComponent implements OnInit {

  blogs : any;
  page : string;
  constructor(
    public todoservice : TodoService,
    private authservice : AuthService,
    private router : Router,
    private  meta : Meta,
    private title : Title, 
    private spinner : NgxSpinnerService
  ) { }

  ngOnInit() {

    this.page = 'blog';
    this.fetch_blogs();
    this.fetch_page_data();
  }
  fetch_blogs()
	{
      let data = {token : ''};
      this.spinner.show();
      this.todoservice.fetch_blogs(data)
      .subscribe(
        data => 
        {
          this.blogs = data.blogs;
          this.spinner.hide();
        }
      )  
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
}
