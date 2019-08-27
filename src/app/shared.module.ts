//////////////    MODULES     //////////////
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CommonModule} from '@angular/common';
import {ClipboardModule} from 'ngx-clipboard';
import {DragAndDropModule} from 'angular-draggable-droppable';
import {FileUploadModule} from './ng2-file-upload';
import {FormsModule} from '@angular/forms';
import {NgbActiveModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NgSelectModule} from '@ng-select/ng-select';
import {ReactiveFormsModule} from '@angular/forms';
import {TagInputModule} from './ngx-chips/modules';
import {TrimValueAccessorModule} from 'ng-trim-value-accessor';

//////////////    COMPONENTS     //////////////
import {AboutUsInfoComponent} from './public-page/public-info/public-info.component';
import {DropdownToggleComponent} from './dropdown-toggle/dropdown-toggle.component';
import {ErrorComponent} from './error/error.component';
import {HelpInfoComponent} from './public-page/public-info/public-info.component';
import {InfoFooterComponent} from './public-page/public-info/topics/info-footer/info-footer.component';
import {PageNotFoundComponent} from './error/page-not-found/page-not-found.component';
import {PlayerIntroductionComponent} from './public-page/public-info/topics/player-introduction/player-introduction.component';
import {ProInfoComponent} from './public-page/public-info/public-info.component';
import {PublicPageComponent} from './public-page/public-page.component';
import {PublicPagenotfoundPageComponent} from './public-pagenotfound-page/public-pagenotfound-page.component';
import {PublicInfoHeaderComponent} from './public-page/public-info/header/public-info-header.component';
import {PublicIntroductionComponent} from './public-page/public-info/topics/public-introduction/public-introduction.component';
import {SubscribeComponent} from './subscribe/subscribe.component';

//////////////    DIRECTIVES    //////////////
import {DraggableDirective} from './public-player-page/public-track-player/draggable.directive';
import {DurationDirective} from './formatting/duration.directive';
import {TimeFormatDirective} from './time-format.directive';

//////////////    PIPES     //////////////
import {DurationFormatterPipe} from './formatting/duration-formatter.pipe';
import {HighlightPipe} from './formatting/highlight.pipe';
import {TimeFormatPipe} from './time-format.pipe';

@NgModule({
////////////////////////////////////////////////////////  IMPORTS   ////////////////////////////////////////////////////////
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    ClipboardModule,
    CommonModule,
    DragAndDropModule.forRoot(),
    FileUploadModule,
    FormsModule,
    NgbModule.forRoot(),
    NgSelectModule,
    ReactiveFormsModule,
    TrimValueAccessorModule,
    TagInputModule,
  ],
////////////////////////////////////////////////////////  PROVIDERS   ////////////////////////////////////////////////////////
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
    BrowserAnimationsModule,
    BrowserModule,
    ClipboardModule,
    DragAndDropModule,
    FileUploadModule,
    FormsModule,
    NgbModule,
    NgSelectModule,
    ReactiveFormsModule,
    TrimValueAccessorModule,
    TagInputModule,

    //////////////    COMPONENTS  //////////////
    AboutUsInfoComponent,
    DropdownToggleComponent,
    ErrorComponent,
    HelpInfoComponent,
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
  ]
})

export class SharedModule { }
