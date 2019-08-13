import { Component, OnInit ,Input,ViewContainerRef} from '@angular/core';
import { TodoService } from '../../todo.service';
import { AuthService } from '../../auth.service';
import { FormControl } from '@angular/forms'; 
import { Router } from '@angular/router'
import { Meta ,Title} from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { map, startWith} from 'rxjs/operators';
import { Observable} from 'rxjs';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit{
  page : string;
  navigate : boolean = false;
  year :  number = new Date().getFullYear();
  options: any ;
  default_queries : any;
  filterOptions : any;
  @Input() baseUrl;
  filterdList : boolean = false;
  myControl = new FormControl();
  filteredOptions: Observable<object>;
  constructor( public todoservice : TodoService,
  private toast : ToastsManager,  
  private spinner: NgxSpinnerService,
  private vcr :ViewContainerRef,
    private authservice : AuthService,private router : Router, private title: Title, private meta : Meta) {
  ///this.fetch_page_data();
    window.scroll(0,0);
    this.toast.setRootViewContainerRef(vcr);
     if(!this.todoservice.footer_data)
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
          if(this.navigate == true)
          {
            this.todoservice.set_page_data(data.PAGEDATA[0]);
            if(this.todoservice.page)
               $('#page-content').html(this.todoservice.get_page().description);
            this.navigate = false; 
            this.meta.addTag({ name: 'description', content: this.todoservice.get_page().metaDesc });
            this.meta.addTag({ name: 'keywords', content: this.todoservice.get_page().metaKeyword });
            this.title.setTitle(this.todoservice.get_page().metaTitle);  
          }
          else
          {
            this.todoservice.set_footer_data(data.PAGEDATA[0]);
            if(this.todoservice.footer_data)
               $('#footer-content').html(this.todoservice.get_footer_page().description);
          }
          this.spinner.hide();
        }
      ) 
   }
  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    ); 
    this.defaut_query()
  }

  defaut_query()
  {
    let data :any;
    this.todoservice.defalut_queries(data)
        .subscribe(
          data => 
          {
            this.default_queries = data.default_queries;
            //console.log(this.default_queries);
          }
        ) 
  }
  fetch_list(e)
  {
    if(e.target.value.length == 1)
    {
      let data : any;
      this.todoservice.fetch_bot_list(data)
        .subscribe(
          data => 
          {
            this.options = data.bot_list;
            this.filterdList = true;
            this.filterOptions = this._filter(e.target.value);
          }
        ) 
    }
    else
    {
      this.filterOptions = this._filter(e.target.value);
    }
    
  }
  private _filter(value: string): object {
    if(this.options)
    {
      const filterValue = value.toLowerCase();
      return this.options.filter(option => option.search_words.toLowerCase().includes(value));
    }
  }
  
  get_token()
  {
    return this.authservice.auth_token();
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
  
  search_query()
  {

  }
}

