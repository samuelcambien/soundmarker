import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ProBoardComponent} from "./page/board/pro-board.component";
import {ProPageComponent} from "./page/pro-page.component";
import {ProProjectComponent} from "./projects/project/pro-project.component";
import {ProjectResolver} from "./projects/project/ProjectResolver";
import {ProTrackComponent} from "./projects/track/pro-track.component";
import {TrackResolver} from "./projects/track/TrackResolver";
import {ProUploadPageComponent} from './pro-upload-page/pro-upload-page.component';
import {UploadGuard} from '../auth/upload/upload.guard';
import {ProBoardProjectsComponent} from './projects/pro-board-projects.component';

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
            component: ProUploadPageComponent,
            // canActivate: [UploadGuard]
          },
          {
            path: 'projects',
            component: ProBoardProjectsComponent,
            data:{
              title:'Projects',
              breadcrumb:[
                {
                  label: 'Projects',
                  url: 'projects'
                }
              ]
            }
          },
          {
            path: 'project/:project_hash',
            component: ProProjectComponent,
            resolve: {
              project: ProjectResolver,
            },
            data: {
              title: 'Project 1',
              breadcrumb: [
                {
                  label: 'Project',
                  url: 'projects'
                },
                {
                  label: '{{projectTitle}}',
                  url: 'project/:project_hash'
                },
              ]
            },
          },
          {
            path: 'projects/project/:project_hash',
            redirectTo: 'project/:project_hash'
          },
          {
            path: 'project/:project_hash/track/:id',
            component: ProTrackComponent,
            resolve: {
              project: ProjectResolver,
              track: TrackResolver,
            },
            data: {
              title: 'PROJECT',
              breadcrumb: [
                {
                  label: 'Projects',
                  url: 'projects'
                },
                {
                  label: '{{projectTitle}}',
                  url: 'project/:project_hash'
                },
                {
                  label: '{{trackTitle}}',
                  url: 'project/:project_hash/track/:id'
                },
              ]
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
