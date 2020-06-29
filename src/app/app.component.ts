import {Component} from '@angular/core';
import * as moment from "moment";
import {now} from "moment";
import {environment} from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
}

export class Utils {

    public static read(file: File): Promise<ArrayBuffer> {
    return new Promise<any>(resolve => {
      let reader: FileReader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsArrayBuffer(file);
    })
  }

  public static getName(name: string): string {
    return name.split(/(.*)\.(.*)/)[1];
  }

  public static getSmaDomain(): string{
    return environment.smaDomain;
  }

  public static getExtension(name: string): string {

    return name.split(/(.*)\.(.*)/)[2].toLowerCase();
  }

  public static getTimeHumanized(time) {
    return moment.duration(now() - time).humanize() + " ago";
  }

  public static getTimeAccurate(milliseconds) {
    return moment.unix(milliseconds / 1000).format("D MMM, H:mm");
  }

  public static getTimeFormatted(seconds) {
    return moment.utc(moment.duration({'seconds': seconds}).asMilliseconds()).format("mm:ss");
  }

  public static parseTime(value: string): number {

    let split = value.split(":");
    if (split.length > 3) return;

    let hours = split.length >= 3 ? +split[split.length - 3] : 0;
    let minutes = split.length >= 2 ? +split[split.length - 2] : 0;
    let seconds = +split[split.length - 1];

    return moment.duration({
      'hours': hours,
      'minutes': minutes,
      'seconds': seconds
    }).asSeconds();
  }

  // Convert the queue size left to a human readable string.
  public static getSizeHumanized(bytes: number): string {
    let sizes = ['Bytes', 'KB', 'MB', 'GB'];
    // if (bytes <= 0) {
    //   bytes = bytes + this.acceptedQueueMargin;
    // }
    let i = Math.floor(Math.log(bytes) / Math.log(1000));
    let p = Math.round(bytes / (Math.pow(1000, i)) * 100) / 100;
    return p + ' ' + sizes[i];
  }

  public static getDaysDiff(date){
    return moment(date).diff(moment(), 'days')+1;
  }

  public static getDateHumanized(date) {
    return moment(date).format('MMMM D, YYYY'); // Formatted as "February 25th 2019" for example
  }

  public static promiseSequential(promiseFactories: Function[]): Promise<any> {
    return promiseFactories.reduce(
      (promise, factory) => promise.then(() => factory()),
      Promise.resolve([])
    );
  }
}
