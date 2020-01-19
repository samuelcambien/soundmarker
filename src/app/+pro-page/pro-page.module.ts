import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from "../modules/shared.module";
import {ProPageRoutingModule} from "./pro-page-routing.module";
import {ProDashboardComponent} from "../pro/pro-dashboard/pro-dashboard.component";
import {ProPageComponent} from "../pro/pro-page.component";
import {ProBoardUploadComponent} from "../pro/pro-board/pro-board-upload/pro-board-upload.component";
import {ProBoardProjectsComponent} from "../pro/pro-board/pro-board-projects/pro-board-projects.component";
import {ProBoardProjectsProjectComponent} from "../pro/pro-board/pro-board-projects/pro-board-projects-project/pro-board-projects-project.component";
import {ProDashboardSidebarComponent} from "../pro/pro-dashboard/pro-dashboard-sidebar/pro-dashboard-sidebar.component";

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ProPageRoutingModule,
  ],
  declarations: [
    ProPageComponent,
    ProDashboardComponent,
    ProBoardUploadComponent,
    ProBoardProjectsComponent,
    ProBoardProjectsProjectComponent,
    ProDashboardSidebarComponent,
  ],
  providers: [
  ]
})
export class ProPageModule {

}
