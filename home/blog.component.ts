import { Component, OnInit } from '@angular/core';
import { Meta,Title } from "@angular/platform-browser";
import { TodoService } from '../todo.service';
import { AuthService } from '../auth.service';
import { User } from '../user';
import { NgxSpinnerService } from 'ngx-spinner';

import { Router,ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styles: [],
  providers: [TodoService,User,AuthService]
})
export class BlogComponent implements OnInit {

  blogs : any = [];
  categories : any;
  page : string;
  start : number;
  category : string;
  more_display : boolean = false;
  loaded_blogs : any = [];
  constructor(
    public todoservice : TodoService,
    private authservice : AuthService,
    private route : Router,
    private router : ActivatedRoute,
    private  meta : Meta,
    private title : Title, 
    private spinner : NgxSpinnerService
  ) { }

  ngOnInit() {

    this.page = 'blog';
    this.start = 0;
    this.fetch_page_data();
    this.router.params.subscribe(params => {
       this.category = params['name']; //log the value of id
       $('.blog-tabs li a').removeClass('active'); 
       $('.blog-tabs ').find('#list-item-'+this.category).find('a').addClass('active');
      this.fetch_blogs(this.category);
    });
  }
  fetch_blogs(category)
	{
      let data = {token : '',category:category,start:this.start};
      this.spinner.show();
      this.todoservice.fetch_blogs(data)
      .subscribe(
        data => 
        {
          if(data.more_enable)
            this.more_display = true;
          else
            this.more_display = false; 
          this.blogs = data.blogs;
          if(this.loaded_blogs.length > 0)
          {
            this.blogs = this.loaded_blogs.concat(data.blogs);
          }  
          
          if(this.start == 0)
            this.categories = data.category;
          this.spinner.hide();
        }
      )  
  }

  load_more_blogs()
  {
    for(var i = 0;i < this.blogs.length;i++)
    {
      this.loaded_blogs.push(this.blogs[i]);
    }
    this.start += 12;
    this.fetch_blogs(this.category); 
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

 fetch_data(category)
 {
  $('.blog-tabs li a').removeClass('active'); 
  $('.blog-tabs ').find('#list-item-'+category).find('a').addClass('active');
  this.route.navigate(['/blog/'+category]);
  this.start = 0;
  this.category = category;
  this.loaded_blogs = [];
  this.fetch_blogs(category);
 }
}
