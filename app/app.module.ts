import { BrowserModule } from '@angular/platform-browser';
import { NgModule ,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule,MatAutocompleteModule,MatInputModule } from '@angular/material';
import { AppRoutingModule } from './app-routing.module';
import { ImageCropperModule } from 'ngx-image-cropper';
import { FormsModule ,ReactiveFormsModule} from '@angular/forms';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { AppComponent } from './app.component';
import { HttpModule } from '@angular/http';
import { LogoutComponent } from './shared/logout.component';
import { NgxPaginationModule} from 'ngx-pagination';

@NgModule({
  declarations: [
    AppComponent,
    LogoutComponent,
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpModule,
    FormsModule,
    MatSelectModule,
    NgxPaginationModule,
    MatAutocompleteModule,
    MatInputModule,
    ReactiveFormsModule,
    NgxDaterangepickerMd.forRoot(),
    ImageCropperModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
