import { NgModule ,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule} from '@angular/material/select';
import { MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatInputModule} from '@angular/material/input';
import { MatDatepickerModule} from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule ,ReactiveFormsModule} from '@angular/forms';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { LogoutComponent } from './shared/logout.component';
import { SplashScreenComponent } from './pages/splash-screen.component';
import { StorageServiceModule } from 'ngx-webstorage-service';
// import { ServiceWorkerModule, SwUpdate } from '@angular/service-worker';
import { NgxPaginationModule} from 'ngx-pagination';
import * as $ from 'jquery';
// let platformImports = [];
//     if ('navigator' in window && 'serviceWorker' in navigator) {
//       platformImports.push(
//         ServiceWorkerModule.register('./ngsw-worker.js', { enabled: environment.production })
//   );
// } 

@NgModule({
  declarations: [
    AppComponent,
    LogoutComponent,
    SplashScreenComponent
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    MatSelectModule,
    NgxPaginationModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    StorageServiceModule,
    NgxDaterangepickerMd.forRoot(),
    //platformImports,
    //ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  
 }
