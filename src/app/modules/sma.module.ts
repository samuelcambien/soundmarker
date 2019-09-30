import {CommonModule} from '@angular/common';
import {LoadableComponentModule} from 'ngx-loadable-component';
import {NgModule} from '@angular/core';
import {SmaComponent} from '../sma/sma.component';
import {SharedModule} from './shared.module';

@NgModule({
  imports: [
    CommonModule,
    LoadableComponentModule.forChild(SmaComponent)
  ],
  declarations: [SmaComponent]
})

export class SmaComponentModule {}
