import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-kyc',
  templateUrl: './kyc.component.html',
  styles: []
})
export class KycComponent implements OnInit {
  files : any[] = [];
  constructor(private spinner : NgxSpinnerService, private authService : AuthService) {
    
   }

  onFileDropped($event)
  {
    console.log($event);
    this.files.push($event);
  } 
  
  ngOnInit() {
    this.spinner.hide();
  }


  get_token()
  {
    return this.authService.auth_token();
  } 
}
