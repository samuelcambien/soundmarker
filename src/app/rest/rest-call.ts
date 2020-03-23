import {Comment} from "../model/comment";
import {Project} from "../model/project";
import {Version} from "../model/version";
import {isDevMode} from "@angular/core";
import {Utils} from "../app.component";

export class RestCall {

  // POST

  public static async createNewProject(): Promise<any> {
    return Request.post(Endpoints.PROJECT_NEW, {});
  }

  public static async createNewTrack(project_id, title): Promise<any> {
    return Request.post(Endpoints.TRACK_NEW, {
      project_id: project_id,
      track_title: title
    });
  }

  public static async createNewVersion(trackId: string, versionNotes: string, downloadable): Promise<Version> {
    return Request.post(Endpoints.VERSION_NEW, {
      track_id: trackId,
      notes: versionNotes,
      downloadable: downloadable
    });
  }

  public static async createNewFile(file: File, file_name: string, extension: string, size: number, versionId: string, identifier: number, length: number): Promise<string> {
    return Request.post(Endpoints.UPLOAD, {
      version_id: versionId,
      identifier: identifier,
      track_length: length,
      chunk_length: 10,
      file_name: file_name,
      extension: extension,
      file_size: size
    });
  }

  public static async uploadChunk(buffer, streamFileId: string, downloadFileId: string, index: number, ext: string, onProgress): Promise<any> {
    return Request.postData(Endpoints.UPLOAD_CHUNK, buffer, [streamFileId, downloadFileId, index, ext], onProgress);
  }

  public static async shareProject(project_id: string, expiration: string, notes: string, emailFrom?: string, emailTo?: string[]): Promise<any> {
    return Request.post(Endpoints.PROJECT_SHARE, {
      project_id: project_id,
      expiration: expiration,
      notes: notes,
      sender: emailFrom,
      receiver: emailTo
    });
  }

  public static async addComment(comment: Comment): Promise<any> {
    return Request.post(Endpoints.COMMENT, comment);
  }

  public static async subscribe(project_id: string, email, notifyID): Promise<any> {
    return Request.post(Endpoints.PROJECT_SUBSCRIBE, {
      project_id: project_id,
      notify_id: notifyID,
      emailaddress: email
    });
  }

  static logSmaClick(smaId: string): Promise<any> {
    return Request.post(Endpoints.SMA_CLICK, {
      sma_id: smaId
    });
  }

  static logSmaImpression(smaId: string): Promise<any> {
    return Request.post(Endpoints.SMA_IMPRESSION, {
      sma_id: smaId
    });
  }

  // DELETE
  public static async deleteComment(commentId: string) {
    return Request.post(Endpoints.COMMENT_DELETE, {
      comment_id: commentId
    })
  }

  // GET

  public static async getSma(sma_id: string): Promise<any> {
    return Request.getNonCaching(Endpoints.SMA, [sma_id]);
  }

  public static async getRandSma(id: string): Promise<any> {
    if(!id)
      return Request.getNonCaching(Endpoints.SMA);
    else
      return Request.post(Endpoints.SMA, {sma_id: id});
  }

  public static async getProject(projectHash: string): Promise<Project> {
    return Request.get(Endpoints.PROJECT, [projectHash]);
  }

  public static async getTrack(trackId: string): Promise<Version[]> {
    return Request.get(Endpoints.TRACK, [trackId]);
  }

  public static async getVersion(versionId: string): Promise<any> {
    return Request.get(Endpoints.VERSION, [versionId]);
  }

  public static async getChunk(awsPath: string, extension: string, index: number) {
    return Request.getData(
      awsPath + index.toString().padStart(3, "0") + "." + extension, [],
      'arraybuffer'
    );
  }

  public static async getComments(versionId: string): Promise<any> {
    return Request.getNonCaching(Endpoints.COMMENTS, [versionId]);
  }
}

export class Endpoints {

  private static BACKEND: string = "http://localhost";

  private static DATA: string = Endpoints.BACKEND;

  public static SMA: string = Endpoints.BACKEND + "/sma";

  public static SMA_IMPRESSION: string = Endpoints.BACKEND + "/sma/imp";

  public static SMA_CLICK: string = Endpoints.BACKEND + "/sma/click";

  public static UPLOAD: string = Endpoints.DATA + "/file/new";

  public static UPLOAD_CHUNK: string = Endpoints.DATA + "/file/chunk";

