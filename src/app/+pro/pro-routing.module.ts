import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ProBoardComponent} from "./page/board/pro-board.component";
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
            component: ProBoardComponent,
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
            },
          },
          {
            path: 'project/:project_hash/track/:id',
            component: ProTrackComponent,
            resolve: {
              project: ProjectResolver,
              track: TrackResolver,
            },
          },
          {
            path: 'transfers',
            component: ProBoardComponent,
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
