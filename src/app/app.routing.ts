import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PublicUploadPageComponent} from "./public-upload-page/public-upload-page.component";
import {PublicPlayerPageComponent} from "./public-player-page/public-player-page.component";
import {PublicUploadingFilesComponent} from "./public-upload-page/public-upload-progress/public-uploading-files.component";

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
    path: "player",
    component: PublicPlayerPageComponent
  }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
