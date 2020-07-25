import { Component, OnInit,Renderer2,Inject } from '@angular/core';
import { DOCUMENT } from "@angular/common";
import { TodoService } from '../todo.service';
import { AuthService } from '../auth.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router,ActivatedRoute } from '@angular/router'
import { FormGroup,FormBuilder,Validators } from '@angular/forms';

@Component({
  selector: 'app-complaint-box',
  templateUrl: './complaint-box.component.html',
  styles: [],
  providers : [NgxSpinnerService]
})
export class ComplaintBoxComponent implements OnInit{

  loop_info : boolean = false;
  complaints : object = {};
  complaint_info : any ;
  type : string = 'all';
  p: number = 1;
  display : number = 1;
  complaintgroup : FormGroup;
  complaints_counts : number ;
  complaint_id : number;
  recent_comments : any = [];
  constructor( private _renderer2: Renderer2,private toastr : ToastrManager,private fb: FormBuilder,  @Inject(DOCUMENT) private _document,private spinner : NgxSpinnerService,public todoservice : TodoService,private authservice : AuthService,private router : Router,private route: ActivatedRoute) { }
  ngOnInit() {
    if(!this.get_token())
    {
      let full_url = this.router.url.split('/');
      if(!full_url[2])
       full_url[2] = '';
      else
        full_url[2] = '#'+full_url[2];
      this.router.navigate(['/proceed/login/ref/'+full_url[1]+full_url[2]]);
      return false;
    } 
    this.route.params.subscribe(params => {
      this.type = params['name']; //log the value of id
      if(this.type && this.type.length > 3)
      {
        $('#ticket-id').val(this.type);
        this.seach_ticket();
      }
      else
        this.fetch_complaints(this.type,1);
    });
    $(document).ready(function() {
        $('.filter-show').on('click',function(){
            $('.filter-he').removeClass('hide');
            $('.filter-he').toggle(500);
        });
    });
    
    let script = this._renderer2.createElement('script');
    script.type = `text/javascript`;
    script.text = `
    $('.modal').modal();
      $('.modal-close').on('click', function(){
       $('.modal').modal('close');
      });
    `;
    this._renderer2.appendChild(this._document.body, script);
    this.complaintgroup = this.fb.group({
      'title' : [null,Validators.compose([Validators.required])]
     });
  }
  init_complaint(id)
  {
    this.recent_comments = [];
    this.complaint_id = id;
  }
  show_all_comment(id)
  {
    this.complaint_id = id;
    this.spinner.show();
    if(this.authservice.retrieveToken())
    {
      let data = { token : this.get_token() ,order_id : id };
      this.todoservice.recent_comments(data)
      .subscribe(
        data => 
        {
          if(data == 'Invalid Token')
          {
            this.authservice.clear_session();
            this.router.navigate(['/proceed/login']);
          }
          this.recent_comments = data.RECENT_COMMENT;
          this.spinner.hide();
        }
      ) 
    }  
  }
  reply_complaint(data)
  {
    if(!this.authservice.authenticate())
    {
        this.router.navigate(['/proceed/login']);
        return;
    }
    this.spinner.show();
    data.token = this.get_token();
    data.order_id = this.complaint_id;
    this.todoservice.add_complaint(data)
		.subscribe(
			data => 
			{
				this.spinner.hide();
			  if(data.status == 'Invalid Token')
			  {
          this.authservice.clear_session();
          this.router.navigate(['/proceed/login']);
			  }
			  if(!jQuery.isEmptyObject(data))
			  {			
          this.toastr.successToastr(data.msg);
          let url = window.location.pathname;
            if(url == url)
            {
              this.router.routeReuseStrategy.shouldReuseRoute = function(){
                return false;
             }
              this.router.navigated = false;
              this.router.navigate([url]);	
			      }
        }
      }  
		  );
  }
  check_val(val)
  {
    if(typeof val == 'undefined')
      this.display = 2;
  }
  getPage(page)
  {
	  this.spinner.show();
	  this.fetch_complaints(this.type,page);
	  this.p = page;
  }
  fetch_complaints(type,page)
  {
    this.spinner.show();
    if(this.authservice.retrieveToken())
    {
      let data = {token : this.get_token(),status : type, page_index:page};
      this.todoservice.fetch_complaints(data)
      .subscribe(
        data => 
        {
          if(data == 'Invalid Token')
          {
            this.authservice.clear_session();
            this.router.navigate(['/proceed/login']);
          }

          this.spinner.hide();
          if(!jQuery.isEmptyObject(data))
          {
            this.complaints = data.COMPLAINTS;
            this.complaints_counts = data.COUNTS;
          }
        }
      )  
    } 
  }

  seach_ticket()
  {
    var key = $("#ticket-id").val();
    if(key == "")
    {
      return false;
    }
    this.spinner.show();
    if(this.authservice.retrieveToken())
    {
      let data = {token : this.get_token(),key : key};
      this.todoservice.fetch_complaint_by_key(data)
      .subscribe(
        data => 
        {
          if(data == 'Invalid Token')
          {
            this.authservice.clear_session();
            this.router.navigate(['/proceed/login']);
          }

          this.spinner.hide();
          if(!jQuery.isEmptyObject(data))
          {
            this.complaints = data.COMPLAINTS;
            this.complaints_counts = data.COMPLAINTS.length;
          }

          
        }
      )  
    } 
  }

  navigate_to(url)
  {
    if(url == url)
      {
        this.router.routeReuseStrategy.shouldReuseRoute = function(){
          return false;
        }
      //console.log(url) 
      this.router.navigated = false;
      this.router.navigate([url]);
    }
  }

  complaint_invoice(id)
  {
    if(this.authservice.retrieveToken())
    {
      let data = {token : this.get_token(),complaint_id:id};
      this.todoservice.fetch_complaint_info(data)
      .subscribe(
        data => 
        {
          if(data.status == 'Invalid Token')
          {
            this.authservice.clear_session();
            this.router.navigate(['/proceed/login']);
          }
          this.complaint_info = data.COMPLAINT; 
          if(!jQuery.isEmptyObject(this.complaints))
          {
            this.loop_info = true;
          }
        }
      )  
    }
  }

  get_token()
  {
    return this.authservice.auth_token();
  }
}

