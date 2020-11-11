//////////////    MODULES     //////////////
import {Component, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ClipboardModule} from 'ngx-clipboard';
import {DeviceDetectorModule} from 'ngx-device-detector';
import {FormsModule} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';
import {ReactiveFormsModule} from '@angular/forms';
import {TagInputModule} from '../tools/ngx-chips/modules';
import {TrimValueAccessorModule} from 'ng-trim-value-accessor';
import {NgbActiveModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';


//////////////    COMPONENTS     //////////////
import {DropdownToggleComponent} from '../tools/dropdown-toggle/dropdown-toggle.component';
import {ErrorComponent} from '../error/error.component';
import {InfoFooterComponent} from '../+public/public-page/public-info/topics/info-footer/info-footer.component';
import {PageNotFoundComponent} from '../error/page-not-found/page-not-found.component';
import {PublicPageComponent} from '../+public/public-page/public-page.component';
import {PublicPagenotfoundPageComponent} from '../+public/public-pagenotfound-page/public-pagenotfound-page.component';
import {PublicInfoHeaderComponent} from '../+public/public-page/public-info/header/public-info-header.component';
import {PublicIntroductionComponent} from '../+public/public-page/public-info/topics/public-introduction/public-introduction.component';
import {SubscribeComponent} from '../+public/subscribe/subscribe.component';
//////////////    DIRECTIVES    //////////////
import {DraggableDirective} from '../+public/public-player-page/public-track-player/draggable.directive';
import {DurationDirective} from '../tools/formatting/duration.directive';
import {TimeFormatDirective} from '../tools/formatting/time-format.directive';

//////////////    PIPES     //////////////
import {DurationFormatterPipe} from '../tools/formatting/duration-formatter.pipe';
import {HighlightPipe} from '../tools/formatting/highlight.pipe';
import {TimeFormatPipe} from '../tools/formatting/time-format.pipe';
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
    NgbModule,
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
    DropdownToggleComponent,
    ErrorComponent,
    InfoFooterComponent,
    LoadingComponent,
    PageNotFoundComponent,
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
    DropdownToggleComponent,
    ErrorComponent,
    LoadingComponent,
    PageNotFoundComponent,
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
    PublicIntroductionComponent,
    SubscribeComponent
  ]
})


export class SharedModule {
}
