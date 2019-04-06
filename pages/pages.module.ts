import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedCommonModule } from '../shared/common.module';
import { PageViewComponent } from './page-view.component';
import { ContactUsComponent } from './contact-us.component';
import { Page} from '../pages';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ProductService } from '../product.service';
import { FormsModule ,ReactiveFormsModule,} from '@angular/forms';
import { FaqsComponent } from './faqs.component';
import { LoginComponent } from './login.component';
import { SignupComponent } from './signup.component';
import { NotifyComponent } from './notify.component';

const routes: Routes = [
  { path: '', component: PageViewComponent },
  { path: 'contact-us', component: ContactUsComponent },
  { path: 'user-notify/:id', component: NotifyComponent },
  
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedCommonModule,
    NgxSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [PageViewComponent,ContactUsComponent, FaqsComponent, LoginComponent, SignupComponent, NotifyComponent],
  providers : [Page,ProductService] 
})
export class PagesModule { } 
