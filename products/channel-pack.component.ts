import { Component, OnInit,ViewContainerRef ,Renderer2,Inject} from '@angular/core';
import { DOCUMENT,Meta,Title } from "@angular/platform-browser";
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Router,ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';
import { ProductService } from '../product.service';
@Component({
  selector: 'app-channel-pack',
  templateUrl: './channel-pack.component.html',
  styles: []
})
export class ChannelPackComponent implements OnInit {

  channel_id : Number;
  product_pack_rows : any = [];
  product_pack_info : any = [];
  channel_count : Number = 0;
  constructor( 
    private _renderer2: Renderer2, 
    @Inject(DOCUMENT) private _document, 
    private spinner : NgxSpinnerService,
    private title: Title,
    private meta : Meta,
    private vcr: ViewContainerRef,
    private toastr: ToastsManager,
    private authservice : AuthService,
    private productservice : ProductService,
    private router : ActivatedRoute, private route : Router
  ) { 

  }

  ngOnInit() {
    this.router.params.subscribe(params => {
      this.channel_id = params['id']; //log the value of id
      this.fetch_channels(this.channel_id);
    });
  }
  fetch_channels(channel)
  {
    this.spinner.show();
		  let data = {token : this.get_token(),channel : channel};
		  this.productservice.fetch_channels(data)
		  .subscribe(
			data => 
			{
        this.spinner.hide();
        let channel_list : string = '';
        let all_channel_packs = data.channel_packs;
        this.product_pack_info = data.pack_info;
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
          for(var k=0;k < channels.length;k++)
          {
            channel_list += '<li class="center"><img src="'+this.productservice.server_url+channels[k].img+'" class="responsive-img" alt="'+channels[k].name+'"><br><span class="font-size-change">'+channels[k].name+'</span></li>'; 
            this.channel_count = Number(this.channel_count) + 1; 
          }
        }
        if(channel_list != '')
          $('#product-pack').html(channel_list);
        this.meta.addTag({ name: 'description', content: data.pack_info.meta_description });
        this.meta.addTag({ name: 'keywords', content: data.pack_info.meta_keywords });
        this.title.setTitle(data.pack_info.meta_title);  
      }
      );
  }
  get_token()
  {
    return this.authservice.auth_token();
  }
}
