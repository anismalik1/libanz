import { Component, OnInit ,ViewContainerRef} from '@angular/core';
import { Meta,Title } from "@angular/platform-browser";
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms'
import { TodoService } from '../todo.service';
import { AuthService } from '../auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { Router,ActivatedRoute } from '@angular/router';
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
  constructor(
    public todoservice : TodoService,
    private authservice : AuthService,
    private toastr: ToastsManager,
    private router : ActivatedRoute,
    private  meta : Meta,
    private title : Title, 
    private vcr: ViewContainerRef,
    private spinner : NgxSpinnerService,
    private fb: FormBuilder
  ) { 
    this.toastr.setRootViewContainerRef(vcr);
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
   });
   
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
        }
      )
  }
  comment_submit(value) 
  {
    let data = value;
    data.token = this.get_token();
    data.post_id = this.post[0].id;

    this.spinner.show();
      this.todoservice.submit_comment(data)
      .subscribe(
        data => 
        {
          this.toastr.success(data.msg);
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
