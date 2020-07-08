import { Component, OnInit } from '@angular/core';
import { TodoService } from '../todo.service';

@Component({
  selector: 'app-product-listing',
  templateUrl: './product-listing.component.html',
  styles: [],
  providers: [TodoService]
})
export class ProductListingComponent implements OnInit {

  constructor(public todoservice : TodoService) { }

  ngOnInit() {
  }

}

$(document).ready(function(){
  //$('.tabs').tabs();
});