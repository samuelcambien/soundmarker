import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from "../modules/shared.module";
import {ProRoutingModule} from "./pro-routing.module";
import {ProBoardUploadComponent} from "../pro/pro-board/pro-board-upload/pro-board-upload.component";
import {ProBoardComponent} from "../pro/pro-board/pro-board.component";
import {ProBoardTransfersComponent} from "../pro/pro-board/pro-board-transfers/pro-board-transfers.component";
import {ProBoardTransfersTransferComponent} from "../pro/pro-board/pro-board-transfers/pro-board-transfers-transfer/pro-board-transfers-transfer.component";
import {ProBoardTransferTrackComponent} from "../pro/pro-board/pro-board-transfers/pro-board-transfer-track/pro-board-transfer-track.component";
import {ProPageComponent} from "./page/pro-page.component";
import {ProBoardProjectsComponent} from "./projects/pro-board-projects.component";
import {ProProjectComponent} from "./projects/project/pro-project.component";
import {ProTrackComponent} from "./projects/track/pro-track.component";
import {ProSidebarItemProjectComponent} from "./page/sidebar/pro-sidebar-item-project/pro-sidebar-item-project.component";
import {ProSidebarItemTransferComponent} from "./page/sidebar/pro-sidebar-item-transfer/pro-sidebar-item-transfer.component";
import {ProSidebarComponent} from "./page/sidebar/pro-sidebar.component";
import {ProTopbarComponent} from "./page/topbar/pro-topbar.component";

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ProRoutingModule,
  ],
  declarations: [
    ProPageComponent,
    ProBoardUploadComponent,
    ProBoardProjectsComponent,
    ProProjectComponent,
    ProBoardComponent,
    ProTrackComponent,
    ProBoardTransfersComponent,
    ProBoardTransfersTransferComponent,
    ProBoardTransferTrackComponent,
    ProSidebarItemProjectComponent,
    ProSidebarItemTransferComponent,
    ProSidebarComponent,
    ProTopbarComponent,
  ],
})
export class ProModule {

}
