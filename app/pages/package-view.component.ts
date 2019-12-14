import { Component, OnInit,Renderer2,Inject } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms'
import { DOCUMENT } from "@angular/common";
import { TodoService } from '../todo.service';
import { Router ,ActivatedRoute} from '@angular/router';
import { Meta ,Title} from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-package-view',
  templateUrl: './package-view.component.html',
  styles: []
})
export class PackageViewComponent implements OnInit {
  package : any ; 
  path : string;
  package_list : any;
  details : boolean = false;
  url : string;
  pack_id : number;
  sharemailgroup : FormGroup;
  constructor(private title: Title, public todoservice : TodoService,
    private spinner: NgxSpinnerService,private router : Router,
    private _renderer2: Renderer2,  
    @Inject(DOCUMENT) private _document, 
    private toastr : ToastrManager,
     private meta : Meta, 
     private fb: FormBuilder,
     private route : ActivatedRoute) { 
      this.sharemailgroup = fb.group({
        'email' : [null,Validators.email],
      });
     }

  ngOnInit() {
    
    this.package = { month : 1,category : ''};
    this.path = window.location.pathname;
    this.route.params.subscribe(params => {
      this.url = params['name'];
      if(params['id'])
      {
        this.details = true;
        this.pack_id = params['id'];
        this.package.pack_id = this.pack_id;
      }
    }); 

    if(this.url == 'tata-sky')
    {
      this.fetch_page_data('/package-list/tata-sky');
      this.package.category = 'Tata Sky';
    }
    else if(this.url == 'airtel')
    {
      this.fetch_page_data('/package-list/airtel');
      this.package.category = 'Airtel';
    }
    else if(this.url == 'dish-tv')
    {
      this.fetch_page_data('/package-list/dish-tv');
      this.package.category = 'Dishtv';
    }
    else if(this.url == 'videocon')
    {
      this.fetch_page_data('/package-list/videocon');
      this.package.category = 'Videocon';
    }
    this.package_data();
    $('.fb-share-button').attr('data-href',"https://www.mydthshop.com"+this.path);
   
    setTimeout (() => {
      this.init_script();
    }, 2000);

  }
  goto_package()
  {
    setTimeout (() => {
      let url = window.location.pathname;
    if(url == url)
    {
      this.router.routeReuseStrategy.shouldReuseRoute = function(){
        return false;
      }
      this.router.navigated = false;
      this.router.navigate([url]);
    }
    }, 300);
    
  }
  fetch_page_data(page_url)
  {
   let page = {page : page_url}; 
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
           $('#page-content').html(this.todoservice.get_page().description);
           this.meta.addTag({ name: 'description', content: this.todoservice.get_page().metaDesc });
           this.meta.addTag({ name: 'keywords', content: this.todoservice.get_page().metaKeyword });
           this.title.setTitle(this.todoservice.get_page().metaTitle);
         }
         this.spinner.hide();  
       }
     ) 
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
    }(document, 'script', 'facebook-jssdk'));
    $('#sharemail-modal').modal();
    `;
    this._renderer2.appendChild(this._document.body, script);
  }

  package_data()
  {
    this.spinner.show(); 
    if(this.package.category == '')
    {
        return false;
    }
    this.todoservice.fetch_package_data(this.package)
      .subscribe(
        data => 
        {
          this.package_list = data.package;
          if(this.details == true)
          {
            this.meta.addTag({ name: 'description', content:  data.package[0].title});
            this.meta.addTag({ name: 'keywords', content: "Pack "+data.package[0].title +" Detail" });
            this.title.setTitle( data.package[0].title+ " | MydthShop");
          }
          this.spinner.hide();  
        }
      ) 
   }
   ini_pack(id)
   {
    this.pack_id = id;
   }
   share_to_mail(form)
   {
     if(this.pack_id)
      form.url = 'https://www.mydthshop.com/package-list/'+this.url+'/'+this.pack_id;
     else
      form.url = 'https://www.mydthshop.com/package-list/'+this.url;
     this.todoservice.share_channel_pack_on_mail(form)
     .subscribe(
      data => 
      {
        if(data.status == true)
          this.toastr.successToastr('Great! Mail Sent Successful.');
        else
          this.toastr.successToastr('Failed! Please Try Later.'); 
        this.spinner.hide();  
      }
    ) 
   }
   remove_new_line(str)
  {
    //console.log(str.replace(/(\r\n|\n|\r|↵)/g,""));
    return str.replace(/(\r\n|\n|\r|↵|rn)/g,"");
  }
}

