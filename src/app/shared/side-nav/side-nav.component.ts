import { Component, OnInit } from '@angular/core';
import { TodoService } from '../../todo.service';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styles: []
})
export class SideNavComponent implements OnInit {

  constructor( public todoservice : TodoService) { }

  ngOnInit() {
  }

}
