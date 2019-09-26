import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule ,ReactiveFormsModule,} from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { MatSelectModule,MatAutocompleteModule,MatInputModule } from '@angular/material';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import {ToastModule} from 'ng2-toastr/ng2-toastr';
import { LogoutComponent } from '../shared/logout.component';
import { HeaderComponent } from '../shared/header/header.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { page404Component } from '../pages/404.component';
import { SideNavComponent } from '../shared/side-nav/side-nav.component';

@NgModule({ 
  imports: [CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatInputModule,
    RouterModule,
    ToastModule.forRoot(),
    NgxDaterangepickerMd.forRoot(),
],
  declarations: [
    HeaderComponent,
    FooterComponent,
    LogoutComponent,
    SideNavComponent,
    page404Component
],
  exports: [HeaderComponent,FooterComponent,LogoutComponent,SideNavComponent,page404Component]
})
export class SharedCommonModule { }