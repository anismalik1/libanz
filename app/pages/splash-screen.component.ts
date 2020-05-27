import { Component, OnInit, ChangeDetectionStrategy,Renderer2,Inject} from '@angular/core';
import {trigger,transition,query,animate,animateChild,style} from '@angular/animations';
import { DOCUMENT} from "@angular/common";
import { Headers,Http } from '@angular/http';
import { TodoService } from '../todo.service';
import {Router} from '@angular/router'
declare var window: any;
@Component({
    providers : [TodoService],
    selector: 'app-splash-screen',
    template: `
        <div class="splash-screen" *ngIf="show" @fadeOut>
            <img width="100%" height="100%" src="./assets/images/splash-screen.png" alt="Splash Screen Mydthshop">
            <div class="mid-btns center hide">
                <span class="update-av">Update Available</span>
                <div class="clearfix"></div>
                <a href="javascript:" (click)="goto_market()" class="pad10">Update</a>
                <a href="javascript:" (click)="to_home()">Skip</a>
            </div>
        </div>
    `,
    animations: [
        // the fade-in/fade-out animation.
        trigger('fadeOut', [
            transition(':leave', [
                query(':leave', animateChild(), {optional: true}),
                animate('{{this.slide}}ms cubic-bezier(0.35, 0, 0.25, 1)', style({opacity: .9,transform: 'translateY(-100%)'})),
            ]),
        ]),
    ],
    styles: [`
        .splash-screen {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            z-index: 9999; 
            background: #89f5d5;
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
    slide : number = 12000;
    updated_version = 10020;
    
    constructor(
        private _renderer2: Renderer2,
         @Inject(DOCUMENT) private _document,
        private router : Router,
        private http : Http
    ) 
    { }

    ngOnInit() {
        
        var width = $(window).width(); 
        if(width > 767)
        {
            this.router.navigate(['/home']);
            return false;
        }
        else if(document.URL.indexOf('https://') !== -1)
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
        this.app_version();
    }

    app_version()
    {
        var Headers_of_api = new Headers({
            'Content-Type' : 'application/x-www-form-urlencoded'
          });
        this.http.post('https://www.mydthshop.com/accounts/apis/home/app_version', { }, {headers: Headers_of_api}).subscribe(
            data => {
                let response = $.parseJSON(data['_body'])
                if(response.version)
                {
                    this.updated_version = response.version;
                    window.me = this;
                    window.appversion = response.version;
                    if(document.URL.indexOf('android_asset') !== -1)
                    {
                        if(window.cordova.getAppVersion)
                        {
                            window.cordova.getAppVersion.getVersionCode(function(version){
                                if(version *1 < window.appversion *1)
                                {
                                    $('.mid-btns').removeClass('hide');
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
                            $('.mid-btns').removeClass('hide');
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

    to_home()
    {
        this.init_script();
        setTimeout(()=>{    //<<<---    using ()=> syntax
            //me.router.navigate(['/mhome']);
            this.router.navigate(['/mhome']);
        }, 2200); 
        
    }

    init_script()
    {
        let script = this._renderer2.createElement('script');
        script.type = `text/javascript`;
        script.id = `init-list-script`;
        script.text = `
        $(document).ready(function (me) {
            setTimeout(function(){
                $('.mid-btns').addClass('hide'); 
                $(".splash-screen img").fadeIn()
                .css({top:'0',position:'absolute'})
                .animate({top:'-100%'}, 1600, function() {});
            }, 1000); 
        });     
        `;
        this._renderer2.appendChild(this._document.body, script);
    }
}