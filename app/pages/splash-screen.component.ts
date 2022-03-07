import { Component, OnInit, ChangeDetectionStrategy,Renderer2,Inject} from '@angular/core';
//import {trigger,transition,keyframes,state,query,animate,group,animateChild,style} from '@angular/animations';
import { DOCUMENT} from "@angular/common";
import { HttpHeaders,HttpClient } from '@angular/common/http';
import { TodoService } from '../todo.service';
import {Router} from '@angular/router';


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
    styles: [`
        .splash-box{position: absolute;
            top: 40%;width:100%} 
        .splash-box img{border-radius: 50%;}       
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
    `],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class SplashScreenComponent implements OnInit {
    show = false;
    slide : number = 1200;
    updated_version = 10020;
    splash : string = './assets/images/app-icon.png';
    splash_footer : string = './assets/images/logo.png';
    constructor(
        private _renderer2: Renderer2,
         @Inject(DOCUMENT) private _document,
        private router : Router,
        private http : HttpClient
    ) 
    { }

    animationDone(ele)
    {
        // $('.splash-box').css({top:'40%'});
        // this.router.navigate(['/']);
    }

    ngOnInit() {
        
        // var width = $(window).width() + 17; 
        // if(width > 767 || document.URL.indexOf('https://') !== -1)
        // {
        //     this.router.navigate(['/']);
        //     return;
        // }
       
        // if(document.URL.indexOf('android_asset') !== -1)
        // {
        //     if(!window.cordova)
        //     {
        //         let script1 = this._renderer2.createElement('script');
        //         script1.type = `text/javascript`;
        //         script1.id = `cordova-js`;
        //         script1.src = `cordova.js`;
        //         this._renderer2.appendChild(this._document.body, script1);
        //     }
        //     let device = JSON.parse(localStorage.getItem('device'));
        //     if(device != null)
        //     {
                
        //     }
        // }
        // this.show  = true;  
        //this.app_version();
        //this.to_home();
    }

    app_version()
    {
        var Headers_of_api = new HttpHeaders({
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
                                    return;
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
                            return;
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