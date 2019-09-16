import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {SharedModule} from './shared.module';

import {CommentComponent} from './comments/comment/comment.component';
import {CommentFormComponent} from './comments/comment-form/comment-form.component';
import {ExpiredProjectComponent} from './error/expired-project/expired-project.component';
import {ProjectExpiredComponent} from './error/project-expired/project-expired.component';
import {PublicPlayerPageComponent} from './public-player-page/public-player-page.component';
import {PublicTrackPlayerComponent} from './public-player-page/public-track-player/public-track-player.component';
import {PublicTrackPreviewComponent} from './public-player-page/public-track-preview/public-track-preview.component';
import {PublicPagenotfoundPageComponent} from './public-pagenotfound-page/public-pagenotfound-page.component';
import {ReplyComponent} from './comments/reply/reply.component';
import {ReplyFormComponent} from './comments/reply-form/reply-form.component';
import {TimeInputComponent} from './comments/time-input/time-input.component';
import {WaveformComponent} from './public-player-page/public-track-player/waveform/waveform.component';
import {AboutUsInfoComponent, HelpInfoComponent, ProInfoComponent} from './public-page/public-info/public-info.component';
import {PublicIntroductionComponent} from './public-page/public-info/topics/public-introduction/public-introduction.component';
import {SubscribeComponent} from './subscribe/subscribe.component';

const routes: Routes = [
    {
    path: ':project_hash',
    component: PublicPlayerPageComponent,
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
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
