import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpHeaders,HttpClient } from '@angular/common/http';
import 'rxjs/add/observable/of';
import  'rxjs/add/operator/catch';
import  'rxjs/add/operator/map';
@Injectable()
export class PagesService {
  public server_url : string = "https://www.libanz.com/";
  public base_url : string = 'https://www.libanz.com/web-app/';
  public service_url : string = 'https://www.libanz.com/index.php?/app_services/';
  public page_data : any;
  constructor() { }
  set_page_data(data : any)
  {
    let b = JSON.stringify(data);
    //this.page.storage =  JSON.parse(b.replace(/\\/g, ''));
  }

  get_page()
  {
    //return this.page.storage;  
  }
}
