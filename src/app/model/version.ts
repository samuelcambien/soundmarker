import {File} from "./file";

export class Version {
  track_length: number;
  wave_png: string;
  version_id: string;
  files: Promise<File[]>;
}
