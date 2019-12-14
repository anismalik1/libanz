import { Component, OnInit,ViewContainerRef } from '@angular/core';
import { FormBuilder, Validators, FormGroup,FormControl } from '@angular/forms';
import { TodoService } from '../todo.service';
import { AuthService } from '../auth.service';
import { Router ,ActivatedRoute} from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styles: []
})
export class UserDetailComponent implements OnInit {
  user_detailgroup : FormGroup;
  referer : any;
  constructor(
    public todoservice : TodoService,
    private authservice : AuthService,
    private toastr : ToastrManager,
    private vcr: ViewContainerRef,
    private fb: FormBuilder,
    public spinner : NgxSpinnerService,
  ) { 
    this.user_detailgroup = fb.group({
      'name' : [null,Validators.compose([Validators.required])],
       'email' : [null,Validators.compose([Validators.required])],
       'phone' : [null,Validators.compose([Validators.required])],
       'subject' : [null,Validators.compose([Validators.required])],
       'message' : [null,Validators.compose([Validators.required])]
     });
  }

  ngOnInit() {
    this.referer = this.todoservice.get_param('ref');
  }

  detail_submit(form_data)
  {
    console.log(form_data);
  }
}
