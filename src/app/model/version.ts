import {File} from "./file";

export class Version {
  downloadable;
  notes: string;
  track_length: number;
  wave_png: number[];
  version_id: string;
  files: Promise<File[]>;
}
