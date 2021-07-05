import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ProBoardComponent} from "./page/board/pro-board.component";
import {ProPageComponent} from "./page/pro-page.component";
import {ProProjectComponent} from "./projects/project/pro-project.component";
import {ProjectResolver} from "./projects/project/ProjectResolver";
import {ProTrackComponent} from "./projects/track/pro-track.component";
import {ProUploadPageComponent} from './pro-upload-page/pro-upload-page.component';
import {ProBoardProjectsComponent} from './projects/pro-board-projects.component';
import {PendingChangesGuard} from '../auth/pending-changes.guard';
import {UploadGuard} from '../auth/upload/upload.guard';
import {AuthGuard} from '../auth/auth.guard';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ProPageComponent,
        // canActivate: [AuthGuard],
        children: [
          {
            path: '',
            redirectTo: 'dashboard',
          },
          {
            path: 'dashboard',
            component: ProBoardComponent,
            data: {
              breadcrumb: {
                skip: true,
              },}
          },
          {
            path: 'upload',
            component: ProUploadPageComponent,
            canDeactivate: [PendingChangesGuard],
            data: { breadcrumb: 'Upload' }
            // canActivate: [UploadGuard],
          },
          {
            path: 'projects',
            data: { breadcrumb: 'Projects' },
            children: [
              {
                   path: ':project_hash',
                   children: [
                     {
                       path: 'track/:id',
                       component: ProTrackComponent,
                         resolve: {
                           project: ProjectResolver,
                         },
                     },
                     {
                      path: '',
                      component: ProProjectComponent,
                      resolve: {
                      project: ProjectResolver,
                    },
                     }
                    ],
                    },
              {
                path: '',
                component: ProBoardProjectsComponent
              }
              ]
            },
          {
            path: '/project/:project_hash',
            redirectTo: 'projects/project/:project_hash'
          },
          {
            path: 'transfers',
            component: ProBoardComponent,
          }
        ]
      },
    ])
  ],
  providers: [
    ProjectResolver,
  ]
})
export class ProRoutingModule {
}
