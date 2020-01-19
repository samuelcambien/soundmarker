import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {AboutUsInfoComponent} from "./+public/public-page/public-info/public-info.component";
import {ProPageComponent} from "./+pro/page/pro-page.component";
import {PublicPagenotfoundPageComponent} from "./+public/public-pagenotfound-page/public-pagenotfound-page.component";


const appRoutes: Routes = [
  {
    path: '',
    // component: PublicUploadPageComponent
    loadChildren: './modules/home.module#HomeModule'
  },
  {
    path: 'project',
    loadChildren: './modules/project.module#ProjectModule'
  },
  {
    path: "about-us",
    component: AboutUsInfoComponent,
  },
  {
    path: "pro",
    component: ProPageComponent
  },
  {
    path: '**',
    component: PublicPagenotfoundPageComponent
  }
];
// export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);

@NgModule({
  imports: [RouterModule.forRoot(appRoutes,{preloadingStrategy: PreloadAllModules})],
  exports: [RouterModule]
})
export class AppRoutingModule {}
