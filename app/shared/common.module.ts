import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule ,ReactiveFormsModule,} from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { MatSelectModule,MatAutocompleteModule,MatInputModule } from '@angular/material';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { ToastrModule } from 'ng6-toastr-notifications';
import { HeaderComponent } from '../shared/header/header.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { SideNavComponent } from '../shared/side-nav/side-nav.component';
import { ImageCropperModule } from 'ngx-image-cropper';

@NgModule({ 
  imports: [CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatInputModule,
    RouterModule,
    ToastrModule.forRoot(),
    NgxDaterangepickerMd.forRoot(),
    ImageCropperModule
],
  declarations: [
    HeaderComponent,
    FooterComponent,
    SideNavComponent
],
  exports: [HeaderComponent,FooterComponent,SideNavComponent]
})
export class SharedCommonModule { }