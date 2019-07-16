import { Component, OnInit,Pipe } from '@angular/core';
import { TodoService } from '../todo.service';
import { Router ,ActivatedRoute} from '@angular/router';
import { Meta ,Title} from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-merchant',
  templateUrl: './merchant.component.html',
  styles: []
})
export class MerchantComponent implements OnInit {
  page : any;
  constructor(private title: Title, public todoservice : TodoService,
    private spinner: NgxSpinnerService,private router : Router,
     private meta : Meta, private route : ActivatedRoute) { 
      this.page = route.snapshot.url[0].path;
      this.spinner.show();
      this.fetch_page_data();
      window.scroll(0,0);
     }

  ngOnInit() {
    
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
           if(data.PAGEDATA[0].image != '')
             $('.hero').css('background','url(https://www.mydthshop.com/accounts/assets/img/cms/'+data.PAGEDATA[0].image+')');
             $('.hero').css('background-repeat','no-repeat');
           $('#page-content').after(this.todoservice.get_page().description);
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
