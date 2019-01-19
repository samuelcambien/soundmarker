import {RestUrl, Utils} from "../app.component";
import {Mp3Encoder} from "../mp3-encoder/mp3-encoder";
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
      Mp3Encoder.read(file)
    ]).then(result => {
      return {fileId: result[0]["file_id"], buffer: result[1]};
      });
  }

  public static uploadChunk(buffer, streamFileId: string, downloadFileId: string, index: number, ext: string): Promise<any> {
    return Utils.sendPostDataRequest(RestUrl.UPLOAD_CHUNK, buffer, [streamFileId, downloadFileId, index, ext]);
  }

  public static shareProject(project_id: string, emailFrom?: string, emailTo?: string[]): Promise<any> {
    return Utils.sendPostRequest(RestUrl.PROJECT_SHARE, {
      project_id: project_id,
      sender: emailFrom,
      receiver: emailTo
    });
  }

  public static addComment(comment: Comment): Promise<any> {
    return Utils.sendPostRequest(RestUrl.COMMENT, comment);
  }

  public static subscribe(project_id: string, emailaddress: string) {
    Utils.sendPostRequest(RestUrl.PROJECT_SUBSCRIBE, {
      project_id: project_id,
      emailaddress: emailaddress
    });
  }

  // GET
  static getAdId(): Promise<any> {
    return Utils.sendGetRequest(RestUrl.AD);
  }

  public static getAd(id: string): Promise<any> {
    return Utils.sendGetDataRequest(RestUrl.AD, [id]);
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
