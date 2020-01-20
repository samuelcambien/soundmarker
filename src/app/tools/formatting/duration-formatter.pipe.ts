import {Pipe, PipeTransform} from '@angular/core';
import {Utils} from "../../app.component";

@Pipe({
  name: 'durationFormatter'
})
export class DurationFormatterPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return Utils.getTimeFormatted(value);
  }


}
