import { NgModule } from '@angular/core';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SharedCommonModule } from '../shared/common.module';
import {MatStepperModule} from '@angular/material/stepper';

import { FormsModule ,ReactiveFormsModule,} from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule} from '@angular/material/select';
import { MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatInputModule} from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule} from '@angular/material/datepicker';
import { MAT_MOMENT_DATE_FORMATS,MatMomentDateModule } from "@angular/material-moment-adapter";
import { NgxSpinnerModule } from 'ngx-spinner';
import { ProductService } from '../product.service';
import { AuthService } from '../auth.service';
import { NgxPaginationModule} from 'ngx-pagination';
import { ImageCropperModule } from 'ngx-image-cropper';
import { page404Component } from '../pages/404.component';
import { FaqsComponent } from './faqs.component';
import { ContactUsComponent } from './contact-us.component';
import { PageViewComponent } from './page-view.component';
import { ForgotPasswordComponent } from './forgot-password.component';

import { LoginComponent } from './login.component';
import { SignupComponent } from './signup.component';
import { NotifyComponent } from './notify.component';
// import { SanitizeHtmlPipe } from '../shared/sanitizePipe';
// import { TodoService } from '../todo.service';
// import { User } from '../user';
// import { AuthService } from '../auth.service';
// 
import { MerchantComponent} from './merchant.component';
import { PackageViewComponent } from './package-view.component';
// import { UserDetailComponent } from './user-detail.component';
import { TestimonialsComponent } from './testimonials.component';
import { TodoService } from '../todo.service';
import { User } from '../user';

// 
// import { MerchantRegistrationComponent } from './merchant-registration.component';
// import { PricingComponent } from './pricing.component';
import { KycComponent } from './kyc.component';
// import { ProductListingComponent } from './product-listing.component';
// import { PlanCheckoutComponent } from './plan-checkout.component';
// import { TestComponent } from './test.component';
// import { FiledirDirective } from './filedir.directive';


const routes: Routes = [
  { path: '', component: PageViewComponent },
  { path: '404', component: page404Component },
  // { path: 'test', component: TestComponent },
  { path: 'login', component: LoginComponent },
  { path: 'login/ref/:name', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'signup/:id', component: SignupComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'contact-us', component: ContactUsComponent },
  { path: 'p/contact-us/:name', component: ContactUsComponent },
  { path: 'faqs', component: FaqsComponent },
  { path: 'faqs/:name', component: FaqsComponent },

  { path: 'testimonials', component: TestimonialsComponent },
  // { path: 'user-detail', component: UserDetailComponent },
  // { path: 'pricing', component: PricingComponent },
  // { path: 'checkout', component: PlanCheckoutComponent },
  { path: 'merchant-on-libanz', component: MerchantComponent },
  { path: 'partner-on-libanz', component: MerchantComponent },
  // { path: 'registration', component: MerchantRegistrationComponent },
  { path: 'kyc', component: KycComponent },
  // { path: 'product-listing', component: ProductListingComponent },
  { path: 'contact-us', component: ContactUsComponent },
  // { path: 'recover', component: ForgotPasswordComponent },
  { path: ':name', component: PackageViewComponent },
  { path: ':name/:id', component: PackageViewComponent },
  { path: 'user-notify/:id', component: NotifyComponent },
  {path: '**', redirectTo: '/error/404'},
];

@NgModule({
  imports: [
    CommonModule,
    SharedCommonModule,
    RouterModule.forChild(routes),
    NgxSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    NgxPaginationModule,
    MatAutocompleteModule,
    MatInputModule,
    MatTooltipModule, 
    MatFormFieldModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatCheckboxModule,  
    MatStepperModule
  ],
  declarations: [page404Component,FaqsComponent,ContactUsComponent,TestimonialsComponent,MerchantComponent,PackageViewComponent,PageViewComponent,SignupComponent,LoginComponent,NotifyComponent,KycComponent,ForgotPasswordComponent],
  providers : [ ProductService,TodoService,AuthService,User] 
})
export class PagesModule { } 
