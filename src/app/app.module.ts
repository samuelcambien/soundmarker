import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {PublicUploadFormComponent} from './public-upload-dir/public-upload-form/public-upload-form.component';
import {FileUploadModule} from "ng2-file-upload";
import {FormsModule} from '@angular/forms';
import {PublicUploadingFilesComponent} from './public-upload-dir/public-upload-progress/public-uploading-files.component';
import {PublicUploadFinishedComponent} from './public-upload-dir/public-upload-finished/public-upload-finished.component';
import {PublicUploadPageComponent} from './public-upload-dir/public-upload-page/public-upload-page.component';
import {PublicInfoLinkComponent} from "./public-info/header/public-info-header.component";
import {PublicInfoHeaderComponent} from "./public-info/header/public-info-header.component";
import {PublicInfoZoneComponent} from "./public-info/zone/public-info-zone.component";
import {AboutUsInfoComponent} from './public-info/public-info.component';
import {ProInfoComponent} from './public-info/public-info.component';
import {HelpInfoComponent} from './public-info/public-info.component';

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
    HelpInfoComponent
  ],
  imports: [
    BrowserModule,
    FileUploadModule,
    FormsModule,
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
