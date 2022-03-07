import {Component,OnInit, Inject, PLATFORM_ID} from "@angular/core";
import {Router, NavigationEnd,RouteConfigLoadStart, RouteConfigLoadEnd} from "@angular/router";
import { NgxSpinnerService } from 'ngx-spinner';
import {isPlatformBrowser} from '@angular/common';
import {BehaviorSubject} from 'rxjs';
//import { SwUpdate } from '@angular/service-worker'; 

declare var ga: Function;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = '';
  static isBrowser = new BehaviorSubject<boolean>(null!);
  loadingRouteConfig! : boolean;
  constructor(public router: Router,private spinner : NgxSpinnerService,@Inject(PLATFORM_ID) private platformId: any ) {
    AppComponent.isBrowser.next(isPlatformBrowser(platformId));
    this.router.events.subscribe(event => {
      if (isPlatformBrowser(this.platformId)) {
        if (event instanceof NavigationEnd) { 
          ga('set', 'page', event.urlAfterRedirects);
          ga('send', 'pageview'); 
        }
      }
    });
  }
  ngOnInit () {
    this.router.events.subscribe(event => {
        if (event instanceof RouteConfigLoadStart) {
            this.loadingRouteConfig = true;
            //this.spinner.show();
        } else if (event instanceof RouteConfigLoadEnd) {
            this.loadingRouteConfig = false;
            this.spinner.hide();
        }
    });
    // if(document.URL.indexOf('https://') !== -1)
    // {
    //   console.log("Enter"+document.URL);
    //   this.swUpdate.available
    //   .subscribe(() => {
    //       this.swUpdate.activateUpdate()
    //           .then(() => document.location.reload());
    //   });
    // }
}

onActivate(event : any ) {
  if (isPlatformBrowser(this.platformId)) {
      window.scroll(0,0);
  }
}
}