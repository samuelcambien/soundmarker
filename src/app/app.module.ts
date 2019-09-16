import {NgModule} from '@angular/core';
import {ProjectModule} from './project.module';
import {SharedModule} from './shared.module';
import {AppRoutingModule} from './app.routing';

import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {AppComponent} from './app.component';
import {EmailValidationToolTip, PublicUploadFormComponent} from './public-upload-page/public-upload-form/public-upload-form.component';

import {PublicUploadingFilesComponent} from './public-upload-page/public-upload-progress/public-uploading-files.component';
import {PublicUploadFinishedComponent} from './public-upload-page/public-upload-finished/public-upload-finished.component';
import {PublicUploadPageComponent} from './public-upload-page/public-upload-page.component';
// import {routing} from './app.routing';

import {ProDashboardTopbarComponent} from './pro/pro-dashboard/pro-dashboard-topbar/pro-dashboard-topbar.component';
import {ProDashboardSidebarComponent} from './pro/pro-dashboard/pro-dashboard-sidebar/pro-dashboard-sidebar.component';
import {ProDashboardSidebarItemProjectComponent} from './pro/pro-dashboard/pro-dashboard-sidebar/pro-dashboard-sidebar-item-project/pro-dashboard-sidebar-item-project.component';
import {ProDashboardSidebarItemTransferComponent} from './pro/pro-dashboard/pro-dashboard-sidebar/pro-dashboard-sidebar-item-transfer/pro-dashboard-sidebar-item-transfer.component';
import {ProBoardComponent} from './pro/pro-board/pro-board.component';
import {ProDashboardComponent} from './pro/pro-dashboard/pro-dashboard.component';
import {ProBoardUploadComponent} from './pro/pro-board/pro-board-upload/pro-board-upload.component';
import {ProBoardProjectsComponent} from './pro/pro-board/pro-board-projects/pro-board-projects.component';
import {ProBoardProjectsProjectComponent} from './pro/pro-board/pro-board-projects/pro-board-projects-project/pro-board-projects-project.component';
import {ProBoardProjectsTrackComponent} from './pro/pro-board/pro-board-projects/pro-board-projects-track/pro-board-projects-track.component';
import {ProBoardTransfersComponent} from './pro/pro-board/pro-board-transfers/pro-board-transfers.component';
import {ProBoardTransfersTransferComponent} from './pro/pro-board/pro-board-transfers/pro-board-transfers-transfer/pro-board-transfers-transfer.component';
import {ProBoardTransferTrackComponent} from './pro/pro-board/pro-board-transfers/pro-board-transfer-track/pro-board-transfer-track.component';
import {ProComponent} from './pro/pro.component';

@NgModule({
  declarations: [
    AppComponent,
    PublicUploadFormComponent,
    PublicUploadingFilesComponent,
    PublicUploadFinishedComponent,
    PublicUploadPageComponent,
    EmailValidationToolTip,
    ProDashboardTopbarComponent,
    ProDashboardSidebarComponent,
    ProDashboardSidebarItemProjectComponent,
    ProDashboardSidebarItemTransferComponent,
    ProBoardComponent,
    ProDashboardComponent,
    ProBoardUploadComponent,
    ProBoardProjectsComponent,
    ProBoardProjectsProjectComponent,
    ProBoardProjectsTrackComponent,
    ProBoardTransfersComponent,
    ProBoardTransfersTransferComponent,
    ProBoardTransferTrackComponent,
    ProComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    AppRoutingModule,
  ],
  providers: [
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    // AboutUsInfoComponent,
    // ProInfoComponent,
    // HelpInfoComponent,
    // ReplyFormComponent,
    // PublicIntroductionComponent,
    // PrivacyAndTermsComponent,
    // SubscribeComponent
  ]
})
export class AppModule {
}
