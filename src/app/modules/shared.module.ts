import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ClipboardModule} from 'ngx-clipboard';
import {DeviceDetectorModule} from 'ngx-device-detector';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';
import {TrimValueAccessorModule} from 'ng-trim-value-accessor';
import {NgbActiveModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ErrorComponent} from '../error/error.component';
import {PageNotFoundComponent} from '../error/page-not-found/page-not-found.component';
import {RouterModule} from '@angular/router';
import {LoadableComponentModule} from 'ngx-loadable-component';
import {LoadingComponent} from "../loading/loading.component";
import {TagInputModule} from "../tools/ngx-chips/modules";
import {DropdownToggleComponent} from "../tools/dropdown-toggle/dropdown-toggle.component";
import {
  AboutUsInfoComponent,
  HelpInfoComponent,
  ProInfoComponent
} from "../+public/public-page/public-info/public-info.component";
import {TimeFormatPipe} from "../tools/formatting/time-format.pipe";
import {HighlightPipe} from "../tools/formatting/highlight.pipe";
import {DurationFormatterPipe} from "../tools/formatting/duration-formatter.pipe";
import {TimeFormatDirective} from "../tools/formatting/time-format.directive";
import {DraggableDirective} from "../+public/public-player-page/public-track-player/draggable.directive";
import {DurationDirective} from "../tools/formatting/duration.directive";
import {SubscribeComponent} from "../+public/subscribe/subscribe.component";
import {PublicPagenotfoundPageComponent} from "../+public/public-pagenotfound-page/public-pagenotfound-page.component";
import {PublicPageComponent} from "../+public/public-page/public-page.component";
import {PublicIntroductionComponent} from "../+public/public-page/public-info/topics/public-introduction/public-introduction.component";
import {PublicInfoHeaderComponent} from "../+public/public-page/public-info/header/public-info-header.component";
import {PlayerIntroductionComponent} from "../+public/public-page/public-info/topics/player-introduction/player-introduction.component";
import {InfoFooterComponent} from "../+public/public-page/public-info/topics/info-footer/info-footer.component";

@NgModule({
  imports: [
    ClipboardModule,
    CommonModule,
    DeviceDetectorModule.forRoot(),
    FormsModule,
    NgbModule.forRoot(),
    NgSelectModule,
    ReactiveFormsModule,
    LoadableComponentModule.forFeature(),
    TrimValueAccessorModule,
    TagInputModule
  ],
  providers: [
    NgbActiveModal
  ],
  declarations: [
    AboutUsInfoComponent,
    DropdownToggleComponent,
    ErrorComponent,
    HelpInfoComponent,
    InfoFooterComponent,
    LoadingComponent,
    PageNotFoundComponent,
    PlayerIntroductionComponent,
    ProInfoComponent,
    PublicInfoHeaderComponent,
    PublicIntroductionComponent,
    PublicPageComponent,
    PublicPagenotfoundPageComponent,
    SubscribeComponent,

    //////////////    DIRECTIVES  //////////////
    DurationDirective,
    DraggableDirective,
    TimeFormatDirective,

    //////////////    PIPES       //////////////
    DurationFormatterPipe,
    HighlightPipe,
    TimeFormatPipe
  ],
  exports:[
    //////////////    MODULES     //////////////
    ClipboardModule,
    FormsModule,
    NgbModule,
    DeviceDetectorModule,
    NgSelectModule,
    ReactiveFormsModule,
    LoadableComponentModule,
    RouterModule,
    TrimValueAccessorModule,
    TagInputModule,

    //////////////    COMPONENTS  //////////////
    AboutUsInfoComponent,
    DropdownToggleComponent,
    ErrorComponent,
    HelpInfoComponent,
    LoadingComponent,
    PageNotFoundComponent,
    PlayerIntroductionComponent,
    ProInfoComponent,
    PublicInfoHeaderComponent,
    PublicIntroductionComponent,
    PublicPageComponent,
    PublicPagenotfoundPageComponent,
    SubscribeComponent,

    //////////////    DIRECTIVES  //////////////
    DurationDirective,
    DraggableDirective,
    TimeFormatDirective,

    //////////////    PIPES       //////////////
    DurationFormatterPipe,
    HighlightPipe,
    TimeFormatPipe
  ],

  entryComponents: [
    AboutUsInfoComponent,
    ProInfoComponent,
    HelpInfoComponent,
    PublicIntroductionComponent,
    SubscribeComponent
  ]
})


export class SharedModule {
}
