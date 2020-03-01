import { Component, OnInit ,ViewContainerRef,Renderer2,Inject} from '@angular/core';
import { DOCUMENT } from "@angular/common";
import { Meta,Title } from "@angular/platform-browser";
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms'
import { TodoService } from '../todo.service';
import { AuthService } from '../auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrManager } from 'ng6-toastr-notifications';

import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-blog-detail',
  templateUrl: './blog-detail.component.html',
  styles: []
})
export class BlogDetailComponent implements OnInit {

  private url : string;
  public recent_posts : any;
  public post : any;
  public commentgroup : FormGroup;
  public comments : any;
  constructor(
    private _renderer2: Renderer2,  
    @Inject(DOCUMENT) private _document, 
    public todoservice : TodoService,
    private authservice : AuthService,
    private toastr: ToastrManager,
    private router : ActivatedRoute,
    private  meta : Meta,
    private title : Title, 
    private vcr: ViewContainerRef,
    private spinner : NgxSpinnerService,
    private fb: FormBuilder
  ) { 
    this.commentgroup = fb.group({
      'name' : [null,Validators.compose([Validators.required])],
      'email' : [null,Validators.compose([Validators.required])],
      'comment' : [null,Validators.compose([Validators.required])],
    });
  }

  ngOnInit() {
    this.router.params.subscribe(params => {
      this.url = params['name']; //log the value of id
     this.fetch_single_blog(this.url);
     this.init_script();
   });
   
  }

  init_script()
  {
    if($('#fb-script'))
    {
      $('#fb-script').remove(); 
    }
    let script = this._renderer2.createElement('script');
    script.type = `text/javascript`;
    script.id = `fb-script`;
    script.text = `(function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v3.0";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));`;
    this._renderer2.appendChild(this._document.body, script);
  }

  fetch_single_blog(url)
  {
    let data = {token : '',url:this.url};
      this.spinner.show();
      this.todoservice.fetch_single_blog(data)
      .subscribe(
        data => 
        {
          this.post = data.post;
          this.recent_posts = data.recent_posts;
          this.spinner.hide();
          this.meta.addTag({ name: 'description', content: this.post[0].metaDesc });
          this.meta.addTag({ name: 'keywords', content: this.post[0].metaKeyword });
          this.title.setTitle(this.post[0].metaTitle);
          this.fetch_post_comments();
        }
      )
  }
  decode_html(html)
  {
   var textArea = document.createElement('textarea');
   textArea.innerHTML = html;
   return textArea.value;
  }
  fetch_post_comments()
  {
    let data :any = {};
    data.post_id = this.post[0].id;

    this.spinner.show();
      this.todoservice.fetch_post_comments(data)
      .subscribe(
        data => 
        {
          this.comments = data.COMMENTS;
          this.spinner.hide();
        }
      )
  }
  comment_submit(value) 
  {
    let data = value;
    data.post_id = this.post[0].id;
    data.token = this.get_token();
    this.spinner.show();
      this.todoservice.submit_comment(data)
      .subscribe(
        data => 
        {
          if(data.status == true)
          {
            this.toastr.successToastr(data.msg);
            this.fetch_post_comments();
          }
          else
          {
            this.toastr.errorToastr(data.msg);
          }
          this.spinner.hide();
        }
      )
  }
  show_comment_box()
  {
    $('.leave-comment-button').remove();
    $('.leave-comment').removeClass('hide');
  }

  show_login()
  {
    $('.logup.modal-trigger').click();
  }

  get_token()
  {
    return this.authservice.auth_token();
  }
}
