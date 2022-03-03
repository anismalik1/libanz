import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router'
import { TodoService } from '../todo.service';
import { User } from '../user';
@Component({
  selector: 'app-logout',
  template: 'logout',
  styleUrls: [],
  providers : [AuthService,TodoService,User]
})
export class LogoutComponent implements OnInit{

  constructor( private router : Router, private todoservice : TodoService) {
   
    
   }
  ngOnInit() {
    this.clear_session();
    this.todoservice.set_user_data({name:''});
    var width = $(window).width(); 
    if(width > 767)
    {
        this.router.navigate(['/home']);
        return false;
    }
    else
    {
        this.router.navigate(['/mhome']);
        return false;
    }
  }

public clear_session()
{
  localStorage.removeItem('app_token');
}
}
