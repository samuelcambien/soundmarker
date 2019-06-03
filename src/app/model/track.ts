import {Version} from "./version";

export class Track {

  track_id: string;
  title: string;
  notes: string;
  versions: Version[];
  duration: number;
}
