import {Component, ElementRef, EventEmitter, Input, NgZone, OnInit, Output, ViewChild} from '@angular/core';
import {FileItem, FileUploader} from '../../tools/ng2-file-upload';
import {Status, Uploader} from '../../services/uploader.service';
import {NgForm, Validators} from '@angular/forms';
import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
import {RestCall} from '../../rest/rest-call';
import {Utils} from '../../app.component';
import {LocalStorageService} from '../../services/local-storage.service';
import {ConfirmDialogService} from '../../services/confirmation-dialog/confirmation-dialog.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-pro-upload-page',
  templateUrl: './pro-upload-page.component.html',
  styleUrls: ['./pro-upload-page.component.scss']
})
export class ProUploadPageComponent implements OnInit {

  link: string;

  @ViewChild('waveform') waveform: ElementRef;

  constructor(private uploader: Uploader,
  private localStorageService: LocalStorageService,
  private confirmDialogService: ConfirmDialogService,
  private router: Router,
  private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.uploader.fileUploader.onAfterAddingAll = (items) => {
      this.uploader.addTitles(items);
    }
    // if(this.uploader.fileUploader.isUploading) this.stage = this.statusEnum.UPLOADING_SONGS;
  }

  notes: string;
  email_to: string[];
  project_title: string="Random example";

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
    this.router.navigate(["../dashboard"], {relativeTo: this.activatedRoute});
    this.uploader.setStatus(Status.UPLOADING_SONGS);
    try {
      const projectResponse = await RestCall.createNewProject(this.project_title, this.smppw);
      let project_id = projectResponse["project_id"];

      await Utils.promiseSequential(
        this.uploader.fileUploader.queue.map(track => () => this.processTrack(project_id, track))
      );

      const shareResponse = await RestCall.shareProject(project_id, this.expiration, this.notes, "", this.email_to);

      // this.link.emit(shareResponse["project_hash"]);
      this.uploader.setStatus(Status.GREAT_SUCCESS);
      this.clearForm(true);

    } catch (e) {
      this.clearForm(false);
      this.error.emit(e);
    }
  }

  private async processTrack(projectId, track: FileItem): Promise<void> {

    const length = 0;
    const title = this.uploader.getTitle(track);
    const file_name = Utils.getName(track._file.name);
    const extension = Utils.getExtension(track._file.name);

    const trackResponse = await RestCall.createNewTrack(projectId, title);
    const trackId = trackResponse["track_id"];

    const versionResponse = await RestCall.createNewVersion(
      trackId, this.notes_element.nativeElement.value, this.availability ? "1" : "0"
    );
    const versionId = versionResponse["version_id"];

    const streamFileResponse = await RestCall.createNewFile(track._file, file_name, this.getStreamFileExtension(extension), track._file.size, versionId, 0, length);
    const streamFileId = streamFileResponse["file_id"];

    let downloadFileId: string;
    if (this.availability) {
      const downloadFileResponse = await RestCall.createNewFile(track._file, file_name, extension, track._file.size, versionId, 1, length);
      downloadFileId = downloadFileResponse["file_id"];
    } else {
      downloadFileId = "null";
    }

    const buffer: ArrayBuffer = await Utils.read(track._file);
    await RestCall.uploadChunk(buffer, streamFileId, downloadFileId, 0, extension, progress => this.setChunkProgress(progress));
  }

  private setProgress(progress: number) {
    this.uploader.fileUploader.progress = progress;
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
    this.setProgress(((100 * this.uploader.fileUploader.uploaded + progress) / this.uploader.fileUploader.queue.length));
  }

  expirations = [{id: '1week', label: 'Week', heading: 'Expire*'}, {id: '1month', label: 'Month', heading: 'Expire*'}];
  expiration="1week";

  availabilities = [{id: false, label: 'No', heading: 'Download*'}, {id: true, label: 'Yes', heading: 'Download*'}];
  availability=false;

  smppw_enable = [{id: false, label: 'No', heading: 'Password*'}, {id: true, label: 'Yes', heading: 'Password*'}];
  smppw;
  smppw_bool=false;

  stream_types = [{id: false, label: 'Lossy', heading: 'Stream*'}, {id: true, label: 'Lossless', heading: 'Stream*'}];
  stream_type=false;

  projects = [{id: '1', label: 'project1', heading: 'Project'}, {id: '2', label: 'project2', heading: 'Project'}, {
    id: '0',
    label: 'Project',
    heading: 'Project'
  }];

  project;

  private clearForm(clearData): void {
    if (clearData) {
      this.notes = '';
      this.email_to = [];
      this.project_title="";
      this.smppw="";
      this.uploader.reset();
    }
  }

  cancelUpload(dirty_form, file_nb) {
    if(dirty_form || file_nb>0){
      this.confirmDialogService.confirmThis("There are unsaved changes. Are sure you want to discard this project.", () => {
        // YES CLICKED
        this.clearForm(true)
        this.router.navigate(["../dashboard"], {relativeTo: this.activatedRoute});

      }, function () {
      })}
    else{
      this.router.navigate(["../dashboard"], {relativeTo: this.activatedRoute});
    }
  }
}
