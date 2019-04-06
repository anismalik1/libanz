import { Component, OnInit,Renderer2,Inject } from '@angular/core';
import { DOCUMENT } from "@angular/platform-browser";
import { TodoService } from '../todo.service';
import { AuthService } from '../auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router'

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
  type : number = 1;
  p: number = 1;
  complaints_counts : number ;
  constructor( private _renderer2: Renderer2,  @Inject(DOCUMENT) private _document,private spinner : NgxSpinnerService,public todoservice : TodoService,private authservice : AuthService,private router : Router) { }
  ngOnInit() {
    if(!this.get_token())
    {
      let full_url = this.router.url.split('/');
      if(!full_url[2])
       full_url[2] = '';
      else
        full_url[2] = '#'+full_url[2];
      this.router.navigate(['/login/ref/'+full_url[1]+full_url[2]]);
    } 
    $(document).ready(function() {
        $('.filter-show').on('click',function(){
            $('.filter-he').removeClass('hide');
            $('.filter-he').toggle(500);
        });
    });
    this.fetch_complaints(this.type,1);
    let script = this._renderer2.createElement('script');
    script.type = `text/javascript`;
    script.text = `
    $('.modal').modal();
      $('.modal-close').on('click', function(){
       $('.modal').modal('close');
      });
    `;
    this._renderer2.appendChild(this._document.body, script);
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
            this.router.navigate(['/login']);
          }
          let b = JSON.stringify(data);
          data =  JSON.parse(b.replace(/\\/g, ''));
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
            this.router.navigate(['/login']);
          }
          let b = JSON.stringify(data);
          data =  JSON.parse(b.replace(/\\/g, ''));
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

