import {ModuleWithProviders} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PublicUploadPageComponent} from "./public-upload-page/public-upload-page.component";
import {PublicPlayerPageComponent} from "./public-player-page/public-player-page.component";
import {PublicUploadingFilesComponent} from "./public-upload-page/public-upload-progress/public-uploading-files.component";
import {AboutUsInfoComponent} from "./public-page/public-info/public-info.component";
import {PublicPagenotfoundPageComponent} from "./public-pagenotfound-page/public-pagenotfound-page.component";
import {ProComponent} from './pro/pro.component';


const appRoutes: Routes = [
  {
    path: '',
    component: PublicUploadPageComponent
  },
  {
    path: "uploading-files-dev",
    component: PublicUploadingFilesComponent
  },
  {
    path: "project/:project_hash",
    component: PublicPlayerPageComponent,
  },
  {
    path: "project/",
    component: PublicPagenotfoundPageComponent,
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

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
