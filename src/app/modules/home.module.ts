import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {SharedModule} from './shared.module';
import {PublicUploadPageComponent} from '../+public/public-upload-page/public-upload-page.component';
import {PublicUploadingFilesComponent} from '../+public/public-upload-page/public-upload-progress/public-uploading-files.component';
import {PublicUploadFinishedComponent} from '../+public/public-upload-page/public-upload-finished/public-upload-finished.component';
import {DragAndDropModule} from 'angular-draggable-droppable';
import {PublicUploadFormComponent} from '../+public/public-upload-page/public-upload-form/public-upload-form.component';

import {EmailValidationPopover} from '../+public/public-upload-page/public-upload-form/public-upload-form.component';

const routes: Routes = [
  {
    path: '',
    component: PublicUploadPageComponent,
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    DragAndDropModule,
    SharedModule
  ],
  declarations: [
    PublicUploadFormComponent,
    PublicUploadPageComponent,
    PublicUploadPageComponent,
    PublicUploadFinishedComponent,
    PublicUploadingFilesComponent,
    EmailValidationPopover
  ],
  exports: [
    PublicUploadFormComponent,
    PublicUploadPageComponent,
    PublicUploadFinishedComponent,
    PublicUploadingFilesComponent,
    EmailValidationPopover
  ],
})

export class HomeModule {
}
