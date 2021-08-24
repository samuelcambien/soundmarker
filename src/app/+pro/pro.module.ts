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
import {ProUploadPageComponent} from './pro-upload-page/pro-upload-page.component';
import {ProUploadStartComponent} from './pro-upload-page/pro-upload-start/pro-upload-start.component';
import {Uploader} from '../services/uploader.service';
import {ConfirmDialogComponent} from '../services/confirmation-dialog/confirmation-dialog.component';
import {ConfirmDialogService} from '../services/confirmation-dialog/confirmation-dialog.service';

import {ProUploadPopoverComponent} from './pro-upload-page/pro-upload-popover/pro-upload-popover.component';
import {EditProjectFormComponent} from './projects/edit-project-form/edit-project-form.component';
import {PendingChangesGuard} from '../auth/pending-changes.guard';
import {EditTrackFormComponent} from './projects/edit-track-form/edit-track-form.component';
import {ProjectTransferComponent} from "./transfers/project-transfer/project-transfer.component";
import {ProPopoverComponent} from './shared/pro-popover/pro-popover.component';
import {ProWarningsPopoverComponent } from './page/pro-warnings-popover/pro-warnings-popover.component';
import {BreadcrumbModule} from 'xng-breadcrumb';
import {NewversionGuard} from '../auth/newversion.guard';
import { ProSearchResultsComponent } from './pro-search-results/pro-search-results.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ProRoutingModule,
    ProjectModule,
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
    ProUploadPageComponent,
    ProUploadStartComponent,
    ProUploadPopoverComponent,
    EditProjectFormComponent,
    EditTrackFormComponent,
    ProjectTransferComponent,
    ProPopoverComponent,
    ProWarningsPopoverComponent,
    ProSearchResultsComponent,
  ],
  providers: [
    Uploader,
    PendingChangesGuard,
    NewversionGuard
  ],
  entryComponents: [
    ConfirmDialogComponent,
  ],
})
export class ProModule {
}
