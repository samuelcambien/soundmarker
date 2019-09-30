import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AboutUsInfoComponent} from "./public-page/public-info/public-info.component";
import {PublicPagenotfoundPageComponent} from "./public-pagenotfound-page/public-pagenotfound-page.component";
import {ProComponent} from './pro/pro.component';
import { CustomPreloadingStrategy } from './custom-preloading';

const appRoutes: Routes = [
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
    path: "pro",
    component: ProComponent
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
