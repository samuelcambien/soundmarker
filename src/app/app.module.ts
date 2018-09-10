import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {PublicUploadFormComponent} from './public-upload-page/public-upload-form/public-upload-form.component';
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
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {SoundmarkerComponent} from './soundmarker/soundmarker.component';
import {MyCurrencyFormatterDirective} from './my-currency-formatter.directive';
import {MyCurrencyPipe} from './my-currency.pipe';
import {TimeInputComponent} from './comments/time-input/time-input.component';
import {FileUploadModule} from "./ng2-file-upload";
import {SplitterDirective} from './splitter.directive';
import { PublicPlayerListComponent } from './public-player-page/public-player-list/public-player-list.component';
import { PublicPlayerTrackComponent } from './public-player-page/public-player-track/public-player-track.component';

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
    SoundmarkerComponent,
    MyCurrencyFormatterDirective,
    MyCurrencyPipe,
    TimeInputComponent,
    SplitterDirective,
    PublicPlayerListComponent,
    PublicPlayerTrackComponent
  ],
  imports: [
    BrowserModule,
    FileUploadModule,
    FormsModule,
    ReactiveFormsModule,
    DragAndDropModule.forRoot(),
    NgbModule.forRoot(),
    routing
  ],
  providers: [
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    AboutUsInfoComponent,
    ProInfoComponent,
    HelpInfoComponent,
    ReplyFormComponent
  ]
})
export class AppModule {
}
