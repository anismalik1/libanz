import { Injectable } from '@angular/core';
import { CanLoad, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, UrlSegment } from '@angular/router';
import {PagesService} from '../../pages.service'
import { Observable } from 'rxjs';
import { Meta ,Title} from '@angular/platform-browser';
import { Route } from '@angular/compiler/src/core';

@Injectable({
  providedIn: 'root'
})
export class PagedataGuard implements CanLoad {
  // page_guard_urls : any = ['/recharge/for/dth-recharge','/recharge/for/mobile-postpaid','/recharge/for/mobile']; 
  constructor(private pageservice: PagesService) {}

  canLoad(route : Route,segments: UrlSegment[]): any {
    const fullPath = segments.reduce((path, currentSegment) => {
      return `${path}/${currentSegment.path}`;
    }, '');
    // console.log(fullPath)
    if(fullPath.includes('recharge') || fullPath.includes('/p/'))
    {
      this.pageservice.set_page_content(fullPath);
      // this.pageservice.set_page_content(window.location.pathname.replace('/recharge/for/', ''))
    }
    else if(fullPath.includes('/help/faq'))
    {
      this.pageservice.set_page_content(fullPath);
      this.pageservice.defaut_query();
    }
    else if(fullPath.includes('/reviews/testimonials'))
    {
      this.pageservice.set_page_content(fullPath);
      this.pageservice.fetch_testimonials();
    }
    else if(fullPath.includes('/blog/'))
    {
      this.pageservice.set_page_content(fullPath);
      this.pageservice.fetch_blogs({token:"",category:"all",start:0});
    }
    else if(fullPath.includes('/blog-detail/'))
    {
      // this.pageservice.set_page_content(fullPath);
      this.pageservice.fetch_single_blog(fullPath);
    }
    
    return true;
  }
  
}
