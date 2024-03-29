import { BrowserModule } from '@angular/platform-browser';
import { ServerModule,ServerTransferStateModule } from '@angular/platform-server';
import { NgModule } from '@angular/core';

import { AppModule } from './app.module';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';


@NgModule({
    imports: [
        AppModule,
        BrowserModule.withServerTransition({ appId: 'mydth.app' }),
        ServerModule,
        ServerTransferStateModule
    ],
    bootstrap: [AppComponent]
})
export class ServerAppModule { }