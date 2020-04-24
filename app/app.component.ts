import {Component,OnInit} from "@angular/core";
import {Router, NavigationEnd,RouteConfigLoadStart, RouteConfigLoadEnd} from "@angular/router";
import { NgxSpinnerService } from 'ngx-spinner';
import { SwUpdate } from '@angular/service-worker';

declare var ga: Function;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = '';
  loadingRouteConfig: boolean;
  constructor(public router: Router,private spinner : NgxSpinnerService,private swUpdate: SwUpdate ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) { 
        ga('set', 'page', event.urlAfterRedirects);
        ga('send', 'pageview'); 
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
    this.swUpdate.available
    .subscribe(() => {
        this.swUpdate.activateUpdate()
            .then(() => document.location.reload());
    });
}
onActivate(event) {
  window.scroll(0,0);
}
}