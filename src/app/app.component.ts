import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
}

export class RestUrl {

  public static BASE: string = "http://localhost:3000";

  public static UPLOAD: string = RestUrl.BASE + "/upload/file";

  public static TRACK: string = RestUrl.BASE + "/track";

  public static VERSION: string = RestUrl.TRACK + "/version";

  public static COMMENTS: string = RestUrl.VERSION + "/comments";
}

export class Utils {

  public static sendGetRequest(url, callback): void {
    let trackRequest = new XMLHttpRequest();
    trackRequest.open("GET", url, true);
    trackRequest.send();
    trackRequest.addEventListener("readystatechange", () => {
      if (trackRequest.readyState == 4 && trackRequest.status == 200) {
        callback(JSON.parse(trackRequest.responseText));
      }
    }, false);
  }

  public static sendPostRequest(url): void {
    let trackRequest = new XMLHttpRequest();
    trackRequest.open("POST", url, true);
    trackRequest.send();
  }
}
