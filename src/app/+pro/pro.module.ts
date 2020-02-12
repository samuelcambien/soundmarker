import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from "../modules/shared.module";
import {ProRoutingModule} from "./pro-routing.module";
import {ProBoardComponent} from "./page/board/pro-board.component";
import {ProPageComponent} from "./page/pro-page.component";
import {ProBoardProjectsComponent} from "./projects/pro-board-projects.component";
import {ProProjectComponent} from "./projects/project/pro-project.component";
import {ProTrackComponent} from "./projects/track/pro-track.component";
import {ProSidebarItemProjectComponent} from "./page/sidebar/pro-sidebar-item-project/pro-sidebar-item-project.component";
import {ProSidebarItemTransferComponent} from "./page/sidebar/pro-sidebar-item-transfer/pro-sidebar-item-transfer.component";
import {ProSidebarComponent} from "./page/sidebar/pro-sidebar.component";
import {ProTopbarComponent} from "./page/topbar/pro-topbar.component";
import {ProBoardCardComponent} from './shared/pro-board-card/pro-board-card.component';
import {ProjectModule} from "../modules/project.module";
import {ProUploadFinishedComponent} from './pro-upload-page/pro-upload-finished/pro-upload-finished.component';
import {ProUploadPageComponent} from './pro-upload-page/pro-upload-page.component';
import {ProUploadFormComponent} from './pro-upload-page/pro-upload-form/pro-upload-form.component';
import {ProUploadingFilesComponent} from './pro-upload-page/pro-upload-progress/pro-uploading-files.component';
import {FileUploadModule} from "../tools/ng2-file-upload";
import { ProUploadStartComponent } from './pro-upload-page/pro-upload-start/pro-upload-start.component';
import {Uploader} from '../services/uploader.service';
import {ConfirmDialogComponent} from '../services/confirmation-dialog/confirmation-dialog.component';
import {ConfirmDialogService} from '../services/confirmation-dialog/confirmation-dialog.service';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ProRoutingModule,
    ProjectModule,
    FileUploadModule
  ],
  declarations: [
    ConfirmDialogComponent,
    ProPageComponent,
    ProBoardProjectsComponent,
    ProProjectComponent,
    ProBoardComponent,
    ProTrackComponent,
    ProSidebarItemProjectComponent,
    ProSidebarItemTransferComponent,
    ProSidebarComponent,
    ProTopbarComponent,
    ProBoardCardComponent,
    ProUploadFinishedComponent,
    ProUploadPageComponent,
    ProUploadStartComponent,
    ProUploadFormComponent,
    ProUploadingFilesComponent,
    ProUploadStartComponent
  ],
  providers:
  [
    ConfirmDialogService,
    Uploader
  ]
})
export class ProModule {

}
