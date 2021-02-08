import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { TodoService } from '../todo.service';
import { AuthService } from '../auth.service';
import { Meta ,Title} from '@angular/platform-browser';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { ToastrManager } from 'ng6-toastr-notifications';
import * as moment from 'moment';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styles: []
})
export class PricingComponent implements OnInit {
  myControl = new FormControl();
  filteredOptions: Observable<object>;
  trial_days :number = 15;
  circle_list : any; 
  pincodes : any = [];
  selected_pincodes : any = [];
  minDate: Date;
  mydate : any;
  page : any = 'pricing';
  plans_data : any ;
  plan_codes : any ;
  days       : number = 15;
  selected_plans : any;
  pricingformgroup : FormGroup;
  pricing :any = {all : 20,pin : 2,area : 8}
  pincodechecked : boolean = true; 
  constructor(private spinner: NgxSpinnerService,
    private route : Router,private title: Title,
    private toastr : ToastrManager,
    private meta : Meta, public todoservice : TodoService,
    private authservice : AuthService,private fb: FormBuilder,) {
    this.pricingformgroup = fb.group({
      'circle' : [null,Validators.compose([Validators.required])],
      'pincode' : new FormControl(this.pincodechecked),
    });
   }

  ngOnInit() {
    this.page_data();
    this.plans();
    this.init_date();
  }

  circle_selected(val)
  {
    $('#check-all').click(function(){
      //this.pincodechecked = false;
    });

    if(val == 'all')
    {
      return;
    }
    this.spinner.show();
    this.todoservice.get_pincodes_({circle : val})
		  .subscribe(
			data => 
			{
        this.spinner.hide();
        this.pincodes = data.PINCODES;
        this.selected_pincodes = this.pincodes;
      })
  }

  show_to_search()
  {
    $('#search-box').removeClass('hide');
    $('.show-search-box-link').addClass('hide');
    $('.region-box').addClass('hide');
    this.pincodes = [];
  }

  search_me(key)
  {
    this.todoservice.search_pincode_by_key({key : key})
		  .subscribe(
			data => 
			{
        this.filteredOptions = data.PINCODE;
      })
  }

  click_me(id,pin)
  {
    $('#mat-input-3').val('');
    var a = {id:id,pincode: pin};
    var p = this.pincodes.filter(x => x.id == id);
    if(p.length == 0)
    {
      this.pincodes.push(a);
    }
  }

  change_me(event)
  {
    if(event.checked == false)
    {
      this.selected_pincodes = this.selected_pincodes.filter(x => x.pincode != event.source.value);
    }
    else
    {
      var a = this.pincodes.filter(x => x.pincode == event.source.value);
      this.selected_pincodes.push(a[0]);
    }
  }

  init_date()
  {
    this.minDate = new Date();
    this.minDate.setDate( this.minDate.getDate() + this.trial_days );
    this.mydate = this.minDate;
    this.todoservice.get_pincode_circles({})
		  .subscribe(
			data => 
			{
        this.circle_list = data.CIRCLES;
      })
  }
  
  onSubmit(data)
  {
    if(!this.get_token())
    {
      $('.logup.modal-trigger')[0].click();
      this.toastr.errorToastr("Please Login to proceed", 'Failed! ');
      return;
    }
    
    data.pincodes = this.selected_pincodes;
    data.token = this.get_token();
    data.days = this.trial_days;
    data.plan = 0;
    this.spinner.show();
    this.todoservice.subscribe_plan(data)
     .subscribe(
       data => 
       {
        this.spinner.hide();
        if(data.status == true)
          this.toastr.successToastr(data.msg, 'Success!');
        else
          this.toastr.errorToastr(data.msg, 'Failed!');
       }
     )
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

  check_input(v)
  {
    
  }
  page_data()
  {
    let page = {page : this.page}; 
   if(page.page == '')
   {
       return;
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
      return;
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

  get_token()
  {
    return this.authservice.auth_token();
  }
}
