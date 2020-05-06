import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { TodoService } from '../todo.service';
import { AuthService } from '../auth.service';
import { Meta ,Title} from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styles: []
})
export class PricingComponent implements OnInit {
  page : any = 'pricing';
  plans_data : any ;
  plan_codes : any ;
  days       : number = 15;
  selected_plans : any;
  constructor(private spinner: NgxSpinnerService,private route : Router,private title: Title,private meta : Meta, public todoservice : TodoService,private authservice : AuthService) {

   }

  ngOnInit() {
    this.page_data();
    this.plans();
  }

  plans()
  {
    this.spinner.show();
    this.todoservice.fetch_rental_plan({})
     .subscribe(
       data => 
       {
         this.spinner.hide();
         if(data.plans_data)
         {
           this.plans_data = data.plans_data; 
           this.plan_codes = data.plan_codes;
           this.change_plan(15);
         }
         this.spinner.hide();  
       }
     )
  }

  page_data()
  {
    let page = {page : this.page}; 
   if(page.page == '')
   {
       return false;
   }
   this.todoservice.fetch_page_data(page)
     .subscribe(
       data => 
       {
         if(data.PAGEDATA)
         {
           this.todoservice.set_page_data(data.PAGEDATA[0]);
           this.meta.addTag({ name: 'description', content: this.todoservice.get_page().metaDesc });
           this.meta.addTag({ name: 'keywords', content: this.todoservice.get_page().metaKeyword });
           this.title.setTitle(this.todoservice.get_page().metaTitle);
           window.scroll(0,0); 
         }
         this.spinner.hide();  
       }
     )
  }

  change_plan(days)
  {
    this.days = days;
    this.selected_plans = this.plans_data.filter(x => x.days == days);
    if(this.selected_plans.length == 0)
      return false;
    this.spinner.show();    
    setTimeout(()=>{    //<<<---    using ()=> syntax
      for(var i = 0;i < this.selected_plans.length;i++)
      {
        $('#plan-rate-'+this.selected_plans[i].plan_code).text(this.selected_plans[i].price);
        $('#plan-leads-'+this.selected_plans[i].plan_code).text('Number of leads '+this.selected_plans[i].leads_no);
        $('#plan-days-'+this.selected_plans[i].plan_code).text('Valid for '+this.selected_plans[i].days+' days');
      }
      this.spinner.hide(); 
 }, 1000);
    
  }

  select_plan(plan)
  {
    var checkplan = this.selected_plans.filter(x => x.days == this.days && x.plan_code == plan);
    if(plan == 1)
      checkplan[0].id = 'trial';
    this.route.navigate(['/merchant/checkout'], { queryParams: { plan:  checkplan[0].id} });
  }
}
