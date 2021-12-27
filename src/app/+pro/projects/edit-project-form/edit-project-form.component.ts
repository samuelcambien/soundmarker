import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Project} from "../../../model/project";
import {Uploader} from "../../../services/uploader.service";
import {ProjectService} from "../../../services/project.service";
import {TrackService} from '../../../services/track.service';
import {NgForm} from '@angular/forms';
import {ConfirmDialogService} from '../../../services/confirmation-dialog/confirmation-dialog.service';
import {Track} from '../../../model/track';
import {RestCall} from '../../../rest/rest-call';
import {NgbModal, NgbModalModule} from '@ng-bootstrap/ng-bootstrap';
import {ChangeDetection} from '@angular/cli/lib/config/schema';

@Component({
  selector: 'app-edit-project-form',
  templateUrl: './edit-project-form.component.html',
  styleUrls: ['./edit-project-form.component.scss']
})
export class EditProjectFormComponent implements OnInit {

  @Input() project: Project;

  @Output() close = new EventEmitter();
  @Output() save = new EventEmitter();

  changedTracks = [];

  title: string;

  downloads: boolean;
  lossless: boolean;
  passwordProtected: boolean;
  password: string;

  constructor(
    protected projectService: ProjectService,
    protected trackService: TrackService,
    private cdr: ChangeDetectorRef,
    private confirmDialogService: ConfirmDialogService,
    private modalService: NgbModal
  ) {
  }

  ngOnInit() {
    this.title = this.project.title;
    this.lossless = this.project.lossless;
    this.passwordProtected = false;
  }

  async onSubmit(form: NgForm) {
    await this.projectService.editProject(
      this.project.project_id,
      this.title,
      this.downloads,
      this.lossless,
      this.passwordProtected,
      this.password,
    );
    await this.changedTracks.forEach(index=>{
        let track = this.project.tracks[index];
        this.trackService.editTrack(track, track.title, track.visible);
      }
    )
    this.save.emit();
  }

  trackByFn(index, item) {
    return index;  }

  editedTrack(i, newTitle?){
    this.project.tracks[i].title = newTitle ? newTitle : this.project.tracks[i].title;
    this.changedTracks.push(i);
    this.changedTracks = this.changedTracks.filter((el, i, a) => i === a.indexOf(el)) // Remove duplicates
  }

  toggleVisibility(i){
    this.project.tracks[i].visible = !this.project.tracks[i].visible;
    this.editedTrack(i);
    return;
  }

  async deleteTrack(track: Track){
      const confirm: boolean = await this.confirmDialogService.confirm('Are you sure you want to delete all content related with this track?\n' +
        'This operation cannot be undone: ' + track.title + '?', 'Yes', "No");
      if (confirm) {
        await RestCall.deleteTrack(track.track_id).then( ()=>{
              this.project.tracks = this.project.tracks.filter(item => item.track_id != track.track_id);
              if(this.project.tracks.length == 0) {this.modalService.dismissAll();}
              this.cdr.detectChanges();
            })
      }
    }
}
