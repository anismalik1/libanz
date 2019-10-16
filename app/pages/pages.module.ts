import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedCommonModule } from '../shared/common.module';
import { PageViewComponent } from './page-view.component';
import { ContactUsComponent } from './contact-us.component';
import { ForgotPasswordComponent } from './forgot-password.component';
import { MatSelectModule,MatAutocompleteModule,MatInputModule } from '@angular/material';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ProductService } from '../product.service';
import { FormsModule ,ReactiveFormsModule,} from '@angular/forms';
import { FaqsComponent } from './faqs.component';
import { LoginComponent } from './login.component';
import { SignupComponent } from './signup.component';
import { NotifyComponent } from './notify.component';
import { TodoService } from '../todo.service';
import { User } from '../user';
import { AuthService } from '../auth.service';
import { NgxPaginationModule} from 'ngx-pagination';
import { MerchantComponent } from './merchant.component';
import { PackageViewComponent } from './package-view.component';
import { UserDetailComponent } from './user-detail.component';
import { TestimonialsComponent } from './testimonials.component';
import { TruncatePipe } from './truncatePipe';

const routes: Routes = [
  { path: '', component: PageViewComponent },
  { path: 'testimonials', component: TestimonialsComponent },
  { path: 'user-detail', component: UserDetailComponent },
  { path: 'merchant-on-mydthshop', component: MerchantComponent },
  { path: 'partner-on-mydthshop', component: MerchantComponent },
  { path: 'contact-us', component: ContactUsComponent },
  { path: 'recover', component: ForgotPasswordComponent },
  // { path: 'forgot-password', component: ContactUsComponent },
  { path: ':name', component: PackageViewComponent },
  { path: ':name/:id', component: PackageViewComponent },
  // { path: 'tata-sky', component: PackageViewComponent },
  // { path: 'tata-sky/:id', component: PackageViewComponent },
  // { path: 'airtel', component: PackageViewComponent },
  // { path: 'airtel/:id', component: PackageViewComponent },
  // { path: 'dish-tv', component: PackageViewComponent },
  // { path: 'dish-tv/:id', component: PackageViewComponent },
  // { path: 'videocon', component: PackageViewComponent },
  // { path: 'videocon/:id', component: PackageViewComponent },
  { path: 'user-notify/:id', component: NotifyComponent }
  
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedCommonModule,
    NgxSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    NgxPaginationModule,
    MatAutocompleteModule,
    MatInputModule,
  ],
  declarations: [PageViewComponent,ContactUsComponent, FaqsComponent, ForgotPasswordComponent,LoginComponent, SignupComponent, NotifyComponent, MerchantComponent, PackageViewComponent, UserDetailComponent, TestimonialsComponent,TruncatePipe],
  providers : [ProductService,TodoService,User,AuthService] 
})
export class PagesModule { } 
