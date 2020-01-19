import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ProBoardUploadComponent} from "../pro/pro-board/pro-board-upload/pro-board-upload.component";
import {ProBoardComponent} from "../pro/pro-board/pro-board.component";
import {ProBoardTransfersComponent} from "../pro/pro-board/pro-board-transfers/pro-board-transfers.component";
import {ProPageComponent} from "./page/pro-page.component";
import {ProProjectComponent} from "./projects/project/pro-project.component";
import {ProjectResolver} from "./projects/project/ProjectResolver";
import {ProTrackComponent} from "./projects/track/pro-track.component";
import {TrackResolver} from "./projects/track/TrackResolver";

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ProPageComponent,
        children: [
          {
            path: '',
            redirectTo: 'dashboard',
          },
          {
            path: 'dashboard',
            component: ProBoardComponent,
          },
          {
            path: 'upload',
            component: ProBoardUploadComponent,
          },
          {
            path: 'projects',
            component: ProBoardComponent,
          },
          {
            path: 'project/:project_hash',
            component: ProProjectComponent,
            resolve: {
              project: ProjectResolver,
            }
          },
          {
            path: 'track/:id',
            component: ProTrackComponent,
            resolve: {
              track: TrackResolver,
            }
          },
          {
            path: 'transfers',
            component: ProBoardTransfersComponent,
          },
        ]
      },
    ])
  ],
  providers: [
    ProjectResolver,
    TrackResolver,
  ]
})
export class ProRoutingModule {

}
