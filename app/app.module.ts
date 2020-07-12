import { NgModule ,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { MatSelectModule,MatAutocompleteModule,MatInputModule } from '@angular/material';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule ,ReactiveFormsModule} from '@angular/forms';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { AppComponent } from './app.component';
import { HttpModule } from '@angular/http';
import { LogoutComponent } from './shared/logout.component';
import { SplashScreenComponent } from './pages/splash-screen.component';
// import { ServiceWorkerModule, SwUpdate } from '@angular/service-worker';
import { NgxPaginationModule} from 'ngx-pagination';
import { environment } from './../environments/environment';

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
    HttpModule,
    FormsModule,
    MatSelectModule,
    NgxPaginationModule,
    MatAutocompleteModule,
    MatInputModule,
    ReactiveFormsModule,
    NgxDaterangepickerMd.forRoot(),
    //platformImports,
    //ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  
 }
