import { Component, OnInit,Renderer2,Inject } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms'
import { DOCUMENT } from "@angular/platform-browser";
import { TodoService } from '../todo.service';
import { Router ,ActivatedRoute} from '@angular/router';
import { Meta ,Title} from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

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
    private toastr : ToastsManager,
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
      this.meta.addTag({ name: 'description', content: "Tata Sky Packages | All Tata Sky Packages" });
      this.meta.addTag({ name: 'keywords', content: "Tata Sky Packages | All Tata Sky Packages" });
      this.title.setTitle("Tata Sky Packages | All Tata Sky Packages");
      this.package.category = 'Tata Sky';
    }
    else if(this.url == 'airtel')
    {
      this.package.category = 'Airtel';
      this.meta.addTag({ name: 'description', content: "Airtel Packages | All Airtel Packages" });
      this.meta.addTag({ name: 'keywords', content: "Airtel Packages | All Airtel Packages" });
      this.title.setTitle("Airtel Packages | All Airtel Packages");
    }
    else if(this.url == 'dish-tv')
    {
      this.package.category = 'Dishtv';
      this.meta.addTag({ name: 'description', content: "Dishtv Packages | All Dishtv Packages" });
      this.meta.addTag({ name: 'keywords', content: "Dishtv Packages | All Dishtv Packages" });
      this.title.setTitle("Dishtv Packages | All Dishtv Packages");
    }
    else if(this.url == 'videocon')
    {
      this.package.category = 'Videocon';
      this.meta.addTag({ name: 'description', content: "Videocon Packages | All Videocon Packages" });
      this.meta.addTag({ name: 'keywords', content: "Videocon Packages | All Videocon Packages" });
      this.title.setTitle("Videocon Packages | All Videocon Packages");
    }
    this.package_data();
    $('.fb-share-button').attr('data-href',"https://www.mydthshop.com"+this.path);
   
    setTimeout (() => {
      this.init_script();
    }, 2000);

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
          this.toastr.success('Great! Mail Sent Successful.');
        else
          this.toastr.success('Failed! Please Try Later.'); 
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

