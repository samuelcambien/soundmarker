import {RestUrl, Utils} from "../app.component";
import {Comment} from "../model/comment";
import {Project} from "../model/project";
import {Version} from "../model/version";

export class RestCall {

  // POST

  public static createNewProject(): Promise<any> {
    return Utils.sendPostRequest(RestUrl.PROJECT_NEW, {});
  }

  public static createNewTrack(project_id, title): Promise<any> {
    return Utils.sendPostRequest(RestUrl.TRACK_NEW, {
      project_id: project_id,
      track_title: title
    });
  }

  public static createNewVersion(trackId: string, versionNotes: string, downloadable): Promise<Version> {
    return Utils.sendPostRequest(RestUrl.VERSION_NEW, {
      track_id: trackId,
      notes: versionNotes,
      downloadable: downloadable
    });
  }

  public static createWaveform(trackId: string, waveform: string): Promise<any> {
    return Utils.sendPostMockRequest("http://localhost:3000/waveform", {
      version_id: trackId,
      peaks: waveform
    });
  }

  public static createNewFile(file: File, file_name: string, extension: string, size: number, versionId: string, identifier: number, length: number): Promise<{ fileId: string, buffer: ArrayBuffer }> {
    return Promise.all([
      Utils.sendPostRequest(RestUrl.UPLOAD, {
        version_id: versionId,
        identifier: identifier,
        track_length: length,
        chunk_length: 10,
        file_name: file_name,
        extension: extension,
        file_size: size
      }),
      Utils.read(file)
    ]).then(result => {
      return {fileId: result[0]["file_id"], buffer: result[1]};
      });
  }

  public static uploadChunk(buffer, streamFileId: string, downloadFileId: string, index: number, ext: string, onProgress): Promise<any> {
    return Utils.sendPostDataRequest(RestUrl.UPLOAD_CHUNK, buffer, [streamFileId, downloadFileId, index, ext], onProgress);
  }

  public static shareProject(project_id: string, expiration: string, notes: string, emailFrom?: string, emailTo?: string[]): Promise<any> {
    return Utils.sendPostRequest(RestUrl.PROJECT_SHARE, {
      project_id: project_id,
      expiration: expiration,
      notes: notes,
      sender: emailFrom,
      receiver: emailTo
    });
  }

  public static addComment(comment: Comment): Promise<any> {
    return Utils.sendPostRequest(RestUrl.COMMENT, comment);
  }

  public static subscribe(project_id: string, email, notifyID): Promise<any> {
    return Utils.sendPostRequest(RestUrl.PROJECT_SUBSCRIBE, {
      project_id: project_id,
      notify_id: notifyID,
      emailaddress: email
    });
  }

  static logSmaClick(smaId: string): Promise<any> {
    return Utils.sendPostRequest(RestUrl.SMA_CLICK, {
      sma_id: smaId,
    });
  }

  static logSmaImpression(smaId: string): Promise<any>{
    return Utils.sendPostRequest(RestUrl.SMA_IMPRESSION, {
      sma_id: smaId,
    });
  }

  // DELETE
  public static deleteComment(commentId: string) {
    return Utils.sendPostRequest(RestUrl.COMMENT_DELETE, {
      comment_id: commentId
    })
  }

  // GET

  static getSma(sma_id: string): Promise<any> {
    return Utils.sendGetRequest(RestUrl.SMA, [sma_id]);
  }

  public static getRandSma(id: string): Promise<any> {
    return Utils.sendPostRequest(RestUrl.SMA, {sma_id: id});
  }

  public static getProject(projectHash: string): Promise<Project> {
    return Utils.sendGetRequest(RestUrl.PROJECT, [projectHash]);
  }

  public static getTrack(trackId: string): Promise<Version[]> {
    return Utils.sendGetRequest(RestUrl.TRACK, [trackId]);
  }

  public static getVersion(versionId: string): Promise<any> {
    return Utils.sendGetRequest(RestUrl.VERSION, [versionId]);
  }

  public static getWaveform(versionId: string): Promise<any> {
    return Utils.sendGetRequest("http://localhost:3000/waveform", [versionId]);
  }

  public static getComments(versionId: string): Promise<any> {
    return Utils.sendGetRequest(RestUrl.COMMENTS, [versionId]);
  }
}
