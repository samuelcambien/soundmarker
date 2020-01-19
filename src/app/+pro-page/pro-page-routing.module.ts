import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ProPageComponent} from "../pro/pro-page.component";
import {ProBoardUploadComponent} from "../pro/pro-board/pro-board-upload/pro-board-upload.component";
import {ProBoardProjectsComponent} from "../pro/pro-board/pro-board-projects/pro-board-projects.component";
import {ProBoardProjectsProjectComponent} from "../pro/pro-board/pro-board-projects/pro-board-projects-project/pro-board-projects-project.component";
import {ProBoardComponent} from "../pro/pro-board/pro-board.component";

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
            component: ProBoardProjectsComponent,
          },
          {
            path: 'project',
            component: ProBoardProjectsProjectComponent,
          },
        ]
      },
    ])
  ],
})
export class ProPageRoutingModule {

}
