import { Component, OnInit,ViewContainerRef ,Renderer2,Inject} from '@angular/core';
import { DOCUMENT,Meta,Title } from "@angular/platform-browser";
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Router,ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';
import { ProductService } from '../product.service';
import { TodoService } from '../todo.service';
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
  month : number;
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
    private todoservice : TodoService,
    private router : ActivatedRoute, private route : Router
  ) { 

  }

  ngOnInit() {
    this.month = Number(this.todoservice.get_param('month'));
    this.router.params.subscribe(params => {
      this.channel_id = params['id']; //log the value of id
      this.fetch_channels(this.channel_id);
    });
    this.init_script();
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
        else
         $('#product-pack').html("<li>Channel list is not updated.</li>");
        this.meta.addTag({ name: 'description', content: data.pack_info.meta_description });
        this.meta.addTag({ name: 'keywords', content: data.pack_info.meta_keywords });
        this.title.setTitle(data.pack_info.meta_title);  
      }
      );
  }
  share_pack_to_mail()
  {
    var email = $("#sendmail-modal #pack-email").val();
    if(email == '' )
    {
      return false;
    }  
      this.productservice.share_pack_to_mail({channel:this.channel_id,email:email,pack:this.product_pack_info.title})
     .subscribe(
       data => 
       {
        if(data.status == true)
        {
          this.toastr.info(data.msg)
        }
        else
        {
          this.toastr.info("Something went wrong. Please try later.")
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
