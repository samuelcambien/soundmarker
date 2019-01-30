import {Track} from "./track";

export class Project {

  status: string;
  email_from: string;
  project_id: string;
  tracks: Track[];
  expiration: string;
  sender: string;
}
