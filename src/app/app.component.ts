import {Component} from '@angular/core';
import * as moment from "moment";
import {now} from "moment";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
}

export class RestUrl {

  private static MOCK: string = "http://localhost:3000";

  private static BACKEND: string = "http://localhost";

  private static DATA: string = RestUrl.BACKEND;

  public static AD: string = RestUrl.BACKEND + "/sma";

  public static UPLOAD: string = RestUrl.DATA + "/file/new";

  public static UPLOAD_CHUNK: string = RestUrl.DATA + "/file/chunk";

  public static PROJECT: string = RestUrl.BACKEND + "/project/get";

  public static PROJECT_SHARE: string = RestUrl.BACKEND + "/project/get/url";

  public static PROJECT_SUBSCRIBE: string = RestUrl.BACKEND + "/project/subscribe";

  public static PROJECT_NEW: string = RestUrl.BACKEND + "/project/new";

  public static PROJECT_TRACKS: string = RestUrl.BACKEND + "/project/tracks";

  public static TRACK: string = RestUrl.BACKEND + "/track";

  public static TRACK_NEW: string = RestUrl.TRACK + "/new";

  public static VERSION: string = RestUrl.TRACK + "/version";

  public static VERSION_NEW: string = RestUrl.VERSION;

  public static PROJECT_URL: string = RestUrl.PROJECT + "/url";

  public static COMMENTS: string = RestUrl.TRACK + "/version/comments";

  public static COMMENT: string = RestUrl.TRACK + "/version/comment";

  public static COMMENT_DELETE: string = RestUrl.TRACK + "/version/delete/comment";

  public static REPLIES: string = RestUrl.COMMENTS + "/replies";
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

  public static getExtension(name: string): string {

    return name.split(/(.*)\.(.*)/)[2].toLowerCase();
  }

  public static getTimeHumanized(time) {
    return moment.duration(now() - time).humanize();
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

  public static sendGetDataRequest(url, params?): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      let trackRequest = new XMLHttpRequest();
      for (let entry of params) {
        url += "/" + entry;
      }
      trackRequest.open("GET", url, true);
      trackRequest.onload = () => resolve(trackRequest.responseText);
      trackRequest.onerror = () => reject(trackRequest.statusText);
      trackRequest.send();
    });
  }

  public static sendGetRequest(url, params?): Promise<any> {

    return new Promise<any>((resolve, reject) => {
      let trackRequest = new XMLHttpRequest();
      if (params) for (let entry of params) {
        url += "/" + entry;
      }
      trackRequest.open("GET", url, true);
      trackRequest.onload = () => resolve(Utils.parse(trackRequest.responseText));
      trackRequest.onerror = () => reject(trackRequest.statusText);
      trackRequest.send();
    });
  }

  public static sendPostDataRequest(url, data, params?, onProgress?): Promise<any> {

    return new Promise((resolve, reject) => {
      let trackRequest = new XMLHttpRequest();
      if (params) for (let entry of params) {
        url += "/" + entry;
      }
      trackRequest.open("POST", url, true);
      trackRequest.onreadystatechange = () => {

        if (trackRequest.readyState !== 4) return;

        if (trackRequest.status >= 200 && trackRequest.status < 300) {
          resolve(Utils.parse(trackRequest.responseText));
        } else {
          reject(trackRequest.statusText);
        }
      };
      trackRequest.onerror = () => reject("connection error");
      trackRequest.upload.onprogress = event => onProgress(
          Math.round(event.lengthComputable ? event.loaded * 100 / event.total : 0)
      );
      trackRequest.send(data);
    });
  }

  public static sendPostRequest(url, data, params?): Promise<any> {
    return new Promise((resolve, reject) => {
      let trackRequest = new XMLHttpRequest();
      if (params) for (let entry of params) {
        url += "/" + entry;
      }
      trackRequest.open("POST", url, true);
      trackRequest.onreadystatechange = () => {

        if (trackRequest.readyState !== 4) return;

        if (trackRequest.status >= 200 && trackRequest.status < 300) {
          resolve(Utils.parse(trackRequest.responseText));
        } else {
          reject(trackRequest.statusText);
        }
      };
      trackRequest.send(Utils.stringify(data));
    });
  }

  public static sendPostMockRequest(url, data, params?): Promise<any> {

    return new Promise((resolve, reject) => {
      let trackRequest = new XMLHttpRequest();
      if (params) for (let entry of params) {
        url += "/" + entry;
      }
      trackRequest.open("POST", url, true);
      trackRequest.setRequestHeader("Content-Type", "application/json");
      trackRequest.onload = () => resolve(Utils.parse(trackRequest.responseText));
      trackRequest.onerror = () => reject(trackRequest.statusText);
      trackRequest.send(Utils.stringify(data));
    });
  }

  public static stringify(data): string {
    return JSON.stringify(data, (key, value) => typeof value === 'string' ? escape(value) : value);
  }

  public static parse(string: string) {
    return JSON.parse(string, (key, value) => typeof value === 'string' ? unescape(value) : value);
  }

  public static promiseSequential(promiseFactories: Function[]): Promise<any> {
    return promiseFactories.reduce(
      (promise, factory) => promise.then(() => factory()),
      Promise.resolve([])
    );
  }
}
