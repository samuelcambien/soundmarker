import {ModuleWithProviders} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PublicUploadPageComponent} from "./public-upload-page/public-upload-page.component";
import {PublicPlayerPageComponent} from "./public-player-page/public-player-page.component";
import {PublicUploadingFilesComponent} from "./public-upload-page/public-upload-progress/public-uploading-files.component";
import {HelpInfoComponent} from "./public-page/public-info/public-info.component";
import {CookieComponent} from "./public-page/public-info/topics/privacy-and-terms/cookie/cookie.component";

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
    path: "player/:project_hash",
    component: PublicPlayerPageComponent,
    children: [
      {
        path: "privacy",
        component: HelpInfoComponent,
        outlet: "termsAndPrivacy"
      },
      {
        path: "cookie",
        component: CookieComponent,
        outlet: "termsAndPrivacy"
      }
    ]
  }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
