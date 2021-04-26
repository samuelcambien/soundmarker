import {NgModule} from '@angular/core';
import {SharedModule} from './modules/shared.module';
import {AppRoutingModule} from './app.routing';

import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {AppComponent} from './app.component';

import {LoadableComponentModule} from 'ngx-loadable-component';
// loadable components manifest
import {appLoadableManifests} from './modules/app-loadable.manifests';
import {appReducers} from "./app.reducer";
import {StoreModule} from '@ngrx/store';
import {coreReducers} from "./core.reducers";
import {AuthGuard} from "./auth/auth.guard";
import {AuthService} from "./auth/auth.service";
import {ProfileComponent} from './+pro/profile/profile.component';


@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    AppRoutingModule,
    LoadableComponentModule.forRoot(appLoadableManifests),
    StoreModule.forRoot(appReducers),
    StoreModule.forFeature('core', coreReducers, {}),
  ],
  declarations: [
    AppComponent,
    ProfileComponent,
  ],
  providers: [
    AuthGuard,
    AuthService,
  ],
  bootstrap: [AppComponent],
  entryComponents: [
  ]
})
export class AppModule {
}
