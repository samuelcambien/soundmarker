import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {PublicUploadFormComponent} from './public-upload-dir/public-upload-form/public-upload-form.component';
import {FileUploadModule} from "ng2-file-upload";
import {FormsModule} from '@angular/forms';
import {PublicUploadingFilesComponent} from './public-upload-dir/public-upload-progress/public-uploading-files.component';
import {PublicUploadFinishedComponent} from './public-upload-dir/public-upload-finished/public-upload-finished.component';
import {PublicUploadPageComponent} from './public-upload-dir/public-upload-page/public-upload-page.component';

@NgModule({
  declarations: [
    AppComponent,
    PublicUploadFormComponent,
    PublicUploadingFilesComponent,
    PublicUploadFinishedComponent,
    PublicUploadPageComponent,
  ],
  imports: [
    BrowserModule,
    FileUploadModule,
    FormsModule,
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
