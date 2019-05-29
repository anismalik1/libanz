import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LogoutComponent } from './shared/logout.component';
import { ContactUsComponent } from './pages/contact-us.component';
import { FaqsComponent } from './pages/faqs.component';
import { page404Component } from './pages/404.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import {ToastModule} from 'ng2-toastr/ng2-toastr';
import { LoginComponent } from './pages/login.component';
import { SignupComponent } from './pages/signup.component';

const routes: Routes = [
  { path: 'home#login', loadChildren: './home/home.module#HomeModule'}, 
  { path: 'home', loadChildren: './home/home.module#HomeModule'},
  { path: 'home/', loadChildren: './home/home.module#HomeModule'},
  { path: 'recharge/:name', loadChildren: './home/home.module#HomeModule'},
  { path: '', loadChildren: './home/home.module#HomeModule'},
  { path: 'logout', component: LogoutComponent },
  { path: '404', component: page404Component },
  { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardModule'},
  { path: 'product', loadChildren: './products/products.module#ProductsModule'},
  { path: 'login/ref/:name', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'p/contact-us', component: ContactUsComponent},
  { path: 'p/contact-us/:name', component: ContactUsComponent},
  { path: 'p/faqs', component: FaqsComponent},
  { path: 'p/:name', loadChildren: './pages/pages.module#PagesModule'},
  {path: '**', redirectTo: '/404'},
];

@NgModule({
  imports: [CommonModule,RouterModule.forRoot(routes),ToastModule.forRoot()],
  declarations: [
],
  exports: [RouterModule,NgxSpinnerModule]
})
export class AppRoutingModule { }
