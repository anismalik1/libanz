import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule ,ReactiveFormsModule,} from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { MatSelectModule} from '@angular/material/select';
import { MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatTooltipModule} from '@angular/material/tooltip';
import { MatInputModule} from '@angular/material/input';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { ToastrModule } from 'ng6-toastr-notifications';
import { NgxSpinnerModule} from 'ngx-spinner'
import { HeaderComponent } from '../shared/header/header.component';
import { FooterComponent } from '../shared/footer/footer.component';
import { SideNavComponent } from '../shared/side-nav/side-nav.component';
import { ImageCropperModule } from 'ngx-image-cropper';
// import { SanitizeHtmlPipe } from '../shared/sanitizePipe';
@NgModule({ 
  imports: [
    CommonModule, 
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatTooltipModule,
    MatInputModule,
    RouterModule,
    NgxSpinnerModule,
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