import {File} from "./file";
import {Comment} from "./comment";

export class Version {
  downloadable;
  notes: string;
  track_length: number;
  wave_png: string;
  version_id: string;
  files: File[];
  comments: Comment[];
}
