import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { SharedComponentsModule } from './pages/shared-components/shared-components.module';

import { AppComponent } from './app.component';
import { AuthLayoutComponent } from './pages/layouts/auth-layout/auth-layout.component';
import { AdminLayoutComponent } from './pages/layouts/admin-layout/admin-layout.component';
import { AppLayoutComponent } from './pages/layouts/app-layout/app-layout.component';


@NgModule({
  declarations: [
    AppComponent,
    AuthLayoutComponent,
    AdminLayoutComponent,
    AppLayoutComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedComponentsModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
