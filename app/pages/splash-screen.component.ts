import { Component, OnInit, ChangeDetectionStrategy,Renderer2,Inject} from '@angular/core';
//import {trigger,transition,keyframes,state,query,animate,group,animateChild,style} from '@angular/animations';
import { DOCUMENT} from "@angular/common";
import { Headers,Http } from '@angular/http';
import { TodoService } from '../todo.service';
import {Router} from '@angular/router';
import {  stepper } from './splash-animation';

declare var window: any;

@Component({
    providers : [TodoService],
    selector: 'app-splash-screen',
    template: `
        <div class="splash-screen" *ngIf="show">
            <div class="splash-box center" [@fadeOut]="'out'" (@fadeOut.done)="animationDone($event)">
                <img width="100px" src="{{this.splash}}" alt="Libanz Logo">
            </div>
            <!--<div class="mid-btns center hide">
                <span class="update-av">Update Available</span>
                <div class="clearfix"></div>
                <a href="javascript:" (click)="goto_market()" class="pad10">Update</a>
                <a href="javascript:" (click)="to_home()">Skip</a>
            </div>-->
        </div>
    `,
    animations: [stepper],
    styles: [`
        .splash-box{position: absolute;
            top: 40%;
            left: 36%;}    
        .welcome-text{
            font-size: 22px;
            color: #ff6a00;display:block;} 
        .splash-screen {
            background : #fff;
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            z-index: 9999; 
        }
        .mid-btns{
            
    position: absolute;
    bottom: 45px;
    width: 100%;
        }
        .mid-btns a{
        
            font-size: 15px;
            padding: 8px 35px;
            color: #fff;
            border: 1px solid #fff;
            margin-left: 6px;
            border-radius: 20px;
            background: #fff;
            color: #040404;
            font-weight: bold;
        }
        
        .update-av{
            padding-bottom: 16px;
    display: inherit;
    font-size: 16px;
    color: #fff !important;}   
    `],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class SplashScreenComponent implements OnInit {
    show = false;
    slide : number = 1200;
    updated_version = 10020;
    splash : string = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjQ0M0NCREU2QzM2ODExRUFCMTAxRTc0RjRBRUI5QTM0IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjQ0M0NCREU3QzM2ODExRUFCMTAxRTc0RjRBRUI5QTM0Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NDQzQ0JERTRDMzY4MTFFQUIxMDFFNzRGNEFFQjlBMzQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NDQzQ0JERTVDMzY4MTFFQUIxMDFFNzRGNEFFQjlBMzQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6yThPNAAAZGklEQVR42uxd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';
    constructor(
        private _renderer2: Renderer2,
         @Inject(DOCUMENT) private _document,
        private router : Router,
        private http : Http
    ) 
    { }

    animationDone(ele)
    {
        $('.splash-box').css({top:'40%',left: '36%'}).append("<span _ngcontent-serverApp-c1 class='welcome-text'>Libanz</span>")
        this.router.navigate(['/mhome']);
    }

    ngOnInit() {
        
        var width = $(window).width() + 17; 
        if(width > 767)
        {
            this.router.navigate(['/home']);
            return false;
        }
        else if( document.URL.indexOf('https://') !== -1)
        {
            this.router.navigate(['/mhome']);
            return false;
        }
        if(document.URL.indexOf('android_asset') !== -1)
        {
            if(!window.cordova)
            {
                let script1 = this._renderer2.createElement('script');
                script1.type = `text/javascript`;
                script1.id = `cordova-js`;
                script1.src = `cordova.js`;
                this._renderer2.appendChild(this._document.body, script1);
            }
            let device = JSON.parse(localStorage.getItem('device'));
            if(device != null)
            {
                
            }
        }
        this.show  = true;  
        //this.app_version();
        //this.to_home();
    }

    app_version()
    {
        var Headers_of_api = new Headers({
            'Content-Type' : 'application/x-www-form-urlencoded'
          });
        this.http.post('https://www.libanz.com/accounts/apis/home/app_version', { }, {headers: Headers_of_api}).subscribe(
            data => {
                let response = $.parseJSON(data['_body'])
                if(response.version)
                {
                    window.me = this;
                    window.appversion = response.version;
                    if(document.URL.indexOf('android_asset') !== -1)
                    {
                        if(window.cordova.getAppVersion)
                        {
                            window.cordova.getAppVersion.getVersionCode(function(version){
                                if(version *1 < window.appversion *1)
                                {
                                    //$('.mid-btns').removeClass('hide');
                                    return false;
                                } 
                                else
                                {
                                    window.me.to_home()
                                }  
                            });  
                        }
                        else
                        {
                            setTimeout(()=>{    //<<<---    using ()=> syntax
                                //me.router.navigate(['/mhome']);
                                this.router.navigate(['/mhome']);
                            }, 1800); 
                        } 
                    }
                    else
                    {
                        if(2000 < 2001)
                        {
                            //$('.mid-btns').removeClass('hide');
                            return false;
                        }
                        else
                        {
                            window.me.to_home(); 
                        } 
                        //window.me.to_home();
                    }
                }
                else
                {
                    window.me.to_home();
                }
            }    
        )       
    }

    goto_market()
    {
        window.cordova.plugins.market.open("mydth.app");
    }

    init_script()
    {
        let script = this._renderer2.createElement('script');
        script.type = `text/javascript`;
        script.id = `init-list-script`;
        script.text = `
        $(document).ready(function (me) {
            setTimeout(function(){
                //$('.mid-btns').addClass('hide'); 
                $(".splash-screen img").fadeIn()
                .css({top:'0',position:'absolute'})
                .animate({top:'-100%'}, 1600, function() {});
            }, 6000); 
        });     
        `;
        this._renderer2.appendChild(this._document.body, script);
    }
}