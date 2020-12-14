import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {SharedModule} from './shared.module';

import {CommentComponent} from '../comments/comment/comment.component';
import {CommentFormComponent} from '../comments/comment-form/comment-form.component';
import {ExpiredProjectComponent} from '../error/expired-project/expired-project.component';
import {ProjectExpiredComponent} from '../error/project-expired/project-expired.component';
import {PublicPlayerPageComponent} from '../+public/public-player-page/public-player-page.component';
import {PublicTrackPlayerComponent} from '../+public/public-player-page/public-track-player/public-track-player.component';
import {PublicTrackPreviewComponent} from '../+public/public-player-page/public-track-preview/public-track-preview.component';
import {ReplyComponent} from '../comments/reply/reply.component';
import {ReplyFormComponent} from '../comments/reply-form/reply-form.component';
import {TimeInputComponent} from '../comments/time-input/time-input.component';
import {WaveformComponent} from '../+public/public-player-page/public-track-player/waveform/waveform.component';
import {PlayButtonComponent} from "../player/play-button/play-button.component";

const routes: Routes = [
  {
    path: ':project_hash',
    component: PublicPlayerPageComponent,
  }
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),

  ],
  declarations: [
    CommentComponent,
    CommentFormComponent,
    ExpiredProjectComponent,
    ProjectExpiredComponent,
    PublicPlayerPageComponent,
    PublicTrackPlayerComponent,
    PublicTrackPreviewComponent,
    ReplyComponent,
    ReplyFormComponent,
    TimeInputComponent,
    WaveformComponent,
  ],
  exports: [
    CommentComponent,
    CommentFormComponent,
    ExpiredProjectComponent,
    ProjectExpiredComponent,
    PublicPlayerPageComponent,
    PublicTrackPlayerComponent,
    PublicTrackPreviewComponent,
    ReplyComponent,
    ReplyFormComponent,
    TimeInputComponent,
    WaveformComponent
  ],
  entryComponents: [
    ReplyFormComponent
  ]
})

export class ProjectModule {
}
