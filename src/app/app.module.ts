import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {PublicUploadFormComponent} from './public-upload-dir/public-upload-form/public-upload-form.component';
import {FileUploadModule} from "ng2-file-upload";
import {FileUploadService} from "ng5-fileupload";
import {HeroFormComponent} from './hero-form/hero-form.component';
import {FormsModule} from '@angular/forms';
import {PublicUploadingFilesComponent} from './public-upload-dir/public-upload-progress/public-uploading-files.component';
import {PublicUploadFinishedComponent} from './public-upload-dir/public-upload-finished/public-upload-finished.component';
import {PublicUploadPageComponent} from './public-upload-dir/public-upload-page/public-upload-page.component';

@NgModule({
  declarations: [
    AppComponent,
    PublicUploadFormComponent,
    HeroFormComponent,
    PublicUploadingFilesComponent,
    PublicUploadFinishedComponent,
    PublicUploadPageComponent
  ],
  imports: [
    BrowserModule,
    FileUploadModule,
    FormsModule
  ],
  providers: [
    FileUploadService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