  public static PROJECT: string = Endpoints.BACKEND + "/project/get";

  public static PROJECT_SHARE: string = Endpoints.BACKEND + "/project/get/url";

  public static PROJECT_SUBSCRIBE: string = Endpoints.BACKEND + "/project/subscribe";

  public static PROJECT_NEW: string = Endpoints.BACKEND + "/project/new";

  public static TRACK: string = Endpoints.BACKEND + "/track";

  public static TRACK_NEW: string = Endpoints.TRACK + "/new";

  public static VERSION: string = Endpoints.TRACK + "/version";

  public static VERSION_NEW: string = Endpoints.VERSION;

  public static COMMENTS: string = Endpoints.TRACK + "/version/comments";

  public static COMMENT: string = Endpoints.TRACK + "/version/comment";

  public static COMMENT_DELETE: string = Endpoints.TRACK + "/version/delete/comment";
}

export class Request {

  private static xhrCache = {};

  public static async get(endpoint, path?): Promise<any> {
    return Request.execute(
      "GET", endpoint,
      {
        path: path,
        parse: true,
        cache: true
      }
    );
  }

  public static async getNonCaching(endpoint, path?): Promise<any> {
    return Request.execute(
      "GET", endpoint,
      {
        path: path,
        parse: true,
        cache: false
      }
    );
  }

  public static async getData(endpoint, path?, responseType?): Promise<any> {
    return Request.execute(
      "GET", endpoint,
      {
        responseType: responseType,
        path: path,
        parse: false,
        cache: true
      }
    );
  }

  public static async post(endpoint, data, path?): Promise<any> {
    return Request.execute(
      "POST", endpoint,
      {
        data: data,
        path: path,
        stringify: true,
        parse: true,
        cache: false
      }
    );
  }

  public static async postData(endpoint, data, path?, onProgress?): Promise<any> {
    return Request.execute(
      "POST", endpoint,
      {
        data: data,
        path: path,
        stringify: false,
        parse: false,
        cache: false,
        onProgress: onProgress,
      }
    );
  }


  public static async execute(method: RequestMethod, endpoint: string, parameters: RequestParameters): Promise<any> {

    let contentType = parameters.contentType;
    let responseType = parameters.responseType;
    let data = parameters.data ? parameters.data : {};
    let path = parameters.path ? parameters.path : [];
    let parse = parameters.parse ? Request.parse : data => data;
    let stringify = parameters.stringify ? Request.stringify : response => response;
    let onProgress = parameters.onProgress;

    return new Promise<any>((resolve, reject) => {

      for (let entry of path) {
        endpoint += "/" + entry;
      }

      if (parameters.cache && endpoint in Request.xhrCache) {

        if (Request.xhrCache[endpoint] === 'pending') {
          setTimeout(() => {
            resolve(Request.get(endpoint))
          }, 1000);
        } else {
          resolve(Request.xhrCache[endpoint]);
        }

        return;
      }

      Request.xhrCache[endpoint] = 'pending';

      let trackRequest = new XMLHttpRequest();

      if (contentType) {
        trackRequest.setRequestHeader("Content-Type", contentType);
      }
      if (responseType) {
        trackRequest.responseType = responseType;
      }

      trackRequest.open(method, endpoint, true);
      trackRequest.onreadystatechange = () => {

        if (trackRequest.readyState !== 4) return;

        if (trackRequest.status >= 200 && trackRequest.status < 300) {
          let response = parse(trackRequest.response);
          Request.xhrCache[endpoint] = response;
          resolve(response);
        } else {
          reject(trackRequest.statusText);
        }
      };
      trackRequest.onerror = () => reject("connection error");

      if (onProgress && !isDevMode()) {
        trackRequest.upload.onprogress = event => onProgress(
          Math.round(event.lengthComputable ? event.loaded * 100 / event.total : 0)
        );
      }

      trackRequest.send(stringify(data));
    });
  }

  private static stringify(data): string {
    return JSON.stringify(data, (key, value) => typeof value === 'string' ? escape(value) : value);
  }

  private static parse(string: string) {
    return JSON.parse(string, (key, value) => typeof value === 'string' ? unescape(value) : value);
  }
}

export type RequestMethod = "GET" | "POST" | "PUT" | "DELETE";

export interface RequestParameters {
  contentType?;
  responseType?;
  data?;
  path?: string[];
  stringify?: boolean;
  parse?: boolean;
  cache?: boolean;
  onProgress?: (number) => void;
}
