import { Component, OnInit ,ViewContainerRef,Renderer2,Inject} from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { DOCUMENT,Meta,Title } from "@angular/platform-browser";
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
  constructor(
    private fb: FormBuilder,
    private todoservice: TodoService,
    private spinner : NgxSpinnerService,
    private toastr: ToastsManager,
    private vcr: ViewContainerRef,
    private authservice : AuthService,
    private _renderer2: Renderer2, 
    @Inject(DOCUMENT) private _document, 
  ) {
    this.toastr.setRootViewContainerRef(vcr);
      this.faqsgroup = fb.group({
        'name' : [null,Validators.compose([Validators.required])],
        'email' : [null,Validators.email],
        'message' : ['',Validators.compose([Validators.required])],
      });
   }

  ngOnInit() {
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
      
    })
   
    `;
    this._renderer2.appendChild(this._document.body, script);
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
