import { BrowserModule,Title, Meta, TransferState, makeStateKey } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppModule } from './app.module';

import { AppComponent } from './app.component';


@NgModule({
    imports: [
        AppModule,
        BrowserModule.withServerTransition({ appId: 'mydth.app' }),
    ],
    bootstrap: [AppComponent]
})
export class BrowserAppModule { }