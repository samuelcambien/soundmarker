import {Version} from "./version";
import {Project} from "./project";

export class Track {

  track_id: string;
  title: string;
  notes: string;
  versions: Version[];
  duration: number;
  project: Project;
  visible: boolean;
  new_comments: number;

  getVersionIndex(version) {
    return this.versions.findIndex(e => e == version);
  }
}
