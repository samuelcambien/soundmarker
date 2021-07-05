import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CustomPreloadingStrategy} from './custom-preloading';
import {AuthGuard} from "./auth/auth.guard";
import {PublicPagenotfoundPageComponent} from "./+public/public-pagenotfound-page/public-pagenotfound-page.component";

const appRoutes: Routes = [
  {
    path: 'project',
    component: PublicPagenotfoundPageComponent,
    pathMatch: 'full'
  },
  {
    path: 'project',
    loadChildren: () => import('./modules/project.module').then(m => m.ProjectModule),
    data: { preload: false }
  },
  {
    path: 'pro',
    loadChildren: () => import('./+pro/pro.module').then(m => m.ProModule),
    data: {
      breadcrumb: {
        label: 'Dashboard',
        info: 'home',
        routeInterceptor: (routeLink) => {
          return routeLink;
        },
      },
    },
    // canActivate: [AuthGuard],
  },
  {
    path: '',
    loadChildren: () => import('./modules/home.module').then(m => m.HomeModule),
    data: {
      preload: false,
      breadcrumb: {
        skip: true,
      },}
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
