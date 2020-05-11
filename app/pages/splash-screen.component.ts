import { Component, OnInit, ChangeDetectionStrategy,ChangeDetectorRef,ApplicationRef,Renderer2,Inject} from '@angular/core';
import {trigger,transition,query,animate,animateChild,style} from '@angular/animations';
import { DOCUMENT } from "@angular/common";
import {Router} from '@angular/router'
declare var window: any;
@Component({
    selector: 'app-splash-screen',
    template: `
        <div class="splash-screen" *ngIf="show" @fadeOut>
            <img width="100%" height="100%" src="./assets/images/splash-screen.png" alt="Splash Screen Mydthshop">
        </div>
    `,
    animations: [
        // the fade-in/fade-out animation.
        trigger('fadeOut', [
            transition(':leave', [
                query(':leave', animateChild(), {optional: true}),
                animate('1200ms cubic-bezier(0.35, 0, 0.25, 1)', style({opacity: .9,transform: 'translateY(-100%)'})),
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
        }
    `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SplashScreenComponent implements OnInit {
    show = false;

    constructor(
        private router : Router,
        private _renderer2 : Renderer2,
        @Inject(DOCUMENT) private _document
    ) {
    }

    ngOnInit() {
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
            
        }
        this.call_to_check_update();
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
        this.show  = true;
    }

    call_to_check_update()
    {
        if(window.cordova)
        {
            var appUpdate = window.cordova.require('cordova-plugin-app-update.AppUpdate');
            var updateUrl = "https://www.mydthshop.com/android-updater/version.xml";
            appUpdate.checkAppUpdate(onSuccess, onFail, updateUrl);
        }
        else
        {
            if(document.URL.indexOf('android_asset') !== -1)
            {
                setTimeout(()=>{    //<<<---    using ()=> syntax
                    this.call_to_check_update()  
            }, 1000);
            } 
        }
        
        function onFail() {
            console.log( arguments);
        }
        function onSuccess(this) {
            console.log( arguments , this)
            {
                if(arguments[0].code == 202)
                {
                    setTimeout(()=>{    //<<<---    using ()=> syntax
                        this.router.navigate(['/mhome']);
                   }, 1100);
                }
                else if(arguments[0].code == 201)
                    alert("Update Available");
                else if(arguments[0].code == 203)
                    alert("Updating");
                else if(arguments[0].code == 301)
                    alert("VERSION_RESOLVE_FAIL");    
                else if(arguments[0].code == 302)
                    alert("VERSION_COMPARE_FAIL");
                else if(arguments[0].code == 404)
                    alert("FILE NOT FOUND");
                else if(arguments[0].code == 405)
                    alert("NETWORK_ERROR"); 
                else if(arguments[0].code == 501)
                    alert("NO_SUCH_METHOD");
                else if(arguments[0].code == 601)
                    alert("PERMISSION_DENIED");
                else if(arguments[0].code == 901)
                    alert("UNKNOWN_ERROR");                           
            }
        }
    }
}