import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LogoutComponent } from './shared/logout.component';
import {PagedataGuard} from './shared/guard/pagedata.guard'
// import { SplashScreenComponent } from './pages/splash-screen.component';
// import { ContactUsComponent } from './pages/contact-us.component';
// import { FaqsComponent } from './pages/faqs.component';

import { NgxSpinnerModule } from 'ngx-spinner';
import { ToastrModule } from 'ng6-toastr-notifications';
// import {PagesModule} from '../app/pages/pages.module'
// import { LoginComponent } from './pages/login.component';
// import { SignupComponent } from './pages/signup.component';
// import { ForgotPasswordComponent } from './pages/forgot-password.component';

const routes: Routes = [
  { path: 'logout', component: LogoutComponent },
  // { path: '', loadChildren: () => import('./home/home.module').then(m => m.HomeModule) },
  // { path: 'splash-screen', loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule) },
  { path: 'error', loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule)},
  { path: 'orders',loadChildren: () => import('./home/home.module').then(m => m.HomeModule)},
  { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)},
  { path: 'product', loadChildren: () => import('./products/products.module').then(m => m.ProductsModule)},
  { path: 'proceed',loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule) },
  { path: 'merchant',loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule) },
  { path: 'help',loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule),canLoad : [PagedataGuard] },
  { path: 'p/:name',canLoad : [PagedataGuard],loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule) },
  { path: 'home#login',loadChildren: () => import('./home/home.module').then(m => m.HomeModule)}, 
  { path: 'recharge',loadChildren: () => import('./home/home.module').then(m => m.HomeModule),canLoad : [PagedataGuard] },
  { path: 'p/accounts',loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule)},
  { path: 'lead',loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule)},
  { path: 'package-list',loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule)},
  { path: 'reviews',loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule),canLoad : [PagedataGuard] },
  { path: '',loadChildren: () => import('./home/home.module').then(m => m.HomeModule),canLoad : [PagedataGuard]},
  { path: '**', redirectTo: '/'}, 
];

@NgModule({
  imports: [CommonModule,RouterModule.forRoot(routes),ToastrModule.forRoot()],
  declarations: [
],
  exports: [RouterModule,NgxSpinnerModule]
})
export class AppRoutingModule { }
