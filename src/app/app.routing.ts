import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CustomPreloadingStrategy} from './custom-preloading';
import {AuthGuard} from "./auth/auth.guard";
import {LoginComponent} from "./auth/login/login.component";
import {PublicPagenotfoundPageComponent} from "./+public/public-pagenotfound-page/public-pagenotfound-page.component";

const appRoutes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
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
    path: 'pro',
    loadChildren: './+pro/pro.module#ProModule',
    canActivate: [AuthGuard],
  },
  {
    path: '',
    loadChildren: './modules/home.module#HomeModule',
    data: { preload: false }
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
