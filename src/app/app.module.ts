import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {PublicUploadFormComponent, EmailValidationToolTip} from './public-upload-page/public-upload-form/public-upload-form.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PublicUploadingFilesComponent} from './public-upload-page/public-upload-progress/public-uploading-files.component';
import {PublicUploadFinishedComponent} from './public-upload-page/public-upload-finished/public-upload-finished.component';
import {PublicUploadPageComponent} from './public-upload-page/public-upload-page.component';
import {routing} from "./app.routing";
import {PublicPlayerPageComponent} from './public-player-page/public-player-page.component';
import {PublicPageComponent} from './public-page/public-page.component';
import {PublicInfoHeaderComponent,} from "./public-page/public-info/header/public-info-header.component";
import {
  AboutUsInfoComponent,
  HelpInfoComponent,
  ProInfoComponent
} from "./public-page/public-info/public-info.component";
import {CommentComponent} from './comments/comment/comment.component';
import {ReplyComponent} from './comments/reply/reply.component';
import {CommentFormComponent} from "./comments/comment-form/comment-form.component";
import {ReplyFormComponent} from './comments/reply-form/reply-form.component';
import {DragAndDropModule} from "angular-draggable-droppable";
import {DurationDirective} from './formatting/duration.directive';
import {DurationFormatterPipe} from './formatting/duration-formatter.pipe';
import {NgbActiveModal, NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {TimeInputComponent} from './comments/time-input/time-input.component';
import {FileUploadModule} from "./ng2-file-upload";
import {TagInputModule} from 'ngx-chips';

import {PublicTrackPreviewComponent} from './public-player-page/public-track-preview/public-track-preview.component';
import {PublicTrackPlayerComponent} from './public-player-page/public-track-player/public-track-player.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {PrivacyAndTermsComponent} from './public-page/public-info/topics/privacy-and-terms/privacy-and-terms.component';
import {ContactComponent} from './public-page/public-info/topics/contact/contact.component';
import {InfoFooterComponent} from './public-page/public-info/topics/info-footer/info-footer.component';
import {TermsComponent} from './public-page/public-info/topics/privacy-and-terms/terms/terms.component';
import {PrivacyComponent} from './public-page/public-info/topics/privacy-and-terms/privacy/privacy.component';
import {CookieComponent} from './public-page/public-info/topics/privacy-and-terms/cookie/cookie.component';
import {NtdComponent} from './public-page/public-info/topics/privacy-and-terms/ntd/ntd.component';
import {HighlightPipe} from './formatting/highlight.pipe';
import {TimeFormatPipe} from './time-format.pipe';
import {DraggableDirective} from './public-player-page/public-track-player/draggable.directive';
import {PublicIntroductionComponent} from './public-page/public-info/topics/public-introduction/public-introduction.component';
import {PlayerIntroductionComponent} from './public-page/public-info/topics/player-introduction/player-introduction.component';
import {NgSelectModule} from '@ng-select/ng-select';
import {ClipboardModule} from "ngx-clipboard";
import {TimeFormatDirective} from './time-format.directive';
import {SubscribeComponent} from './subscribe/subscribe.component';
import {ErrorComponent} from "./error/error.component";
import { PageNotFoundComponent } from './error/page-not-found/page-not-found.component';
import { ProjectExpiredComponent } from './error/project-expired/project-expired.component';
import { PublicPagenotfoundPageComponent } from './public-pagenotfound-page/public-pagenotfound-page.component';
import { ExpiredProjectComponent } from './error/expired-project/expired-project.component';
import { DropdownToggleComponent } from './dropdown-toggle/dropdown-toggle.component';
import { ProDashboardTopbarComponent } from './pro/pro-dashboard/pro-dashboard-topbar/pro-dashboard-topbar.component';
import { ProDashboardSidebarComponent } from './pro/pro-dashboard/pro-dashboard-sidebar/pro-dashboard-sidebar.component';
import { ProDashboardSidebarItemProjectComponent } from './pro/pro-dashboard/pro-dashboard-sidebar/pro-dashboard-sidebar-item-project/pro-dashboard-sidebar-item-project.component';
import { ProDashboardSidebarItemTransferComponent } from './pro/pro-dashboard/pro-dashboard-sidebar/pro-dashboard-sidebar-item-transfer/pro-dashboard-sidebar-item-transfer.component';
import { ProBoardComponent } from './pro/pro-board/pro-board.component';
import { ProDashboardComponent } from './pro/pro-dashboard/pro-dashboard.component';
import { ProBoardUploadComponent } from './pro/pro-board/pro-board-upload/pro-board-upload.component';
import { ProBoardProjectsComponent } from './pro/pro-board/pro-board-projects/pro-board-projects.component';
import { ProBoardProjectsProjectComponent } from './pro/pro-board/pro-board-projects/pro-board-projects-project/pro-board-projects-project.component';
import { ProBoardProjectsTrackComponent } from './pro/pro-board/pro-board-projects/pro-board-projects-track/pro-board-projects-track.component';
import { ProBoardTransfersComponent } from './pro/pro-board/pro-board-transfers/pro-board-transfers.component';
import { ProBoardTransfersTransferComponent } from './pro/pro-board/pro-board-transfers/pro-board-transfers-transfer/pro-board-transfers-transfer.component';
import { ProBoardTransferTrackComponent } from './pro/pro-board/pro-board-transfers/pro-board-transfer-track/pro-board-transfer-track.component';
import { ProComponent } from './pro/pro.component';


@NgModule({
  declarations: [
    AppComponent,
    PublicUploadFormComponent,
    PublicUploadingFilesComponent,
    PublicUploadFinishedComponent,
    PublicUploadPageComponent,
    PublicInfoHeaderComponent,
    AboutUsInfoComponent,
    ProInfoComponent,
    HelpInfoComponent,
    PublicPlayerPageComponent,
    PublicPageComponent,
    CommentFormComponent,
    CommentComponent,
    ReplyComponent,
    ReplyFormComponent,
    DurationDirective,
    DurationFormatterPipe,
    TimeInputComponent,
    PublicTrackPreviewComponent,
    PublicTrackPlayerComponent,
    ErrorComponent,
    PrivacyAndTermsComponent,
    ContactComponent,
    InfoFooterComponent,
    TermsComponent,
    PrivacyComponent,
    CookieComponent,
    NtdComponent,
    HighlightPipe,
    TimeFormatPipe,
    DraggableDirective,
    PublicIntroductionComponent,
    PlayerIntroductionComponent,
    TimeFormatDirective,
    SubscribeComponent,
    EmailValidationToolTip,
    PageNotFoundComponent,
    ProjectExpiredComponent,
    PublicPagenotfoundPageComponent,
    ExpiredProjectComponent,
    DropdownToggleComponent,
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
    TagInputModule,
    FileUploadModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    DragAndDropModule.forRoot(),
    NgbModule.forRoot(),
    BrowserModule,
    BrowserAnimationsModule,
    ClipboardModule,
    routing,

  ],
  providers: [
    NgbActiveModal
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    AboutUsInfoComponent,
    ProInfoComponent,
    HelpInfoComponent,
    ReplyFormComponent,
    PublicIntroductionComponent,
    PrivacyAndTermsComponent,
    SubscribeComponent
  ]
})
export class AppModule {
}
