import {Injectable} from '@angular/core';
import {RestCall} from "../rest/rest-call";
import {Track} from "../model/track";

@Injectable({
  providedIn: 'root'
})
export class TrackService {

  async getTrack(trackId: string): Promise<Track> {

    const response = await RestCall.getTrack(trackId);
    const track: Track = Object.assign(new Track(), response, {track_id: trackId});

    track.visible = (response.visibility  == "1");

    return track;
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
