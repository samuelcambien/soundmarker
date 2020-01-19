import {NgModule} from '@angular/core';
import {SharedModule} from './modules/shared.module';
import {AppRoutingModule} from './app.routing';

import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {AppComponent} from './app.component';

// import {routing} from './app.routing';

import {ProDashboardTopbarComponent} from './pro/pro-dashboard/pro-dashboard-topbar/pro-dashboard-topbar.component';
import {ProDashboardSidebarComponent} from './pro/pro-dashboard/pro-dashboard-sidebar/pro-dashboard-sidebar.component';
import {ProDashboardSidebarItemProjectComponent} from './pro/pro-dashboard/pro-dashboard-sidebar/pro-dashboard-sidebar-item-project/pro-dashboard-sidebar-item-project.component';
import {ProDashboardSidebarItemTransferComponent} from './pro/pro-dashboard/pro-dashboard-sidebar/pro-dashboard-sidebar-item-transfer/pro-dashboard-sidebar-item-transfer.component';
import {ProBoardComponent} from './pro/pro-board/pro-board.component';
import {ProBoardProjectsTrackComponent} from './pro/pro-board/pro-board-projects/pro-board-projects-track/pro-board-projects-track.component';
import {ProBoardTransfersComponent} from './pro/pro-board/pro-board-transfers/pro-board-transfers.component';
import {ProBoardTransfersTransferComponent} from './pro/pro-board/pro-board-transfers/pro-board-transfers-transfer/pro-board-transfers-transfer.component';
import {ProBoardTransferTrackComponent} from './pro/pro-board/pro-board-transfers/pro-board-transfer-track/pro-board-transfer-track.component';

import { LoadableComponentModule } from 'ngx-loadable-component';

// loadable components manifest
import { appLoadableManifests } from './modules/app-loadable.manifests';
import {appReducers} from "./app.reducer";
import {StoreModule} from '@ngrx/store';
import {coreReducers} from "./core.reducers";
import {AuthGuard} from "./auth/auth.guard";
import {AuthService} from "./auth/auth.service";
import { LoginComponent } from './auth/login/login.component';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    AppRoutingModule,
    LoadableComponentModule.forRoot(appLoadableManifests),
    StoreModule.forRoot(appReducers),
    StoreModule.forFeature('core', coreReducers, {}),
  ],
  declarations: [
    AppComponent,
    ProDashboardTopbarComponent,
    ProDashboardSidebarItemProjectComponent,
    ProDashboardSidebarItemTransferComponent,
    ProBoardComponent,
    ProBoardProjectsTrackComponent,
    ProBoardTransfersComponent,
    ProBoardTransfersTransferComponent,
    ProBoardTransferTrackComponent,
    LoginComponent,
  ],
  providers: [
    AuthGuard,
    AuthService,
  ],
  bootstrap: [AppComponent],
  entryComponents: [
  ]
})
export class AppModule {
}
