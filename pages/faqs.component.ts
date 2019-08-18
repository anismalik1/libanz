import { Component, OnInit ,ViewContainerRef,Renderer2,Inject} from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { DOCUMENT,Meta,Title } from "@angular/platform-browser";
import { Router,ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';
import { TodoService } from '../todo.service';
import { User } from '../user';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
  selector: 'app-faqs',
  templateUrl: './faqs.component.html',
  styles: [],
  providers: [TodoService,User,AuthService]
})
export class FaqsComponent implements OnInit {
  faqsgroup : FormGroup;
  unsatisfiedformgroup : FormGroup;
  faqs : any;
  single : any;
  searched : any;
  constructor(
    private fb: FormBuilder,
    private todoservice: TodoService,
    private spinner : NgxSpinnerService,
    private toastr: ToastsManager,
    private vcr: ViewContainerRef,
    private authservice : AuthService,
    private _renderer2: Renderer2, 
    private router : ActivatedRoute, 
    private route : Router,
    @Inject(DOCUMENT) private _document, 
  ) {
    this.toastr.setRootViewContainerRef(vcr);
      this.faqsgroup = fb.group({
        'name' : [null,Validators.compose([Validators.required])],
        'email' : [null,Validators.email],
        'message' : ['',Validators.compose([Validators.required])],
      });

      this.unsatisfiedformgroup = fb.group({
        'hint' : [null],
        'email' : [null,Validators.compose([Validators.required,Validators.email])],
        'comment' : ['',Validators.compose([Validators.required])],
      });
   }

  ngOnInit() {
    this.router.params.subscribe(params => {
      let url = params['name']; //log the value of id
      this.print_faq(url);
    });
    
    this.faqs_list();
    this.init_script();
  }

  unsatisfied(form)
  {
    this.spinner.show();
    this.todoservice.send_feed({token : this.get_token(),form: form})
    .subscribe(
      data => 
      {
        this.spinner.hide();
      }
    ) 
  }
  init_script()
  {
    if($('#collapse-script'))
    {
      $('#collapse-script').remove();
    }
	  let script = this._renderer2.createElement('script');
    script.type = `text/javascript`;
    script.id = `collapse-script`;
    script.text = `
    $(document).ready(function(){
      $('.collapsible').collapsible();
      $('.modal').modal();
    })
   
    `;
    this._renderer2.appendChild(this._document.body, script);
  }
  faqs_list()
  {
    this.spinner.show();
    this.todoservice.faqs_list({token : this.get_token()})
    .subscribe(
      data => 
      {
        this.spinner.hide();
        this.faqs = data.faqs;
        this.init_script();
      }
    ) 
  }
  search_faqs()
  {
    let key = $("#faq_key").val();
    this.spinner.show();
    this.todoservice.search_faqs({key : key})
    .subscribe(
      data => 
      {
        this.spinner.hide();
        //this.faqs = data.faqs;
        this.init_script();
        this.searched = data.faq;
      }
    )
  }
  print_faq(url)
  {
    this.spinner.show();
    this.todoservice.print_faq({url: url})
    .subscribe(
      data => 
      {
        this.spinner.hide();
        this.single = data.faq[0];
        this.route.navigate(['/p/faqs/'+this.single.url])
        this.searched = [];
      }
    ) 
  }
  faqs_submit(data)
  {
    if(this.get_token())
    {
      data.token  = this.get_token();
    }
    this.spinner.show();
    this.todoservice.save_faqs_form(data)
    .subscribe(
      data => 
      {
        let b = JSON.stringify(data);
        data =  JSON.parse(b.replace(/\\/g, ''));
        this.spinner.hide();
        if(data.status == true)
        {
          this.toastr.error("Successful! We Have Received Your Query And will be back to you soon.");
        }
      }
    )  
  }

  get_token()
  {
    return this.authservice.auth_token();
  }
}
