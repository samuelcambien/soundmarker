import {NgModule} from '@angular/core';
import {LoadableComponentModule} from 'ngx-loadable-component';
import {SmaLazyComponent} from '../sma/sma-lazy/sma-lazy.component';

@NgModule({
  imports: [
    LoadableComponentModule.forChild(SmaLazyComponent)
  ],
  declarations: [SmaLazyComponent]
})

export class SmaLazyComponentModule {}
