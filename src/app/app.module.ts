import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { SharedComponentsModule } from './pages/shared-components/shared-components.module';

import { AppComponent } from './app.component';
import { AuthLayoutComponent } from './pages/layouts/auth-layout/auth-layout.component';
import { AdminLayoutComponent } from './pages/layouts/admin-layout/admin-layout.component';
import { AppLayoutComponent } from './pages/layouts/app-layout/app-layout.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CoreModule } from './core/core.module';
import { APP_BASE_HREF } from '@angular/common';
import { environment } from 'src/environments/environment';
import { AuthInterceptor } from './core/services/interceptors/auth.interceptor';
import { CheckTokenGuard } from './core/auth/check-token.guard';


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
    HttpClientModule,

    // ngrx
    // StoreModule.forRoot(appReducers),
    // EffectsModule.forRoot(effectsArray),
    // StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production}),

    // app modules
    CoreModule,
    SharedComponentsModule
  ],
  providers: [
    { provide: APP_BASE_HREF, useValue: environment.baseurl },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    // AuthGuard,
    // AuthAdminGuard,
    CheckTokenGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
