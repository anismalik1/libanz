import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Headers,Http } from '@angular/http';
import { Page} from './pages';
import 'rxjs/add/observable/of';
import  'rxjs/add/operator/catch';
import  'rxjs/add/operator/map';
@Injectable()
export class PagesService {
  public server_url : string = "https://mydthshop.com/";
  public base_url : string = 'https://mydthshop.com/web-app/';
  public service_url : string = 'https://mydthshop.com/index.php?/app_services/';
  public page_data : any;
  constructor(public page : Page) { }
  set_page_data(data)
  {
    let b = JSON.stringify(data);
    this.page.storage =  JSON.parse(b.replace(/\\/g, ''));
  }

  get_page()
  {
    return this.page.storage;  
  }
}
