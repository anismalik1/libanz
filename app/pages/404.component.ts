import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { TodoService } from '../todo.service';
import { User } from '../user';
@Component({
  selector: 'app-404',
  templateUrl: './page404.component.html',
  styles: [],
  providers: [TodoService,User,AuthService]
})
export class page404Component implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
