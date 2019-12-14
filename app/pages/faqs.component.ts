import { Component, OnInit ,ViewContainerRef,Renderer2,Inject} from '@angular/core';
import { FormBuilder, Validators, FormGroup ,FormControl} from '@angular/forms';
import { DOCUMENT } from "@angular/common";
import { Router,ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';
import { TodoService } from '../todo.service';
import { Observable} from 'rxjs';
import { User } from '../user';
import { NgxSpinnerService } from 'ngx-spinner';
import { PaginationService } from 'ngx-pagination';
import { ToastrManager } from 'ng6-toastr-notifications';
import * as $ from 'jquery';
@Component({
  selector: 'app-faqs',
  templateUrl: './faqs.component.html',
  styles: [],
  providers: [TodoService,User,AuthService,PaginationService]
})
export class FaqsComponent implements OnInit {
  faqsgroup : FormGroup;
  unsatisfiedformgroup : FormGroup;
  faqs : any;
  single : any;
  search_list : any = [];
  searched : boolean = false;
  faq_url : string;
  default_queries : any;
  query_string : any;
  o_p: number = 1;
  search_count : number = 0;
  product_images : any;
  suggested_product : any;
  myControl = new FormControl();
  options: any = [{ title: 'One',id:1},{title:  'Two',id:2},{title: 'Three',id:3}];
  filteredOptions: Observable<object>;
  filterdList : boolean = false;

  constructor(
    private fb: FormBuilder,
    private todoservice: TodoService,
    private spinner : NgxSpinnerService,
    private toastr: ToastrManager,
    private vcr: ViewContainerRef,
    private authservice : AuthService,
    private _renderer2: Renderer2, 
    private router : ActivatedRoute, 
    private route : Router,

    @Inject(DOCUMENT) private _document, 
  ) {
      this.faqsgroup = fb.group({
        'name' : [null,Validators.compose([Validators.required])],
        'email' : [null,Validators.email],
        'message' : ['',Validators.compose([Validators.required])],
        'phone' : ['',Validators.compose([Validators.required])],
      });

      this.unsatisfiedformgroup = fb.group({
        'hint' : [null],
        'email' : [null,Validators.compose([Validators.required,Validators.email])],
        'comment' : ['',Validators.compose([Validators.required])],
      });
   }

  ngOnInit() {
    if(this.todoservice.get_param('q'))
    {
      this.query_string = this.todoservice.get_param('q');
      this.query_string = this.query_string.replace(/%20/g, " ");
      //console.log(this.query_string)
      this.myControl.setValue(this.query_string);
      this.search_faqs(1);
    }
    
    this.router.params.subscribe(params => {
      let url = params['name']; //log the value of id
      this.faq_url = url;
      if(typeof url != 'undefined')
      {
        this.print_faq(url);
      }
        
    });
    
    //this.faqs_list();
    this.init_script();
    this.defaut_query();
  }

  unsatisfied(form)
  {
    form.faq_url = this.faq_url;
    this.spinner.show();
    this.todoservice.send_feed({token : this.get_token(),form: form})
    .subscribe(
      data => 
      {
        this.spinner.hide();
        this.toastr.errorToastr("Thank you. Your feedback helps us to continually improve our content.");
      }
    ) 
  }
  init_script()
  {
    if($('#collapse-script'))
    {
      $('#collapse-script').remove();
    }
	  let script = this._renderer2.createElement('script');
    script.type = `text/javascript`;
    script.id = `collapse-script`;
    script.text = `
    $(document).ready(function(){
      
      $('.collapsible').collapsible();
      $('.modal').modal();
      $('.faq-new-lider').lightSlider({
        item: 1,
        auto: false,
        loop: false,
        pause: 3000,
        controls: true,
        pager: false,
        responsive: [
        {
          breakpoint:900,
          settings: {
            item:1
          }
        },
        {
          breakpoint:600,
          settings: {
            item:1
          }
        },
        {
          breakpoint:380,
          settings: {
            item:1
          }
        }
        ]
      });
    })
   
    `;
    this._renderer2.appendChild(this._document.body, script);
  }

  go_to_form()
  {
    $('html, body').animate({
      scrollTop: $(".ask-question").offset().top
    }, 1000);
  }

  search_me(event)
    {
      let data :any = {};
      data.search = event;
      this.query_string = event;
      this.todoservice.get_faqs_search_keywords(data)
      .subscribe(
        data => 
        {
          if(!jQuery.isEmptyObject(data))
          {
            this.filterdList = true;
            this.filter_keywords(data.searches);
            //this.filteredOptions = data.searches;
          }
        }
      ) 
    }
    find(val)
    {
      this.query_string = val;
      this.go_to_search()
    }
    filter_keywords(keywords)
    {
      let keys : any  = [];
      for(var i = 0;i < keywords.length;i++)
      {
        let arr = keywords[i].meta_keyword.split(",");
        for(var j = 0;j < arr.length;j++)
        {
          if(arr[j].toLowerCase().includes(this.query_string.toLowerCase()))
          {
            if(keys.length >= 10)
            {
              break;
            }
            if(!keys.includes(arr[j]))
              keys.push(arr[j]) 
          }
        }
        if(keys.length >= 10)
        {
          break;
        }
      }
      this.filteredOptions = keys;
    }   
  thanks()
  {
    this.toastr.errorToastr("Thank you. Your feedback helps us to continually improve our content.");
  }
 
  faqs_list()
  {
    this.spinner.show();
    this.todoservice.faqs_list({token : this.get_token()})
    .subscribe(
      data => 
      {
        this.spinner.hide();
        this.faqs = data.faqs;
        this.init_script();
      }
    ) 
  }
  defaut_query()
  {
    let data :any;
    this.todoservice.defalut_queries(data)
      .subscribe(
        data => 
        {
          this.default_queries = data.default_queries;
          this.spinner.hide();
        }
      ) 
  }
  getPage(page,id)
  {
    this.spinner.show();
      this.search_faqs(page);
      this.o_p = page;
  }
  go_to_search()
  {
    var key : any = '';
    if(this.query_string == '')
      key = $("#faq_key").val();
    else
      key = this.query_string; 
    if(1 == 1)
    {
      this.route.routeReuseStrategy.shouldReuseRoute = function(){
        return false;
      }
    }  
    this.route.navigated = false;
    this.route.navigate([ '/p/faqs' ], { queryParams: { q: key } });
  }
  
  search_faqs(page)
  {
    this.spinner.show();
    this.todoservice.search_faqs_list({search : this.query_string,page:page})
    .subscribe(
      data => 
      {
        this.spinner.hide();
        //this.faqs = data.faqs;
        this.init_script();
        this.search_list = data.searches;
        if(data.search_count)
          this.search_count = data.search_count;
        if(data.products)
        {
          this.product_images = data.products; 
          this.init_script()
        } 
        if(data.suggested_products)
        {
          this.suggested_product = data.suggested_products;
        }  
        this.searched = true;
      }
    )
  }
  print_faq(url)
  {
    this.spinner.show();
    this.todoservice.print_faq({url: url})
    .subscribe(
      data => 
      {
        this.spinner.hide();
        this.single = data.faq[0];
        this.route.navigate(['/p/faqs/'+this.single.url])
        this.search_list = [];
      }
    ) 
  }
  faqs_submit(data)
  {
    if(this.get_token())
    {
      data.token  = this.get_token();
    }
    this.spinner.show();
    this.todoservice.save_faqs_form(data)
    .subscribe(
      data => 
      {
        let b = JSON.stringify(data);
        data =  JSON.parse(b.replace(/\\/g, ''));
        this.spinner.hide();
        if(data.status == true)
        {
          this.toastr.errorToastr("Successful! We Have Received Your Query And will be back to you soon.");
        }
      }
    )  
  }

  get_token()
  {
    return this.authservice.auth_token();
  }
}
