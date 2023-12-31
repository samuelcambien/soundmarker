import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {FileItem} from '../../tools/ng2-file-upload';
import {SMFileUploader, Status, Uploader} from '../../services/uploader.service';
import {NgForm, Validators} from '@angular/forms';
import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {RestCall} from '../../rest/rest-call';
import {Utils} from '../../app.component';
import {LocalStorageService} from '../../services/local-storage.service';
import {ConfirmDialogService} from '../../services/confirmation-dialog/confirmation-dialog.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ProjectService} from '../../services/project.service';
import {StateService} from '../../services/state.service';
import {ComponentCanDeactivate} from "../../auth/pending-changes.guard";
import {DOCUMENT} from "@angular/common";
import {AuthService} from "../../auth/auth.service";
import {BreadcrumbService} from 'xng-breadcrumb';
import {Location} from '@angular/common';

// TODO: Als availabily stream only is dan wordt de downloadfile niet opgeslagen, bij Pro moet dat wel want daar kan dat achteraf nog aangepast worden.

@Component({
  selector: 'app-pro-upload-page',
  templateUrl: './pro-upload-page.component.html',
  styleUrls: ['./pro-upload-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class ProUploadPageComponent implements OnInit, ComponentCanDeactivate {

  link: string;
  user_project_list = [];
  selected_existing_tracks = [];
  project_tracks_list = [];
  smUploader: SMFileUploader;
  preventNavigation: boolean;
  version_download = false;

  get createNewProject() {
    return !this.uploader.getOpenSMFileUploader().project_id;
  }

  @ViewChild('waveform', {static: false}) waveform: ElementRef;
  @ViewChild('myForm', {static: false, read: NgForm}) myForm: any;

  constructor(private uploader: Uploader,
              private localStorageService: LocalStorageService,
              private confirmDialogService: ConfirmDialogService,
              private projectService: ProjectService,
              private router: Router,
              private stateService: StateService,
              private authService: AuthService,
              private activatedRoute: ActivatedRoute,
              private cdr: ChangeDetectorRef,
              private breadcrumbService: BreadcrumbService,
              private _location: Location,
              @Inject(DOCUMENT) document) {
  }

  trackId;
  url;

  async ngOnInit() {
      this.smUploader = this.uploader.getOpenSMFileUploader();
    // this.uploader.getOpenFileUploader().onAfterAddingAll = (items) => {
    //   this.uploader.getOpenSMFileUploader().addTitles(items);
    // };
    this.user_project_list = await this.projectService.getAllProjects();
    if (this.stateService.getVersionUpload().getValue()) {
        this.preventNavigation = true;
        this.trackId = this.activatedRoute.snapshot.queryParams.newTrackId;
        this.uploader.getOpenSMFileUploader().setProjectId(this.stateService.getActiveProject().getValue().project_id);
        await this.getProjectInfo(this.uploader.getOpenSMFileUploader().getProjectId());
    }
    this.url = this.router.routerState.snapshot.url;
    this.url = this.url.replace(/[^\/]+$/,'');
  }



  validationCheck(form: NgForm){
    if(!this.stateService.getVersionUpload().getValue()) {
      if (this.smUploader.getFileUploader().getNotUploadedItems().length === 0) {
        this.stateService.setAlert('No tracks are selected for upload');
        return;
      } else if (!this.myForm.controls.projecttitle.value) {
        this.stateService.setAlert('Project title is missing');
        return;
      }
    }
  }

  private leftExistingTracks() {
    return this.project_tracks_list.filter(e => !this.selected_existing_tracks.includes(e.track_id));
  }

  async getProjectInfo(project_id) {
    let project = this.user_project_list.find(x => x.project_id === project_id);
    this.project_tracks_list = (await RestCall.getProject(project.project_hash))["tracks"];
    this.smUploader.setProjectTitle(project.title);
    this.smUploader.setProjectHash(project.project_hash);
    let track_id = this.trackId;
    this.selected_existing_tracks = [];
    if (this.trackId) {
      this.selected_existing_tracks[0] = this.trackId;
      this.breadcrumbService.set('/track/:id', this.getTrackTitle(this.trackId));
      this.breadcrumbService.set('/track/:id/newversion' , 'New version upload');
    }
    this.cdr.detectChanges();
  }

  newProjectSelect(){
    this.smUploader.setProjectTitle(null);
    this.uploader.getOpenSMFileUploader().setProjectId(null);
    this.cdr.detectChanges();
  }

  addVersion(i, $event) {
    let old_version;
    old_version = this.project_tracks_list.find(e => e.disabled && this.selected_existing_tracks.indexOf(e.track_id) == -1 ) ;
    if(old_version)  old_version.disabled = false;
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

  notes: string[];

  @ViewChild('ngForm', {static: false}) public userFrm: NgForm;
  @Input() tryAgain: EventEmitter<any>;

  // @Output() link = new EventEmitter<string>();
  @Output() removedFileSize = new EventEmitter<number>();
  @Output() error = new EventEmitter();
  @Output() form = new EventEmitter();

  @ViewChild('ft', {static: false}) files_tooltip: NgbTooltip;

  async canDeactivate(): Promise<boolean> {
    if (!this.stateService.getVersionUpload().getValue()) return true
    if (!this.preventNavigation) return true
    const confirm: boolean = await this.confirmDialogService.confirm('There are unsaved changes. Are sure you want to discard this project?', 'Yes', 'Undo');
    if (confirm) {
      this.smUploader.resetSMFileUploader();
      this.stateService.setVersionUpload(false);
    }
    return confirm;
  }

  async onSubmit() {
    if (this.smUploader.getFileUploader().getNotUploadedItems().length>0 && this.myForm.valid) {
      if(this.stateService.getVersionUpload().getValue()){
        this._location.back();
      }
      else {
        this.router.navigate(["pro/dashboard"] );
      }
      let smUploadingUploader = this.uploader.getOpenSMFileUploader();
      let uploadingProjectId = this.uploader.getOpenSMFileUploader().project_id;
      let uploading_selected_existing_tracks = this.selected_existing_tracks;
      let uploadingCreateNewProject = this.createNewProject;
      let notes = smUploadingUploader.fileUploader.queue.map(
        (track, index) => (document.getElementById(`notes-${index}`) as HTMLTextAreaElement).value
      );
      this.uploader.newFileUploader();
      this.smUploader = this.uploader.getOpenSMFileUploader();
      this.selected_existing_tracks = [];
      this.preventNavigation = false;
      smUploadingUploader.setStatus(Status.UPLOADING_SONGS);
      try {
        if (uploadingCreateNewProject) {
          let stream_type = smUploadingUploader.stream_type ? "1" : "0";
          const projectResponse = await RestCall.createNewProject(
            smUploadingUploader.getProjectTitle(),
            stream_type,
            smUploadingUploader.getPasswordProtected(),
            smUploadingUploader.getPassword()
          );
          uploadingProjectId = projectResponse["project_id"];
          smUploadingUploader.project_id = projectResponse["project_id"];
          smUploadingUploader.new_project = true;
        }

        await Utils.promiseSequential(
          smUploadingUploader.fileUploader.queue.map((track, index) => () => this.processTrack(smUploadingUploader, uploadingProjectId, track, notes[index], uploading_selected_existing_tracks[index], index))
        );
        if(!smUploadingUploader.isCancelled()){
        this.authService.getCurrentUser().subscribe(async currentUser => {
            const shareResponse = await RestCall.shareProject(uploadingProjectId, smUploadingUploader.expiration, smUploadingUploader.getProjectNotes(), currentUser.email, smUploadingUploader.getReceivers());
            smUploadingUploader.setProjectHash(shareResponse.project_hash);
          }
        )
          smUploadingUploader.setStatus(Status.GREAT_SUCCESS);
        }
      } catch (e) {
        this.error.emit(e);
      }
    }
  }

  private async processTrack(smUploadingUploader: SMFileUploader, projectId, track: FileItem, notes, trackId, index: number): Promise<void> {
    if(!smUploadingUploader.isCancelled()){
      const length = 0;
      const file_name = Utils.getName(track._file.name);
      const extension = Utils.getExtension(track._file.name);
      if (!trackId) {
        const trackResponse = await RestCall.createNewTrack(projectId, smUploadingUploader.getTitle(track));
        trackId = trackResponse["track_id"];
        smUploadingUploader.newly_uploaded_tracks.push(trackId);
      }
      const versionResponse = await RestCall.createNewVersion(
        trackId, notes, smUploadingUploader.getAvailability() ? "1" : "0"
      );

      const versionId = versionResponse["version_id"];
      if(!smUploadingUploader.newly_uploaded_tracks.includes(trackId)){
        smUploadingUploader.newly_uploaded_versions.push(versionId);
      }

      const streamFileResponse = await RestCall.createNewFile(track._file, file_name, this.getStreamFileExtension(extension), track._file.size, versionId, 0, length);
      const streamFileId = streamFileResponse["file_id"];

      let downloadFileId: number;
      if (smUploadingUploader.getAvailability()) {
        const downloadFileResponse = await RestCall.createNewFile(track._file, file_name, extension, track._file.size, versionId, 1, length);
        downloadFileId = downloadFileResponse["file_id"];
      } else {
        downloadFileId = 0;
      }

      const buffer: ArrayBuffer = await Utils.read(track._file);
      await RestCall.uploadChunk(buffer, streamFileId, downloadFileId, 0, extension, progress => this.setChunkProgress(progress));
    }
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
      if (await this.confirmDialogService.confirm('There are unsaved changes. Are sure you want to discard this project?', 'Yes', 'Undo')) {
        this.smUploader.resetSMFileUploader();
        if(this.stateService.getVersionUpload().getValue()){
          this.router.navigate([this.url]);
          this.stateService.setVersionUpload(false);
        }
        else {
          this.router.navigate(["../dashboard"], {relativeTo: this.activatedRoute});
        }
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
