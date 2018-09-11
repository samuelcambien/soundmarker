import {Comment} from "../comments/comment";

export class Track {

  id: string;
  title: string;
  artist: string;
  notes: string;
  last_version: string;
  duration: number;
  track_url: string;
  comments: Comment[];
}
