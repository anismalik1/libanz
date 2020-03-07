import { Component, OnInit,ViewChild ,Renderer2,Inject} from '@angular/core';
import {Location} from '@angular/common';
import { FormBuilder, Validators, FormGroup,FormControl } from '@angular/forms'; 
import { ToastrManager } from 'ng6-toastr-notifications';
import {Meta,Title } from "@angular/platform-browser";
import { DOCUMENT} from "@angular/common";
import { TodoService } from '../todo.service';
import { AuthService } from '../auth.service';
import { Params } from '../shared/config/params.service';
import { Observable} from 'rxjs';
import { map, startWith} from 'rxjs/operators';
import { Router ,ActivatedRoute} from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-mobile-home',
  templateUrl: './mobile-home.component.html',
  styles: []
})
export class MobileHomeComponent implements OnInit {

  constructor(
    private _renderer2: Renderer2, 
     @Inject(DOCUMENT) private _document, 
     public todoservice : TodoService,
     private authservice : AuthService,
     private router : Router,
     private  meta : Meta,
     private title : Title, 
     private toastr : ToastrManager,
     private fb: FormBuilder,
     private spinner: NgxSpinnerService,
     public params : Params,
     private location : Location,
     private route : ActivatedRoute
  ) { }

  ngOnInit() {
    this.spinner.hide();
  }

}
