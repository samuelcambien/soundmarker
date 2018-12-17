import { Pipe, PipeTransform } from '@angular/core';
import {Utils} from "./app.component";
import * as moment from "moment";

@Pipe({
  name: 'timeFormat'
})
export class TimeFormatPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return Utils.getTimeFormatted(value);
  }

  parse(value: any): number {
    return moment.duration(value).milliseconds();
  }
}
