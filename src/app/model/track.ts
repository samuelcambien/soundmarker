import {Comment} from "./comment";
import {Version} from "./version";

export class Track {

  track_id: string;
  title: string;
  artist: string;
  notes: string;
  versions: Version[];
  duration: number;
  track_url: string;
  comments: Comment[];
}
