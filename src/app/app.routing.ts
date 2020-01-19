import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AboutUsInfoComponent} from "./public-page/public-info/public-info.component";
import {PublicPagenotfoundPageComponent} from "./public-pagenotfound-page/public-pagenotfound-page.component";
import { CustomPreloadingStrategy } from './custom-preloading';
import {AuthGuard} from "./auth/auth.guard";
import {LoginComponent} from "./auth/login/login.component";

const appRoutes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'pro',
    loadChildren: './+pro-page/pro-page.module#ProPageModule',
    canActivate: [AuthGuard],
  },
  {
    path: '',
    loadChildren: './modules/home.module#HomeModule',
    data: { preload: false }
  },
  {
    path: 'project',
    component: PublicPagenotfoundPageComponent,
    pathMatch: 'full'
  },
  {
    path: 'project',
    loadChildren: './modules/project.module#ProjectModule',
    data: { preload: false }
  },
  {
    path: "about-us",
    component: AboutUsInfoComponent,
  },
  {
    path: '**',
    component: PublicPagenotfoundPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes,{preloadingStrategy: CustomPreloadingStrategy})],
  providers: [CustomPreloadingStrategy],
  exports: [RouterModule],
})

export class AppRoutingModule {}
