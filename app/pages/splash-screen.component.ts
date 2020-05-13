import { Component, OnInit, ChangeDetectionStrategy,Renderer2,Inject} from '@angular/core';
import {trigger,transition,query,animate,animateChild,style} from '@angular/animations';
import { DOCUMENT} from "@angular/common";
import {Router} from '@angular/router'

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
        private _renderer2: Renderer2,
         @Inject(DOCUMENT) private _document,
        private router : Router
    ) {
    }

    ngOnInit() {
        //console.log(document.URL);
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
        var me :any = this;
        this.init_script();
        setTimeout(()=>{    //<<<---    using ()=> syntax
            me.router.navigate(['/mhome']);
        }, 2500);   
        
    }

    init_script()
    {
        let script = this._renderer2.createElement('script');
        script.type = `text/javascript`;
        script.id = `init-list-script`;
        script.text = `
        $(document).ready(function (me) {
            setTimeout(function(){ 
                $(".splash-screen img").fadeIn()
                .css({top:'0',position:'absolute'})
                .animate({top:'-100%'}, 1600, function() {});
            }, 800); 
        });     
        `;
        this._renderer2.appendChild(this._document.body, script);
    }
}