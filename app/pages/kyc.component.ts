import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-kyc',
  templateUrl: './kyc.component.html',
  styles: []
})
export class KycComponent implements OnInit {

  constructor(private spinner : NgxSpinnerService) {
    
   }

  ngOnInit() {
    this.spinner.hide();
  }

}
