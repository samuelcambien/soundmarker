import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ClipboardModule} from 'ngx-clipboard';
import {DeviceDetectorModule} from 'ngx-device-detector';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';
import {TagInputModule} from '../tools/ngx-chips/modules';
import {TrimValueAccessorModule} from 'ng-trim-value-accessor';
import {NgbActiveModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {DropdownToggleComponent} from '../tools/dropdown-toggle/dropdown-toggle.component';
import {ErrorComponent} from '../error/error.component';
import {InfoFooterComponent} from '../+public/public-page/public-info/topics/info-footer/info-footer.component';
import {PageNotFoundComponent} from '../error/page-not-found/page-not-found.component';
import {PublicPageComponent} from '../+public/public-page/public-page.component';
import {PublicPagenotfoundPageComponent} from '../+public/public-pagenotfound-page/public-pagenotfound-page.component';
import {PublicInfoHeaderComponent} from '../+public/public-page/public-info/header/public-info-header.component';
import {PublicIntroductionComponent} from '../+public/public-page/public-info/topics/public-introduction/public-introduction.component';
import {SubscribeComponent} from '../+public/subscribe/subscribe.component';
import {DraggableDirective} from '../+public/public-player-page/public-track-player/draggable.directive';
import {DurationDirective} from '../tools/formatting/duration.directive';
import {TimeFormatDirective} from '../tools/formatting/time-format.directive';
import {DurationFormatterPipe} from '../tools/formatting/duration-formatter.pipe';
import {HighlightPipe} from '../tools/formatting/highlight.pipe';
import {TimeFormatPipe} from '../tools/formatting/time-format.pipe';
import {LoadableComponentModule} from 'ngx-loadable-component';
import {LoadingComponent} from "../loading/loading.component";
import {PlayButtonComponent} from "../player/play-button/play-button.component";
import {RouterModule} from "@angular/router";
import {FileUploadModule} from "../tools/ng2-file-upload";
import {ConfirmDialogService} from '../services/confirmation-dialog/confirmation-dialog.service';

const modules = [
  ClipboardModule,
  CommonModule,
  FileUploadModule,
  FormsModule,
  NgbModule,
  NgSelectModule,
  ReactiveFormsModule,
  RouterModule,
  TrimValueAccessorModule,
  TagInputModule,
];

const rootModules = [
  DeviceDetectorModule.forRoot(),
  LoadableComponentModule.forFeature(),
];

const providers = [
  NgbActiveModal,
  ConfirmDialogService
];

const components = [
  DropdownToggleComponent,
  ErrorComponent,
  InfoFooterComponent,
  LoadingComponent,
  PageNotFoundComponent,
  PublicInfoHeaderComponent,
  PublicPageComponent,
  PublicPagenotfoundPageComponent,
  SubscribeComponent,
  PlayButtonComponent,
];

const directives = [
  DurationDirective,
  DraggableDirective,
  TimeFormatDirective,
];

const pipes = [
  DurationFormatterPipe,
  HighlightPipe,
  TimeFormatPipe,
];

const entryComponents = [
  PublicIntroductionComponent,
  SubscribeComponent,
];

@NgModule({
  imports: [
    ...rootModules,
    ...modules,
  ],
  providers: [
    ...providers,
  ],
  declarations: [
    ...components,
    ...directives,
    ...pipes,
    ...entryComponents,
  ],
  exports: [
    ...modules,
    ...components,
    ...directives,
    ...pipes,
  ],
  entryComponents: [
    ...entryComponents,
  ],
})
export class SharedModule {
}
