import { Component, OnInit,Inject,PLATFORM_ID} from '@angular/core';
import { Meta,Title } from "@angular/platform-browser";
import { TodoService } from '../todo.service';
import { AuthService } from '../auth.service';
import { PagesService } from '../pages.service';
import { User } from '../user';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router,ActivatedRoute } from '@angular/router';
import {isPlatformBrowser} from '@angular/common';
import {BehaviorSubject} from 'rxjs';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styles: [],
  providers: [TodoService,User,AuthService]
})
export class BlogComponent implements OnInit {
  static isBrowser = new BehaviorSubject<boolean>(null!);
  blogs : any = [];
  categories : any;
  page : string;
  start : number;
  category : string;
  more_display : boolean = false;
  loaded_blogs : any = [];
  constructor(
    @Inject(PLATFORM_ID) private platformId: any, 
    public todoservice : TodoService,
    private authservice : AuthService,
    private route : Router,
    public pageservice : PagesService,
    private router : ActivatedRoute,
    private  meta : Meta,
    private title : Title, 
    private spinner : NgxSpinnerService
  ) { 
    BlogComponent.isBrowser.next(isPlatformBrowser(platformId));
  }

  ngOnInit() {
    this.todoservice.back_icon_template('Blogs',this.todoservice.back(1))
    this.page = '/blog/all';
    this.start = 0;
    this.fetch_page_data();
    this.router.params.subscribe(params => {
    this.category = params['name']; //log the value of id
    if(isPlatformBrowser(this.platformId)) 
    {
      $('.blog-tabs li a').removeClass('active'); 
      $('.blog-tabs ').find('#list-item-'+this.category).find('a').addClass('active');
    }
      this.fetch_blogs('all');
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
      return;
  }
  this.todoservice.fetch_page_data(page)
    .subscribe(
      data => 
      {
        if(data.PAGEDATA)
        {
          this.todoservice.set_page_data(data.PAGEDATA[0]);
          // $('#page-content').html(this.todoservice.get_page().description);
          $('.hero').css('background','url('+this.todoservice.base_url+'accounts/assets/img/cms/'+data.PAGEDATA[0].image+')');
          $('.hero').css('background-repeat','no-repeat');
          window.scroll(0,0);
          this.meta.addTag({ name: 'description', content: this.todoservice.get_page().metaDesc });
          this.meta.addTag({ name: 'keywords', content: this.todoservice.get_page().metaKeyword });
          this.title.setTitle(this.todoservice.get_page().metaTitle);   
           
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

 decode_html(html)
 {
  var textArea = document.createElement('textarea');
  textArea.innerHTML = html;
  var text = textArea.value.replace(/<[^>]*>/g, '')
  if(textArea.value.replace(/<[^>]*>/g, '').length > 225)
    text = textArea.value.replace(/<[^>]*>/g, '').substring(0,225)+'...';
  return text;
 }
}
