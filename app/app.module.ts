import { NgModule ,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule} from '@angular/material/select';
import { MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatInputModule} from '@angular/material/input';
import { MatDatepickerModule} from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule ,ReactiveFormsModule} from '@angular/forms';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { LogoutComponent } from './shared/logout.component'; 
import { HomeModule} from './home/home.module';
import { PagesModule} from './pages/pages.module';
import {ProductsModule} from './products/products.module';
import {DashboardModule} from './dashboard/dashboard.module';
import {PagedataGuard} from './shared/guard/pagedata.guard';
import { PagesService } from './pages.service';
// import { SplashScreenComponent } from './pages/splash-screen.component';
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
    // SplashScreenComponent
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
    MatTooltipModule,
    MatFormFieldModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    StorageServiceModule,
    NgxDaterangepickerMd.forRoot(),
    //platformImports,
    //ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [HomeModule,PagesModule,ProductsModule,DashboardModule,PagedataGuard,PagesService],
  bootstrap: [AppComponent]
})
export class AppModule {
  
 }
