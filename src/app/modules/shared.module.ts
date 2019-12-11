//////////////    MODULES     //////////////
import {Component, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ClipboardModule} from 'ngx-clipboard';
import {DeviceDetectorModule} from 'ngx-device-detector';
import {FormsModule} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';
import {ReactiveFormsModule} from '@angular/forms';
import {TagInputModule} from '../ngx-chips/modules';
import {TrimValueAccessorModule} from 'ng-trim-value-accessor';
import {NgbActiveModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';


//////////////    COMPONENTS     //////////////
import {AboutUsInfoComponent} from '../public-page/public-info/public-info.component';
import {DropdownToggleComponent} from '../dropdown-toggle/dropdown-toggle.component';
import {ErrorComponent} from '../error/error.component';
import {HelpInfoComponent} from '../public-page/public-info/public-info.component';
import {InfoFooterComponent} from '../public-page/public-info/topics/info-footer/info-footer.component';
import {PageNotFoundComponent} from '../error/page-not-found/page-not-found.component';
import {PlayerIntroductionComponent} from '../public-page/public-info/topics/player-introduction/player-introduction.component';
import {ProInfoComponent} from '../public-page/public-info/public-info.component';
import {PublicPageComponent} from '../public-page/public-page.component';
import {PublicPagenotfoundPageComponent} from '../public-pagenotfound-page/public-pagenotfound-page.component';
import {PublicInfoHeaderComponent} from '../public-page/public-info/header/public-info-header.component';
import {PublicIntroductionComponent} from '../public-page/public-info/topics/public-introduction/public-introduction.component';
import {SubscribeComponent} from '../subscribe/subscribe.component';
//////////////    DIRECTIVES    //////////////
import {DraggableDirective} from '../public-player-page/public-track-player/draggable.directive';
import {DurationDirective} from '../formatting/duration.directive';
import {TimeFormatDirective} from '../time-format.directive';

//////////////    PIPES     //////////////
import {DurationFormatterPipe} from '../formatting/duration-formatter.pipe';
import {HighlightPipe} from '../formatting/highlight.pipe';
import {TimeFormatPipe} from '../time-format.pipe';
import {RouterModule} from '@angular/router';
import {LoadableComponentModule} from 'ngx-loadable-component';
import {LoadingComponent} from "../loading/loading.component";

@NgModule({
////////////////////////////////////////////////////////  IMPORTS   ////////////////////////////////////////////////////////
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
////////////////////////////////////////////////////////  PROVIDERS   ////////////////////////////////////////////////////////
// ACCORDING TO https://angular.io/guide/ngmodule-faq#q-why-bad you shouldn't add services providers in shared modules.
  providers: [
    NgbActiveModal
  ],
//////////////////////////////////////////////////////// DECLARATIONS ////////////////////////////////////////////////////////
  declarations: [
    //////////////    COMPONENTS  //////////////
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
////////////////////////////////////////////////////////  EXPORTS   ////////////////////////////////////////////////////////
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
