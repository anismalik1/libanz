import { Component, OnInit,Renderer2,Inject} from '@angular/core';
import { Meta,Title } from "@angular/platform-browser";
import { DOCUMENT } from "@angular/common";
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms'
import { Router ,ActivatedRoute} from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../auth.service';
import { TodoService } from '../todo.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import * as $ from 'jquery'; 
@Component({
  selector: 'app-notify',
  templateUrl: './notify.component.html',
  styles: []
})
export class NotifyComponent implements OnInit {
  usergroup : FormGroup;
  user_type : Number;
  page: any;
  constructor(
    private _renderer2: Renderer2, 
    @Inject(DOCUMENT) private _document, 
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private todoservice : TodoService,
    private toastr : ToastrManager,
    private activatedroute: ActivatedRoute,
    private authservice : AuthService,
    private meta: Meta,
    private title: Title
  ) { 
    this.usergroup = fb.group({
      'name' : [null,Validators.compose([Validators.required])],
      'phone' : [null,Validators.compose([Validators.required])],
      'email' : [null,Validators.compose([Validators.required])],
    });
  }

  ngOnInit() {
    this.init();
    this.user_type = this.activatedroute.snapshot.params['id'];
    this.page = 'notification/user-notify/'+this.user_type;
    this.fetch_page_data();
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
           $('#page-content').html(this.todoservice.get_page().description);
           $('#page-shortcontent').html(this.todoservice.get_page().shortDescription);
          this.meta.addTag({ name: 'description', content: this.todoservice.get_page().metaDesc });
          this.meta.addTag({ name: 'keywords', content: this.todoservice.get_page().metaKeyword });
          this.title.setTitle(this.todoservice.get_page().metaTitle);
          window.scroll(0,0); 
        }
        this.spinner.hide();  
      }
    ) 
 }

  init()
  {
    if($('#init-page-script'))
    {
      $('#init-page-script').remove();
    }
    let script = this._renderer2.createElement('script');
    script.id = `init-page-script`;
    script.type = `text/javascript`;
    script.text = `
    var ringer = {
      //countdown_to: "10/31/2014",
      countdown_to: "11/5/2019",
      rings: {
        'DAYS': { 
          s: 86400000, // mseconds in a day,
          max: 365
        },
        'HOURS': {
          s: 3600000, // mseconds per hour,
          max: 24
        },
        'MINUTES': {
          s: 60000, // mseconds per minute
          max: 60
        },
        'SECONDS': {
          s: 1000,
          max: 60
        },
        'MICROSEC': {
          s: 10,
          max: 100
        }
       },
      r_count: 4,
      r_spacing: 20, // px
      r_size: 100, // px
      r_thickness: 3, // px
      update_interval: 30, // ms
        
        
      init: function(){
       
        $r = ringer;
        $r.cvs = document.createElement('canvas'); 
        
        $r.size = { 
          w: ($r.r_size + $r.r_thickness) * $r.r_count + ($r.r_spacing*($r.r_count-1)), 
          h: ($r.r_size + $r.r_thickness) 
        };
        
        $r.cvs.setAttribute('width',$r.size.w);           
        $r.cvs.setAttribute('height',$r.size.h);
        $r.ctx = $r.cvs.getContext('2d');
        $(document.body).append($r.cvs);
        $r.cvs = $($r.cvs);    
        $r.ctx.textAlign = 'center';
        $r.actual_size = $r.r_size + $r.r_thickness;
        $r.countdown_to_time = new Date($r.countdown_to).getTime();
        $r.cvs.css({ width: $r.size.w+"px", height: $r.size.h+"px" });
        $r.go();
      },
      ctx: null,
      go: function(){
        var idx=0;
        
        $r.time = (new Date().getTime()) - $r.countdown_to_time;
        
        
        for(var r_key in $r.rings) $r.unit(idx++,r_key,$r.rings[r_key]);      
        
        setTimeout($r.go,$r.update_interval);
      },
      unit: function(idx,label,ring) {
        var x,y, value, ring_secs = ring.s;
        value = parseFloat($r.time/ring_secs);
        $r.time-=Math.round(parseInt(value)) * ring_secs;
        value = Math.abs(value);
        
        x = ($r.r_size*.5 + $r.r_thickness*.5);
        x +=+(idx*($r.r_size+$r.r_spacing+$r.r_thickness));
        y = $r.r_size*.5;
        y += $r.r_thickness*.5;
  
        
        // calculate arc end angle
        var degrees = 360-(value / ring.max) * 360.0;
        var endAngle = degrees * (Math.PI / 180);
        
        $r.ctx.save();
  
        $r.ctx.translate(x,y);
        $r.ctx.clearRect($r.actual_size*-0.5,$r.actual_size*-0.5,$r.actual_size,$r.actual_size);
  
        // first circle
        $r.ctx.strokeStyle = "rgba(255,255,166,0.3)";
        $r.ctx.beginPath();
        $r.ctx.arc(0,0,$r.r_size/2,0,2 * Math.PI, 2);
        $r.ctx.lineWidth =$r.r_thickness;
        $r.ctx.stroke();
       
        // second circle
        $r.ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
        $r.ctx.beginPath();
        $r.ctx.arc(0,0,$r.r_size/2,0,endAngle, 1);
        $r.ctx.lineWidth =$r.r_thickness;
        $r.ctx.stroke();
        
        // label
        $r.ctx.fillStyle = "#ffffff";
       
        $r.ctx.font = '12px Helvetica';
        $r.ctx.fillText(label, 0, 23);
        $r.ctx.fillText(label, 0, 23);   
        
        $r.ctx.font = 'bold 40px Helvetica';
        $r.ctx.fillText(Math.floor(value), 0, 10);
        
        $r.ctx.restore();
        $( "#canvas" ).append( $r.cvs );
        }
      }
  
      ringer.init();
    `;
    this._renderer2.appendChild(this._document.body, script);
  }

  user_submit(data)
  {
    this.spinner.show();
    data.which_form = this.user_type;
    if(this.get_token())
      data.token = this.get_token();
    this.todoservice.save_contact_form(data)
    .subscribe(
      data => 
      {
        if(data.status == true)
        {
          this.toastr.successToastr(data.msg);
        }
        else
        {
          this.toastr.errorToastr(data.msg);
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