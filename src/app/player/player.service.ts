import {EventEmitter, Injectable, Output} from "@angular/core";
import {Version} from "../model/version";
import {File} from "../model/file";
import {StateService} from "../services/state.service";

@Injectable({
  providedIn: 'root'
})
export class Player {

  version: Version;

  private media: HTMLMediaElement;

  private loading: Version;

  @Output() started = new EventEmitter();
  @Output() paused = new EventEmitter();
  @Output() progress = new EventEmitter();
  @Output() finished = new EventEmitter();

  constructor(
    private stateService: StateService
  ) {

    this.media = new Audio();
    this.getMedia().crossOrigin = 'anonymous';
    this.getMedia().preload = 'metadata';
    this.getMedia().addEventListener('ended', () => this.finished.emit(this.version));
    document.body.appendChild(this.getMedia());

    this.getMedia().addEventListener('play', e => this.started.emit(e));
    this.getMedia().addEventListener('pause', e => this.paused.emit(e));
    this.getMedia().addEventListener('timeupdate', () => this.emitProgress());
  }

  private getMedia() {
    return this.media;
  }

  setTitle(title: string) {
    this.getMedia().title = title;
  }

  public async load(version: Version) {
    return new Promise(async resolve => {
      if (!!this.version && this.version.version_id === version.version_id) {
        resolve();
        return;
      }

      // if (this.version){}
      //   await this.stop();

      this.version = version;
      const file: File = this.getStreamFile();

      this.getMedia().addEventListener('loadedmetadata', () => {
        this.setTitle("test");
      });

      this.getMedia().addEventListener('canplay', () => {
        resolve();
      });

      this.getMedia().src = file.aws_path + "." + file.extension;
      this.getMedia().load();
    })
  }

  async play(version?: Version, startTime?: number) {
    this.stateService.setSidebarPlayer('projects/' + this.stateService.getActiveProject().value.project_hash + '/track/' + this.stateService.getActiveTrack().value.track_id);
    this.loading = this.version;
    if (version) {
      await this.load(version);
    }

    if (!this.version) return;

    if (startTime >= 0) {
      await this.seekTo(version, startTime);
    }

    await this.getMedia().play();
    this.loading = null;
  }

  async seekTo(version: Version, progress: number) {
    await this.load(version);
    return new Promise(resolve => {
      this.getMedia().addEventListener('seeked', () => {
          resolve();
        },
        {once: true}
      );
      this.getMedia().currentTime = progress;
    });
  }

  pause() {
    this.getMedia() && this.getMedia().pause();
    this.stateService.setActiveComment(null);
  }

  async stop() {
    this.pause();
    await this.seekTo(this.version, 0);
  }

  isLoading(version: Version): boolean {
    return this.loading == version;
  }

  hasLoaded(version: Version): boolean {
    return !!version && !!this.version && version.version_id === this.version.version_id;
  }

  isPlaying(): boolean {
    return this.getMedia() && !this.getMedia().paused;
  }

  emitProgress() {
    this.progress.emit({
      version: this.version,
      currentTime: this.getCurrentTime()
    });
  }

  getCurrentTime() {
    return this.getMedia() && this.getMedia().currentTime;
  }

  getDuration() {
    return this.getMedia().duration;
  }

  private getStreamFile(): File {
    return this.version.files.filter(file => file.identifier == 0)[0];
  }
}
