import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from "../modules/shared.module";
import {ProPageRoutingModule} from "./pro-page-routing.module";
import {ProPageComponent} from "../pro/pro-page.component";
import {ProBoardUploadComponent} from "../pro/pro-board/pro-board-upload/pro-board-upload.component";
import {ProBoardProjectsComponent} from "../pro/pro-board/pro-board-projects/pro-board-projects.component";
import {ProBoardProjectsProjectComponent} from "../pro/pro-board/pro-board-projects/pro-board-projects-project/pro-board-projects-project.component";
import {ProBoardComponent} from "../pro/pro-board/pro-board.component";
import {ProBoardProjectsTrackComponent} from "../pro/pro-board/pro-board-projects/pro-board-projects-track/pro-board-projects-track.component";
import {ProBoardTransfersComponent} from "../pro/pro-board/pro-board-transfers/pro-board-transfers.component";
import {ProBoardTransfersTransferComponent} from "../pro/pro-board/pro-board-transfers/pro-board-transfers-transfer/pro-board-transfers-transfer.component";
import {ProBoardTransferTrackComponent} from "../pro/pro-board/pro-board-transfers/pro-board-transfer-track/pro-board-transfer-track.component";
import {ProSidebarItemProjectComponent} from "../pro/pro-sidebar/pro-sidebar-item-project/pro-sidebar-item-project.component";
import {ProSidebarComponent} from "../pro/pro-sidebar/pro-sidebar.component";
import {ProSidebarItemTransferComponent} from "../pro/pro-sidebar/pro-sidebar-item-transfer/pro-sidebar-item-transfer.component";

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ProPageRoutingModule,
  ],
  declarations: [
    ProPageComponent,
    ProBoardUploadComponent,
    ProBoardProjectsComponent,
    ProBoardProjectsProjectComponent,
    ProBoardComponent,
    ProBoardProjectsTrackComponent,
    ProBoardTransfersComponent,
    ProBoardTransfersTransferComponent,
    ProBoardTransferTrackComponent,
    ProSidebarItemProjectComponent,
    ProSidebarItemTransferComponent,
    ProSidebarComponent,
  ],
  providers: [
  ]
})
export class ProPageModule {

}
