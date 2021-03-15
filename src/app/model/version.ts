import {File} from "./file";
import {Comment} from "./comment";
import {Track} from "./track";

export class  Version {
  downloadable;
  notes: string;
  track_length: number;
  wave_png: string;
  version_id: string;
  files: File[];
  comments: Comment[];

  track: Track;
}


