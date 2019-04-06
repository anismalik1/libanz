import { Component, OnInit ,Input,ViewContainerRef} from '@angular/core';
import { TodoService } from '../../todo.service';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router'
import { Meta ,Title} from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit{
  page : string;
  @Input() baseUrl;
  constructor( public todoservice : TodoService,
  private toast : ToastsManager,  
  private spinner: NgxSpinnerService,
  private vcr :ViewContainerRef,
    private authservice : AuthService,private router : Router, private title: Title, private meta : Meta) {
  ///this.fetch_page_data();
    window.scroll(0,0);
    this.toast.setRootViewContainerRef(vcr);
     if(!this.todoservice.footer_data.storage)
     {
       this.page = 'footer';
       this.fetch_page_data();
     } 
   }
   fetch_page_data()
   {
    let page = { page : this.page };
    if(page.page == '')
    {
        return false;
    } 
    this.spinner.show();
    this.todoservice.fetch_page_data(page)
      .subscribe(
        data => 
        {
          this.todoservice.set_footer_data(data.PAGEDATA[0]);
         if(this.todoservice.footer_data)
            $('#footer-content').html(this.todoservice.get_footer_page().description);
          this.spinner.hide();
        }
      ) 
   }
  ngOnInit() {
  }
  
  get_token()
  {
    return this.authservice.auth_token();
  }
  navigate_to(u)
  {
    this.page = u;
    this.fetch_page_data();
  }
  subscribe_newsletters(data)
  {
    if(this.get_token())
    {
      data.token = this.get_token();
    }
    if(data.email != '')
    {
      this.todoservice.subscribe_newsletters(data)
      .subscribe(
        data => 
        {
          this.toast.error(data.msg);
          this.spinner.hide();
        }
      ) 
    }
    else
    {
      this.toast.error("Error! Please Enter Email.");
    }
  }
}

