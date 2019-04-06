import {Component} from "@angular/core";
import {Router, NavigationEnd} from "@angular/router";
import {TodoService} from "./todo.service"; 
declare var ga: Function;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = '';
 
  constructor(public router: Router , private todoservice : TodoService) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) { 
        ga('set', 'page', event.urlAfterRedirects);
        ga('set', 'userId', this.todoservice.get_user_id());
        ga('send', 'pageview'); 
      }
    });
  }
 
}