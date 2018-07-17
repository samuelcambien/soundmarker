import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {PublicUploadFormComponent} from './public-upload-page/public-upload-form/public-upload-form.component';
import {FileUploadModule} from "ng2-file-upload";
import {FormsModule} from '@angular/forms';
import {PublicUploadingFilesComponent} from './public-upload-page/public-upload-progress/public-uploading-files.component';
import {PublicUploadFinishedComponent} from './public-upload-page/public-upload-finished/public-upload-finished.component';
import {PublicUploadPageComponent} from './public-upload-page/public-upload-page.component';
import {routing} from "./app.routing";
import {PublicPlayerPageComponent} from './public-player-page/public-player-page.component';
import {PublicPageComponent} from './public-page/public-page.component';
import {
  PublicInfoHeaderComponent,
  PublicInfoLinkComponent
} from "./public-page/public-info/header/public-info-header.component";
import {PublicInfoZoneComponent} from "./public-page/public-info/zone/public-info-zone.component";
import {
  AboutUsInfoComponent,
  HelpInfoComponent,
  ProInfoComponent
} from "./public-page/public-info/public-info.component";

@NgModule({
  declarations: [
    AppComponent,
    PublicUploadFormComponent,
    PublicUploadingFilesComponent,
    PublicUploadFinishedComponent,
    PublicUploadPageComponent,
    PublicInfoHeaderComponent,
    PublicInfoLinkComponent,
    PublicInfoZoneComponent,
    AboutUsInfoComponent,
    ProInfoComponent,
    HelpInfoComponent,
    PublicPlayerPageComponent,
    PublicPageComponent
  ],
  imports: [
    BrowserModule,
    FileUploadModule,
    FormsModule,
    routing
  ],
  providers: [
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    AboutUsInfoComponent,
    ProInfoComponent,
    HelpInfoComponent
  ]
})
export class AppModule {
}
