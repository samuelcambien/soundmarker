import {File} from "./file";
import {Comment} from "./comment";
import {Track} from "./track";

export class  Version {
  downloadable;
  notes: string;
  track_length: number;
  version_id: string;
  files: File[];
  comments: Comment[];
  version_number: number;

  track: Track;
}


