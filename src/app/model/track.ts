import {Comment} from "./comment";
import {Version} from "./version";

export class Track {

  track_id: string;
  title: string;
  artist: string;
  notes: string;
  versions: Promise<Version[]>;
  duration: number;
  comments: Comment[];
}
