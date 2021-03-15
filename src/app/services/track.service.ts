import {Injectable} from '@angular/core';
import {RestCall} from "../rest/rest-call";
import {Track} from "../model/track";
import {Version} from "../model/version";
import {Comment} from "../model/comment";

@Injectable({
  providedIn: 'root'
})
export class TrackService {

  async getTrack(trackId: string): Promise<Track> {

    const response = await RestCall.getTrack(trackId);
    const track: Track = Object.assign(new Track(), response, {track_id: trackId});

    track.visible = (response.visibility  == "1");

    await this.loadVersions(track);

    return track;
  }

  private async loadVersions(track: Track): Promise<void> {

    track.versions = (await RestCall.getTrack(track.track_id))["versions"];

    track.versions.forEach(version => {
      this.loadFiles(version);
      if (version.downloadable == 0) version.downloadable = false;
      version.track = track;
    });
    // const version = track.versions[0];
    // await this.loadFiles(version);
  }

  async loadFiles(version: Version) {
    version.files = (await RestCall.getVersion(version.version_id))["files"];
    this.loadComments(version);
    // interval(20 * 1000)
    //   .subscribe(() => this.loadComments(version))
  }

  private async loadComments(version: Version): Promise<void> {
    let allComments: Comment[] = (await RestCall.getComments(version.version_id))["comments"];
    version.comments = (version.comments || [])
      .concat(
        allComments
          .filter(comment => comment.parent_comment_id == 0)
          .filter(comment =>
            !(version.comments || [])
              .map(loadedComment => loadedComment.comment_id)
              .includes(comment.comment_id)
          )
      );
    for (let comment of version.comments) {
      if (comment.include_end == 0) comment.include_end = false;
      if (comment.include_start == 0) comment.include_start = false;
      comment.version_id = version.version_id;
      this.loadReplies(comment, allComments);
    }
  }

  private loadReplies(comment: Comment, allComments: Comment[]) {
    comment.replies = (comment.replies || []).concat(allComments.filter(reply => reply.parent_comment_id == comment.comment_id)
      .filter(reply =>
        !(comment.replies || [])
          .map(loadedReply => loadedReply.comment_id)
          .includes(reply.comment_id)
      ));
  }

  async editTrack(track: Track, title: string, visible: boolean) {
    await RestCall.editTrack(
      track.track_id,
      title,
      visible ? "1" : "0",
    )
  }

  async delete(track: Track) {
    await RestCall.deleteTrack(track.track_id);
  }
}
