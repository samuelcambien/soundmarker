import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {FileItem, FileUploader} from '../../tools/ng2-file-upload';
import {Status, Uploader} from '../../services/uploader.service';
import {NgForm, Validators} from '@angular/forms';
import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {RestCall} from '../../rest/rest-call';
import {Utils} from '../../app.component';
import {LocalStorageService} from '../../services/local-storage.service';
import {ConfirmDialogService} from '../../services/confirmation-dialog/confirmation-dialog.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ProjectService} from '../../services/project.service';

// TODO: Als availabily stream only is dan wordt de downloadfile niet opgeslagen, bij Pro moet dat wel want daar kan dat achteraf nog aangepast worden.

@Component({
  selector: 'app-pro-upload-page',
  templateUrl: './pro-upload-page.component.html',
  styleUrls: ['./pro-upload-page.component.scss']
})
export class ProUploadPageComponent implements OnInit {

  link: string;
  existing_projects=[];
  existing_project = true;
  existing_tracks_id = [];
  existing_tracks = [];
  project_id;
  smUploader;
  smFileUploader;

  @ViewChild('waveform') waveform: ElementRef;

  constructor(private uploader: Uploader,
  private localStorageService: LocalStorageService,
  private confirmDialogService: ConfirmDialogService,
  private projectService: ProjectService,
  private router: Router,
  private activatedRoute: ActivatedRoute,
  private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.smUploader = this.uploader.getOpenSMFileUploader();
    this.uploader.getOpenFileUploader().onAfterAddingAll = (items) => {
      this.uploader.getOpenSMFileUploader().addTitles(items);
    }
    try{
      RestCall.getProjects().then(res => {this.existing_projects = res["projects"]})
    }
    catch{
    }
    // if(this.uploader.fileUploader.isUploading) this.stage = this.statusEnum.UPLOADING_SONGS;
  }
  private leftExistingTracks() {
    return this.existing_tracks.filter(e => !this.existing_tracks_id.includes(e.track_id));
  }

  getProjectInfo(project_id){
   let project = this.existing_projects.find(x => x.project_id === project_id);
   RestCall.getProject(project.hash).then(res => this.existing_tracks = res["tracks"])
  }

  addVersion(i){
    console.log(this.existing_tracks_id);
  }

  getTrackTitle(trackId){
    return (this.existing_tracks.find(track => track.track_id === trackId).title);
  }

  toggleExistingProject(){
    this.existing_project = !this.existing_project;
  }

  validators = [Validators.required, Validators.pattern('^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$')];
  player;

  @ViewChild('ngForm') public userFrm: NgForm;
  @Input() tryAgain: EventEmitter<any>;

  // @Output() link = new EventEmitter<string>();
  @Output() removedFileSize = new EventEmitter<number>();
  @Output() error = new EventEmitter();
  @Output() form = new EventEmitter();

  @ViewChild('notes_element') notes_element: ElementRef;
  @ViewChild('ft') files_tooltip: NgbTooltip;

  async onSubmit() {
    this.uploader.newFileUploader();
    this.router.navigate(["../dashboard"], {relativeTo: this.activatedRoute});
    this.smUploader.setStatus(Status.UPLOADING_SONGS);
    try {
      if(!this.existing_project){
      const projectResponse = await RestCall.createNewProject(this.smUploader.getProjectTitle(), this.smUploader.getSMPPW());
      this.project_id = projectResponse["project_id"];
      }

      await Utils.promiseSequential(
        this.smUploader.fileUploader.queue.map((track, index) => () => this.processTrack(this.project_id, track, this.smUploader.getTitle(track), this.existing_tracks_id[index]))
      );
      const shareResponse = await RestCall.shareProject(this.project_id, this.smUploader.expiration, this.smUploader.getProjectNotes(), "", this.smUploader.getReceivers());
      console.log(shareResponse);
      // this.link.emit(shareResponse["project_hash"]);
      // this.uploader.removeFileUploader(running_uploader);
      this.smUploader.setStatus(Status.GREAT_SUCCESS);
      // this.clearForm(true);

    } catch (e) {
      // this.clearForm(false);
      this.error.emit(e);
    }
  }

  private async processTrack(projectId, track: FileItem, title, trackId?): Promise<void> {
    const length = 0;
    const file_name = Utils.getName(track._file.name);
    const extension = Utils.getExtension(track._file.name);
    if(!trackId) {
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

  private setChunkProgress(progress: number) {
    this.setProgress(((100 * this.uploader.getOpenFileUploader().uploaded + progress) / this.uploader.getOpenFileUploader().queue.length));
  }

  cancelUpload(dirty_form, file_nb) {
    if(dirty_form || file_nb>0){
      this.confirmDialogService.confirmThis("There are unsaved changes. Are sure you want to discard this project.", () => {
        this.smUploader.resetSMFileUploader();
        this.router.navigate(["../dashboard"], {relativeTo: this.activatedRoute});
      }, function () {
      })}
    else{
      this.router.navigate(["../dashboard"], {relativeTo: this.activatedRoute});
    }
  }

  getFileSize(file){
    return Utils.getSizeHumanized(file.file.size);
  }
}
