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

  private static TEXT: string = "http://soundmarker-env.mc3wuhhgpz.eu-central-1.elasticbeanstalk.com";

  private static DATA: string = "http://soundmarker-env.mc3wuhhgpz.eu-central-1.elasticbeanstalk.com";

  public static UPLOAD: string = RestUrl.DATA + "/upload/file";

  public static TRACK: string = RestUrl.TEXT + "/track";

  public static VERSION: string = "https://d3k08uu3zdbsgq.cloudfront.net/Bruno-LetHerKnow.wav";

  public static COMMENTS: string = RestUrl.TRACK + "/version/comments";

  public static REPLIES: string = RestUrl.COMMENTS + "/replies";
}

export class Utils {

  public static getTimeReadable(time) {
    return moment.utc(time).format("mm:ss");
  }

  public static getTimeFormatted(seconds) {
    return moment.utc(moment.duration({'seconds': seconds}).asMilliseconds()).format("mm:ss");
  }

  public static sendGetRequest(url, data, params, callback): void {
    let trackRequest = new XMLHttpRequest();
    for (let entry of data) {
      url += "/" + entry;
    }
    trackRequest.open("GET", url, true);
    // trackRequest.setRequestHeader("Access-Control-Allow-Origin", "true");
    // trackRequest.setRequestHeader("emailAdress", "george.washington@america.com");
    trackRequest.send(params);
    trackRequest.addEventListener("readystatechange", () => {
      if (trackRequest.readyState == 4 && trackRequest.status == 200) {
        callback(JSON.parse(trackRequest.responseText));
      }
    }, false);
  }

  public static sendPostRequest(url, data): void {
    let trackRequest = new XMLHttpRequest();
    trackRequest.open("POST", url, true);
    trackRequest.setRequestHeader("Content-Type", "application/json");
    trackRequest.send(data);
  }
}
