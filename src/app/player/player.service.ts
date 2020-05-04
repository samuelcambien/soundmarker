import {EventEmitter, Injectable, Output} from "@angular/core";
import {Version} from "../model/version";
import {File} from "../model/file";
import {StateService} from "../services/state.service";
import {Track} from "../model/track";

@Injectable({
  providedIn: 'root'
})
export class Player {

  get version(): Version {
    return this.audioSource && this.audioSource.version;
  }

  get track(): Track {
    return this.audioSource && this.audioSource.track;
  }

  get audioSource(): AudioSource {
    return this._audioSource;
  }

  private media: HTMLMediaElement;

  private _audioSource: AudioSource;

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

  private async load(audioSource: AudioSource) {

    return new Promise(async resolve => {
      if (this.audioSource && this.audioSource.version.version_id === audioSource.version.version_id) {
        resolve();
        return;
      }

      if (this.audioSource)
        await this.stop();

      this._audioSource = audioSource;
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

  async play(audioSource?: AudioSource, startTime?: number) {

    this.loading = this.version;
    if (audioSource) {
      await this.load(audioSource);
    }

    if (!this.audioSource) return;

    if (startTime >= 0) {
      await this.seekTo(audioSource, startTime);
    }

    await this.getMedia().play();
    this.loading = null;
  }

  async seekTo(audioSource: AudioSource, progress: number) {
    await this.load(audioSource);
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
    await this.seekTo(this.audioSource, 0);
  }

  isLoading(version: Version) {
    return this.loading == version;
  }

  isPlaying() {
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
    console.log(this.version);
    return this.version.files.filter(file => file.identifier == 0)[0];
  }
}

export interface AudioSource {
  track: Track,
  version: Version,
  file?: File,
}
