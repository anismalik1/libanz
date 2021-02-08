import { Component, OnInit,ViewContainerRef ,Renderer2,PLATFORM_ID,Inject} from '@angular/core';
import { DOCUMENT } from "@angular/common";
import { Meta,Title } from "@angular/platform-browser";
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Router,ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';
import { ProductService } from '../product.service';
import { TodoService } from '../todo.service';
import {isPlatformBrowser} from '@angular/common';
import {BehaviorSubject} from 'rxjs';

@Component({
  selector: 'app-channel-pack',
  templateUrl: './channel-pack.component.html',
  styles: []
})
export class ChannelPackComponent implements OnInit {
  static isBrowser = new BehaviorSubject<boolean>(null!);
  channel_id : Number;
  product_pack_rows : any = [];
  product_pack_info : any = [];
  channel_count : Number = 0;
  month : number;
  channels_packs : any;
  region : number;
  pack_box : any;
  category : number;
  pack_id : number;
  constructor( 
    @Inject(PLATFORM_ID) private platformId: any ,
    private _renderer2: Renderer2, 
    @Inject(DOCUMENT) private _document, 
    private spinner : NgxSpinnerService,
    private title: Title,
    private meta : Meta,
    private vcr: ViewContainerRef,
    private toastr: ToastrManager,
    private authservice : AuthService,
    private productservice : ProductService,
    public todoservice : TodoService,
    private router : ActivatedRoute, private route : Router
  ) { 
    ChannelPackComponent.isBrowser.next(isPlatformBrowser(platformId));
  }

  ngOnInit() {
    this.month = Number(this.todoservice.get_param('month'));
    this.category = Number(this.todoservice.get_param('category'));
    this.router.params.subscribe(params => {
      this.channel_id = params['id']; //log the value of id
      this.spinner.show();
      this.fetch_channels(this.channel_id);
    });
    if(isPlatformBrowser(this.platformId)) 
      this.init_script();
    this.todoservice.back_icon_template('Channel',this.todoservice.back())
  }

  init_script()
  {
    if($('#init-page-script'))
    {
      $('#init-page-script').remove();
    }
    let script = this._renderer2.createElement('script');
    script.id = `init-page-script`;
    script.type = `text/javascript`;
    script.text = `
    $(document).ready(function(){
      $('.modal').modal();
      $('#choosebox-modal').modal();
    $('.dropdown-button').dropdown({
      inDuration: 300,
      outDuration: 225,
      constrainWidth: true, // Does not change width of dropdown to that of the activator
      hover: false, // Activate on hover
      gutter: 0, // Spacing from edge
      belowOrigin: false, // Displays dropdown below the button
      alignment: 'left'
    });

    });
    `;
    this._renderer2.appendChild(this._document.body, script);
  }

  fetch_channels(channel)
  {
    if(this.month == 0 )
      this.month = 1 ;
    this.spinner.show();
		  let data = {token : this.get_token(),channel : channel,month:this.month};
		  this.productservice.fetch_channels(data)
		  .subscribe(
			data => 
			{
        
        let channel_list : string = '';
        let all_channel_packs = data.channel_packs;
        this.product_pack_info = data.pack_info;
        //console.log(this.product_pack_info);
        for(var i=0;i<data.channel_pack_ids.length;i++)
        {
          let temp = data.channel_pack_ids[i];
          let exist_id = all_channel_packs.filter(x => x.id == temp);
          if(exist_id.length > 0)
          {
            this.product_pack_rows.push(exist_id[0]);
          }
          
        }
        for(var j=0;j < this.product_pack_rows.length;j++)
        {
          channel_list += '<h3 class="font600">'+this.product_pack_rows[j].title+'</h3>';
          var channels = JSON.parse(this.product_pack_rows[j].channel_ids); 
          if( channels != null )
          {
            for(var k=0;k < channels.length;k++)
            {
              channel_list += '<li class="center"><span class="border-wrap"><img src="'+this.productservice.server_url+channels[k].img+'" class="responsive-img" alt="'+channels[k].name+'"><br><span class="font-size-change">'+channels[k].name+'</span></span></li>'; 
              this.channel_count = Number(this.channel_count) + 1; 
            }
          }
          
        }
        if(isPlatformBrowser(this.platformId)) 
        {
          if(channel_list != '')
            $('#product-pack').html(channel_list);
          else
            $('#product-pack').html("<li>Channel list is not updated.</li>");
        }
        
        this.meta.addTag({ name: 'description', content: data.pack_info.meta_description });
        this.meta.addTag({ name: 'keywords', content: data.pack_info.meta_keywords });
        this.title.setTitle(data.pack_info.meta_title); 
        this.spinner.hide();   
      }
      );
  }
  
  choose_box_for_this_pack(parent,id)
   {
     this.pack_id = id;
    if(this.category == undefined)
      return;
    this.spinner.show();
    this.todoservice.choose_box_for_this_pack({id: id,product_category: this.category})
    .subscribe(
      data => 
      {
        this.filter_products(parent,data.products)
        this.spinner.hide();  
      }
    ) 
   }
   filter_products(id,products)
   {
    this.pack_box = [];
    for(var i=0;i<products.length;i++)
    {
      var products_packs = $.parseJSON(products[i].channel_packages);
      //console.log(products_packs)
      for(var j=0;j<products_packs.length;j++)
      {
        //console.log(products_packs[j])
        if(products_packs[j] == id)
        {
          this.pack_box.push(products[i])
          break;
        }
      }
    }
   } 

  share_pack_to_mail()
  {
    var email = $("#sendmail-modal #pack-email").val();
    if(email == '' )
    {
      this.toastr.infoToastr("Enter a Valid Email.")
      return;
    }  
      this.productservice.share_pack_to_mail({channel:this.channel_id,email:email,pack:this.product_pack_info.title})
     .subscribe(
       data => 
       {
        if(data.status == true)
        {
          this.toastr.infoToastr(data.msg)
        }
        else
        {
          this.toastr.infoToastr("Something went wrong. Please try later.")
        } 
         this.spinner.hide();  
       }
     )
  }

  get_token()
  {
    return this.authservice.auth_token();
  }
}
