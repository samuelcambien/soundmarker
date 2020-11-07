import {ModuleWithProviders, NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {PublicPagenotfoundPageComponent} from "./+public/public-pagenotfound-page/public-pagenotfound-page.component";

const appRoutes: Routes = [
  {
    path: 'project',
    loadChildren: () => import('./modules/project.module').then(m => m.ProjectModule)
  },
  {
    path: "pro",
    component: PublicPagenotfoundPageComponent
  },
  {
    path: '',
    loadChildren: () => import('./modules/home.module').then(m => m.HomeModule)
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
