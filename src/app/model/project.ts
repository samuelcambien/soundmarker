import {Track} from "./track";

export class Project {

  status: string;
  email_from: string;
  project_id: string;
  project_hash: string;
  tracks: Track[];
  expiration: string;
  sender: string;
  title: string;

  downloads: boolean;
  losless: boolean;
}
