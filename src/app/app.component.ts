import {Component} from '@angular/core';
import * as moment from "moment";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
}

export class RestUrl {

  private static MOCK: string = "http://localhost:3000";

  private static BACKEND: string = "http://soundmarker-env.mc3wuhhgpz.eu-central-1.elasticbeanstalk.com";

  private static DATA: string = "http://localhost:8080/rest";

  public static UPLOAD: string = RestUrl.DATA + "/upload/file";

  public static PROJECT: string = RestUrl.BACKEND + "/project";

  public static PROJECT_NEW: string = RestUrl.PROJECT + "/new";

  public static TRACK: string = RestUrl.MOCK + "/track";

  public static TRACK_NEW: string = RestUrl.TRACK + "/new";

  public static VERSION: string = RestUrl.TRACK + "/version";

  public static VERSION_NEW: string = RestUrl.VERSION;

  public static PROJECT_URL: string = RestUrl.PROJECT + "/url";

  public static COMMENTS: string = RestUrl.TRACK + "/version/comments";

  public static REPLIES: string = RestUrl.COMMENTS + "/replies";
}

export class Utils {

  public static getTimeReadable(time) {
    // return moment.duration()
  }

  public static getTimeFormatted(seconds) {
    return moment.utc(moment.duration({'seconds': seconds}).asMilliseconds()).format("mm:ss");
  }

  public static sendGetDataRequest(url, data, params, callback): void {
    let trackRequest = new XMLHttpRequest();
    for (let entry of data) {
      url += "/" + entry;
    }
    trackRequest.open("GET", url, true);
    trackRequest.send(params);
    trackRequest.addEventListener("load", () => {
      if (trackRequest.readyState == 4 && trackRequest.status == 200) {
        callback(trackRequest.response);
      }
    }, false);
  }

  public static sendGetRequest(url, data, params, callback): void {
    let trackRequest = new XMLHttpRequest();
    for (let entry of data) {
      url += "/" + entry;
    }
    trackRequest.open("GET", url, true);
    trackRequest.send(params);
    trackRequest.addEventListener("readystatechange", () => {
      if (trackRequest.readyState == 4 && trackRequest.status == 200) {
        callback(JSON.parse(trackRequest.responseText));
      }
    }, false);
  }

  public static sendPostRequest(url, data, callback?): void {
    let trackRequest = new XMLHttpRequest();
    trackRequest.open("POST", url, true);
    trackRequest.send(JSON.stringify(data));
    trackRequest.addEventListener("readystatechange", () => {
      if (trackRequest.readyState == 4 && trackRequest.status == 200  ) {
        callback(JSON.parse(trackRequest.responseText));
      }
    }, false);
  }
}
