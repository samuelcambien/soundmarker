import {EventEmitter, Injectable, Output} from "@angular/core";
import {Version} from "./model/version";
import {File} from "./model/file";
import {StateService} from "./services/state.service";
import {Track} from "./model/track";

@Injectable({
  providedIn: 'root'
})
export class Player {

  get version(): Version {
    return this._version;
  }

  private media: HTMLMediaElement;

  private _version: Version;

  @Output() playing = new EventEmitter();
  @Output() progress = new EventEmitter();
  @Output() finished = new EventEmitter();

  constructor(
    private stateService: StateService
  ) {
    this.setupProgress();
  }

  setupProgress() {

    const onAudioProcess = async () => {

      if (!this.isPlaying()) {
        return;
      }

      let comment = this.stateService.getActiveComment().getValue();
      if (comment && comment.include_end && this.getCurrentTime() > comment.end_time) {
        if (comment.loop) {
          await this.play(this.version, comment.start_time);
        } else {
          this.pause();
          await this.seekTo(this.version, comment.start_time);
        }
      }

      this.emitProgress();

      // Call again in the next frame
      const requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame;
      requestAnimationFrame(onAudioProcess);
    };

    this.playing.subscribe(() => onAudioProcess());
  }

  private createMedia() {

    this.media = new Audio();
    this.getMedia().crossOrigin = 'anonymous';
    this.getMedia().preload = 'metadata';
    this.getMedia().addEventListener('ended', () => this.finished.emit(this.version));
    document.body.appendChild(this.getMedia());

    const context = new ((<any>window).AudioContext || (<any>window).webkitAudioContext)();
    const analyser = context.createAnalyser();

    const source = context.createMediaElementSource(this.getMedia());
    source.connect(analyser);
    analyser.connect(context.destination);
  }

  private getMedia() {
    return this.media;
  }

  setTitle(title: string) {
    this.getMedia().title = title;
  }

  async load(version: Version) {

    if (!this.media) this.createMedia();

    return new Promise(async resolve  => {
      if (this._version !== version) {
        if (this.version)
          await this.stop();
        this._version = version;
        const file: File = Player.getStreamFile(this.version);
        this.getMedia().src = file.aws_path + "." + file.extension;
        this.getMedia().addEventListener('loadedmetadata', () => {
          this.setTitle(this.getTrack().title);
          resolve();
        });
      } else {
        resolve();
      }
    })
  }

  async play(version: Version, startTime?: number) {

    if (startTime >= 0) {
      await this.seekTo(version, startTime);
    } else {
      await this.load(version);
    }

    await this.getMedia().play();
    this.playing.emit();
  }

  async playFromStart(version: Version) {
    await this.play(version, 0);
  }

  async seekTo(version: Version, progress: number) {

    await this.load(version);
    this.getMedia().currentTime = progress;
    this.emitProgress();
  }

  pause() {
    this.getMedia() && this.getMedia().pause();
    this.stateService.setActiveComment(null);
  }

  private async stop() {
    this.pause();
    await this.seekTo(this.version, 0);
  }

  isPlaying() {
    return this.getMedia() && !this.getMedia().paused;
  }

  emitProgress() {
    this.progress.emit({
      version: this.version,
      currentTime: this.getCurrentTime()
    })
  }

  getCurrentTime() {
    return this.getMedia() && this.getMedia().currentTime;
  }

  getDuration() {
    return this.getMedia().duration;
  }

  getTrack(): Track {

    return this.stateService.getActiveProject().tracks
      .filter(track =>
        track.versions
          .filter(version => version.version_id == this.version.version_id)
          .length > 0
      )[0];
  }

  public static getStreamFile(version: Version): File {
    return version.files.filter(file => file.identifier == 0)[0];
  }
}
