import { Injectable, Inject} from '@angular/core';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Meta ,Title} from '@angular/platform-browser';
@Injectable()
export class PagesService {
  public server_url : string = "https://www.libanz.com/";
  public default_queries : any;
  public base_url : string = 'https://www.libanz.com/web-app/';
  public service_url : string = 'https://www.libanz.com/index.php?/app_services/';
  public page_data : any;
  public testimonials : any;
  public start : number = 0;
  public blog_categories : any;
  public blogs : any;
  public loaded_blogs : any;
  public blog_post : any;
  public recent_posts : any;
  static isBrowser = new BehaviorSubject<boolean>(null!);
  constructor(private http : HttpClient,
    private meta : Meta,private title : Title,) { 
    }
  set_page_data(data : any)
  {
    let b = JSON.stringify(data);
    //this.page.storage =  JSON.parse(b.replace(/\\/g, ''));
  }

  set_page_content(url)
  {
    return this.fetch_page_data({page : url})
      .subscribe(
        (data)  => 
        {
          if(data.PAGEDATA && data.PAGEDATA.length > 0)
          {
            this.meta.addTag({ name: 'description', content: data.PAGEDATA[0].metaDesc });
            this.meta.addTag({ name: 'keywords', content: data.PAGEDATA[0].metaKeyword });
            this.title.setTitle(data.PAGEDATA[0].metaTitle);
            this.page_data = data.PAGEDATA[0];
          }
          
         return true
        }
      )
  }

  fetch_blogs(data)
	{
      this.fetch_blogs_request(data)
      .subscribe(
        data => 
        { 
          this.blogs = data.blogs;
          this.blog_categories = data.category;
        }
      )  
  }

 

  defaut_query()
  {
    let data :any;
    this.defalut_queries(data)
      .subscribe(
        data => 
        {
          this.default_queries = data.default_queries;
        }
      ) 
  }

  fetch_single_blog(url)
  {
    let data = {token : '',url: url};
      this.fetch_single_blog_request(data)
      .subscribe(
        data => 
        {
          this.blog_post = data.post;
          this.recent_posts = data.recent_posts;
          this.meta.addTag({ name: 'description', content: this.blog_post[0].metaDesc });
          this.meta.addTag({ name: 'keywords', content: this.blog_post[0].metaKeyword });
          this.title.setTitle(this.blog_post[0].metaTitle);
        }
      )
  }

  fetch_testimonials()
  {
    this.fetch_testimonials_request({})
    .subscribe(
      data => 
      {
        if(data.testimonials)
        {
          this.testimonials = data.testimonials
          // this.meta.addTag({ name: 'description', content: this.todoservice.get_page().metaDesc });
          // this.meta.addTag({ name: 'keywords', content: this.todoservice.get_page().metaKeyword });
          // this.title.setTitle(this.todoservice.get_page().metaTitle);
        } 
      }
    )
  }

  
  fetch_single_blog_request(data : any)
  {
    let url = this.server_url+'accounts/apis/page/fetch_single_blog';
    return this.send_post_request(data,url) ;
  }

  fetch_blogs_request(data : any)
  {
    let url = this.server_url+'accounts/apis/page/fetch_blogs';
    return this.send_post_request(data,url) ;
  }

  fetch_testimonials_request(data : any)
  {
    let url = this.server_url+'accounts/apis/page/testimonials';
    return this.send_post_request(data,url) ;
  }

  fetch_page_data(data : any)
  {
    let url = this.server_url+'accounts/apis/page/fetch_page_data';
    return this.send_post_request(data,url) ; 
  }

  defalut_queries(data : any)
  {
    let url = this.server_url+'accounts/apis/page/default_queries';
    return this.send_post_request(data,url) ; 
  }

  send_post_request(data : any,url : string) : Observable<any>
  {
    var Headers_of_api = new HttpHeaders({
      'Content-Type' : 'application/x-www-form-urlencoded'
    });
    return this.http.post( url, data, { headers: Headers_of_api } )
    .map(res => res)
  }

}
