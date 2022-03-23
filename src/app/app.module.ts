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

// ngrx
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { appReducers } from './core/store/app.reducer';
import { effectsArray } from './core/store/effects';

// guards
import { AuthGuard } from './core/auth/auth.guard';
import { AuthAdminGuard } from './core/auth/auth-admin.guard';

// sockets
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
const config: SocketIoConfig = { url: environment.root, options: {} };

// for HttpClient import:
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';

// for Router import:
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';

// for Core import:
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { LOADING_BAR_CONFIG } from '@ngx-loading-bar/core';

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
    StoreModule.forRoot(appReducers),
    EffectsModule.forRoot(effectsArray),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),

    // sockets
    SocketIoModule.forRoot(config),

    // app modules
    CoreModule,
    SharedComponentsModule,

    LoadingBarHttpClientModule,
    LoadingBarRouterModule,
    LoadingBarModule
  ],
  providers: [
    { provide: APP_BASE_HREF, useValue: environment.baseurl },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: LOADING_BAR_CONFIG, useValue: { latencyThreshold: 100 } },
    AuthGuard,
    AuthAdminGuard,
    CheckTokenGuard,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
