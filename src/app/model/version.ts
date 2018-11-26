import {File} from "./file";

export class Version {
  downloadable;
  notes: string;
  track_length: number;
  wave_png: string;
  version_id: string;
  files: Promise<File[]>;
}
