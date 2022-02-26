import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../auth.service';
import { TodoService } from '../todo.service';

@Component({
  selector: 'app-kyc',
  templateUrl: './kyc.component.html',
  styles: [],
  providers: [TodoService]
})
export class KycComponent implements OnInit {
  files : any[] = [];
  constructor(private spinner : NgxSpinnerService,public todoservice : TodoService ,private authService : AuthService) {
    
   }
  
  ngOnInit() {
    this.spinner.hide();
  }

  filesDropped(evt)
  {
    console.log(evt);
  }

  get_token()
  {
    return this.authService.auth_token();
  } 
}
