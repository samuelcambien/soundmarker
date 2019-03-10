import {Pipe, PipeTransform} from '@angular/core';
import {Utils} from "./app.component";

@Pipe({
  name: 'timeFormat'
})
export class TimeFormatPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return Utils.getTimeFormatted(value);
  }
}
