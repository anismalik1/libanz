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
            <div class="splash-footer center">
                <span>from</span>
                <div class="clearfix"></div>
            <img width="100px" src="{{this.splash_footer}}" alt="Libanz Logo"></div>
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
            top: 40%;width:100%}    
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
        .splash-footer{position: absolute;
            width: 100%;
            bottom: 0;}
        .splash-footer span{font-size: 20px;color: #a9a6a6;}  
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
    splash_footer : string = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALwAAAAuCAYAAACS53PjAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjdDQUMwNjY3QzVBMjExRUFBMjlFQTRGQkU4N0Q4MEIwIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjdDQUMwNjY4QzVBMjExRUFBMjlFQTRGQkU4N0Q4MEIwIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6N0NBQzA2NjVDNUEyMTFFQUEyOUVBNEZCRTg3RDgwQjAiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6N0NBQzA2NjZDNUEyMTFFQUEyOUVBNEZCRTg3RDgwQjAiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5bUmh1AAAWu0lEQVR42uxd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';
    constructor(
        private _renderer2: Renderer2,
         @Inject(DOCUMENT) private _document,
        private router : Router,
        private http : Http
    ) 
    { }

    animationDone(ele)
    {
        $('.splash-box').css({top:'40%'});
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