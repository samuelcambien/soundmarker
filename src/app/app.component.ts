import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
}

export class RestUrl {

  private static TEXT: string = "http://localhost:3000";

  private static DATA: string;

  public static UPLOAD: string = RestUrl.DATA + "/upload/file";

  public static TRACK: string = RestUrl.TEXT + "/track";

  public static VERSION: string = RestUrl.DATA + "/version";

  public static COMMENTS: string = RestUrl.TRACK + "/version/comments";

  public static REPLIES: string = RestUrl.COMMENTS + "/replies";
}

export class Utils {

  public static sendGetRequest(url, data, callback): void {
    let trackRequest = new XMLHttpRequest();
    for (let entry of data) {
      url += "/" + entry;
    }
    trackRequest.open("GET", url, true);
    trackRequest.send();
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
