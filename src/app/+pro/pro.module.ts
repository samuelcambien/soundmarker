import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from "../modules/shared.module";
import {ProRoutingModule} from "./pro-routing.module";
import {ProBoardComponent} from "./page/board/pro-board.component";
import {ProPageComponent} from "./page/pro-page.component";
import {ProBoardProjectsComponent} from "./projects/pro-board-projects.component";
import {ProProjectComponent} from "./projects/project/pro-project.component";
import {ProTrackComponent} from "./projects/track/pro-track.component";
import {ProSidebarItemProjectComponent} from "./page/sidebar/pro-sidebar-item-project/pro-sidebar-item-project.component";
import {ProSidebarItemTransferComponent} from "./page/sidebar/pro-sidebar-item-transfer/pro-sidebar-item-transfer.component";
import {ProSidebarComponent} from "./page/sidebar/pro-sidebar.component";
import {ProTopbarComponent} from "./page/topbar/pro-topbar.component";
import {ProBoardCardComponent} from './shared/pro-board-card/pro-board-card.component';
import {ProjectModule} from "../modules/project.module";

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ProRoutingModule,
    ProjectModule,
  ],
  declarations: [
    ProPageComponent,
    ProBoardProjectsComponent,
    ProProjectComponent,
    ProBoardComponent,
    ProTrackComponent,
    ProSidebarItemProjectComponent,
    ProSidebarItemTransferComponent,
    ProSidebarComponent,
    ProTopbarComponent,
    ProBoardCardComponent,
  ],
})
export class ProModule {

}
