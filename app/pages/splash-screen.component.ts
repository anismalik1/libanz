import { Component, OnInit, ChangeDetectionStrategy,ChangeDetectorRef,ApplicationRef} from '@angular/core';
import {trigger,transition,query,animate,animateChild,style} from '@angular/animations';
import {Router} from '@angular/router'
import {PwaService} from '../pwa.service';

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
                animate('1200ms cubic-bezier(0.35, 0, 0.25, 1)', style({opacity: .7,transform: 'translateY(-100%)'})),
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
        private pwaService: PwaService,
        private cdr: ChangeDetectorRef,
        private appRef: ApplicationRef,
        private router : Router
    ) {
    }

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
        this.show  = true;
        this.pwaService.checkForUpdate()
            .subscribe(result => {
                if(!result)
                {
                    setTimeout(()=>{    //<<<---    using ()=> syntax
                        this.router.navigate(['/mhome']);
                   }, 1100); 
                }
                this.show = result;
                this.cdr.detectChanges();
            });
    }
}