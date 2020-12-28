import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter, HostListener,
  Input,
  NgZone,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {FileItem} from '../../tools/ng2-file-upload';
import {SMFileUploader, Status, Uploader} from '../../services/uploader.service';
import {FormGroup, NgForm, Validators, FormControl} from '@angular/forms';
import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {RestCall} from '../../rest/rest-call';
import {Utils} from '../../app.component';
import {LocalStorageService} from '../../services/local-storage.service';
import {ConfirmDialogService} from '../../services/confirmation-dialog/confirmation-dialog.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ProjectService} from '../../services/project.service';
import {StateService} from '../../services/state.service';
import {Observable} from 'rxjs';
import {ComponentCanDeactivate} from "../../auth/pending-changes.guard";

// TODO: Als availabily stream only is dan wordt de downloadfile niet opgeslagen, bij Pro moet dat wel want daar kan dat achteraf nog aangepast worden.

@Component({
  selector: 'app-pro-upload-page',
  templateUrl: './pro-upload-page.component.html',
  styleUrls: ['./pro-upload-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProUploadPageComponent implements OnInit, ComponentCanDeactivate {

  link: string;
  user_project_list = [];
  selected_existing_tracks = [];
  project_tracks_list = [];
  project_id;
  smUploader: SMFileUploader;

  get createNewProject() {
    return !this.project_id;
  }

  @ViewChild('waveform', {static: false}) waveform: ElementRef;
  @ViewChild('myForm', {static: false, read: NgForm}) myForm: any;

  constructor(private uploader: Uploader,
              private localStorageService: LocalStorageService,
              private confirmDialogService: ConfirmDialogService,
              private projectService: ProjectService,
              private router: Router,
              private stateService: StateService,
              private activatedRoute: ActivatedRoute,
              private cdr: ChangeDetectorRef,
  ) {
  }

  trackId;

  async ngOnInit() {
    this.smUploader = this.uploader.getOpenSMFileUploader();
    this.uploader.getOpenFileUploader().onAfterAddingAll = (items) => {
      this.uploader.getOpenSMFileUploader().addTitles(items);
    };
    this.user_project_list = await this.projectService.getAllProjects();
    if (this.stateService.getVersionUpload().getValue()) {
      this.trackId = this.activatedRoute.snapshot.queryParams.newTrackId;
      this.project_id = this.stateService.getActiveProject().getValue().project_id;
      await this.getProjectInfo(this.project_id);
    }
  }

  private leftExistingTracks() {
    return this.project_tracks_list.filter(e => !this.selected_existing_tracks.includes(e.track_id));
  }

  async getProjectInfo(project_id) {
    let project = this.user_project_list.find(x => x.project_id === project_id);
    this.project_tracks_list = (await RestCall.getProject(project.hash))["tracks"];
    this.selected_existing_tracks = [];
    if (this.trackId) {
      this.selected_existing_tracks[0] = this.trackId;
      this.cdr.detectChanges();
    }
  }

  addVersion(i, $event) {
    if ($event) this.project_tracks_list.find(e => e.track_id == this.selected_existing_tracks[i]).disabled = true;
  }

  removeVersion(i) {
    this.project_tracks_list.find(e => e.track_id == this.selected_existing_tracks[i]).disabled = false;
    this.selected_existing_tracks[i] = null;
  }

  getTrackTitle(track_id) {
    return (this.project_tracks_list.find(track => {
      return track.track_id == track_id;
    }).title);
  }

  validators = [Validators.required, Validators.pattern('^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$')];

  @ViewChild('ngForm', {static: false}) public userFrm: NgForm;
  @Input() tryAgain: EventEmitter<any>;

  // @Output() link = new EventEmitter<string>();
  @Output() removedFileSize = new EventEmitter<number>();
  @Output() error = new EventEmitter();
  @Output() form = new EventEmitter();

  @ViewChild('notes_element', {static: false}) notes_element: ElementRef;
  @ViewChild('ft', {static: false}) files_tooltip: NgbTooltip;

  async canDeactivate(): Promise<boolean> {

    if (!this.stateService.getVersionUpload().getValue()) {
      return true;
    }

    const confirm: boolean = await this.confirmDialogService.confirm();
    if (confirm) {
      this.smUploader.resetSMFileUploader();
      this.stateService.setVersionUpload(false);
    }
    return confirm;
  }

  async onSubmit() {
    this.uploader.newFileUploader();
    this.router.navigate(["../dashboard"], {relativeTo: this.activatedRoute});
    this.smUploader.setStatus(Status.UPLOADING_SONGS);
    try {
      if (this.createNewProject) {
        let stream_type = this.smUploader.stream_type ? "1" : "0";
        const projectResponse = await RestCall.createNewProject(
          this.smUploader.getProjectTitle(),
          this.smUploader.getSMPPW(),
          stream_type,
        );
        this.project_id = projectResponse["project_id"];
      }

      await Utils.promiseSequential(
        this.smUploader.fileUploader.queue.map((track, index) => () => this.processTrack(this.project_id, track, this.smUploader.getTitle(track), this.selected_existing_tracks[index]))
      );
      await RestCall.shareProject(this.project_id, this.smUploader.expiration, this.smUploader.getProjectNotes(), "", this.smUploader.getReceivers());
      this.smUploader.setStatus(Status.GREAT_SUCCESS);

    } catch (e) {
      this.error.emit(e);
    }
  }

  private async processTrack(projectId, track: FileItem, title, trackId?): Promise<void> {
    const length = 0;
    const file_name = Utils.getName(track._file.name);
    const extension = Utils.getExtension(track._file.name);
    if (!trackId) {
      const trackResponse = await RestCall.createNewTrack(projectId, title);
      trackId = trackResponse["track_id"];
    }
    const versionResponse = await RestCall.createNewVersion(
      trackId, this.notes_element.nativeElement.value, this.smUploader.getAvailability() ? "1" : "0"
    );

    const versionId = versionResponse["version_id"];

    const streamFileResponse = await RestCall.createNewFile(track._file, file_name, this.getStreamFileExtension(extension), track._file.size, versionId, 0, length);
    const streamFileId = streamFileResponse["file_id"];

    let downloadFileId: string;
    if (this.smUploader.getAvailability()) {
      const downloadFileResponse = await RestCall.createNewFile(track._file, file_name, extension, track._file.size, versionId, 1, length);
      downloadFileId = downloadFileResponse["file_id"];
    } else {
      downloadFileId = "null";
    }

    const buffer: ArrayBuffer = await Utils.read(track._file);
    await RestCall.uploadChunk(buffer, streamFileId, downloadFileId, 0, extension, progress => this.setChunkProgress(progress));
  }

  private setProgress(progress: number) {
    this.uploader.getOpenFileUploader().progress = progress;
  }

  private getStreamFileExtension(extension: string) {
    switch (extension) {
      case "aac":
        return "aac";
      default:
        return "mp3"
    }
  }

  private removeFromQueue(item, index) {
    this.smUploader.removeFromQueue(item);
    this.project_tracks_list.find(e => e.track_id === this.selected_existing_tracks[index]).disabled = false;
    this.selected_existing_tracks.splice(index, 1);
  }

  private setChunkProgress(progress: number) {
    this.setProgress(((100 * this.uploader.getOpenFileUploader().uploaded + progress) / this.uploader.getOpenFileUploader().queue.length));
  }

  async cancelUpload(dirty_form, file_nb) {
    if (dirty_form || file_nb > 0) {
      if (await this.confirmDialogService.confirm()) {
        this.smUploader.resetSMFileUploader();
        this.stateService.setVersionUpload(false);
        this.router.navigate(["../dashboard"], {relativeTo: this.activatedRoute});
      }
    }
    else {
      this.router.navigate(["../dashboard"], {relativeTo: this.activatedRoute});
    }
  }

  getFileSize(file) {
    return Utils.getSizeHumanized(file.file.size);
  }

  get isVersionUpload(): boolean {
    return this.stateService.getVersionUpload().getValue() == true;
  }
}
