import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer-min',
  templateUrl: './footer-min.component.html',
  styles: []
})
export class FooterMinComponent implements OnInit {

  year :  number = new Date().getFullYear();
  constructor() { }

  ngOnInit() {
  }

}
