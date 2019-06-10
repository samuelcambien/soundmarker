import {Comment} from "./model/comment";
import {EventEmitter, Output} from "@angular/core";
import {Drawer} from "./drawer";

export class Player {

  private media: HTMLMediaElement;
  private comment: Comment;
  private drawers: Drawer[] = [];

  @Output() playing = new EventEmitter();
  @Output() finished = new EventEmitter();

  constructor(
    private peaks: number[],
    private duration: number,
    private awsPath: string,
    private extension: string
  ) {
    this.initialize();
  }

  initialize() {
    this.createMedia();
    this.setupProgress();
    this.redraw();
  }

  createMedia() {

    this.media = new Audio(this.awsPath + "." + this.extension);
    this.media.crossOrigin = 'anonymous';
    this.media.preload = 'metadata';
    this.media.addEventListener('ended', () => this.finished.emit());
    document.body.appendChild(this.media);

    const context = new ((<any>window).AudioContext || (<any>window).webkitAudioContext)();
    const analyser = context.createAnalyser();

    window.addEventListener('load', () => {
      const source = context.createMediaElementSource(this.media);
      source.connect(analyser);
      analyser.connect(context.destination);
    }, false);
  }

  setupProgress() {

    const onAudioProcess = () => {
      if (!this.isPlaying()) {
        return;
      }

      if (this.comment && this.comment.include_end && this.getCurrentTime() > this.comment.end_time) {
        if (this.comment.loop) {
          this.play(this.comment);
        } else {
          this.seekTo(this.comment.start_time);
          this.pause();
        }
      }

      this.drawers.forEach(drawer => drawer.progress(this.getCurrentTime() / this.getDuration()));

      // Call again in the next frame
      const requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame;
      requestAnimationFrame(onAudioProcess);
    };

    this.playing.subscribe(() => onAudioProcess());
  }

  unloadAudio() {
    this.seekTo(0);
    this.media = null;
  }

  play(comment?: Comment) {

    this.setComment(comment);
    this.playFromStart(comment ? comment.start_time : this.getCurrentTime());
  }

  playFromStart(startTime?: number) {

    if (!startTime) startTime = 0;

    this.seekTo(startTime);
    this.media.play();
    this.playing.emit();
  }

  getComment() {
    return this.comment;
  }

  setComment(comment: Comment) {
    this.comment = comment;
    this.drawers.forEach(drawer => {
      if (comment && comment.include_end) {
        drawer.highlightComment(
          comment.start_time / this.getDuration(),
          comment.end_time / this.getDuration()
        );
      } else {
        drawer.highlightComment(0, 0);
      }
    });
  }

  seekTo(progress: number) {

    if (!this.media) this.createMedia();
    this.media.currentTime = progress;
    this.drawers.forEach(drawer => drawer.progress(progress / this.getDuration(), 0));
  }

  pause() {
    this.setComment(null);
    this.media && this.media.pause();
  }

  stop() {
    this.pause();
    this.unloadAudio();
  }

  isPlaying() {
    return this.media && !this.media.paused;
  }

  getCurrentTime() {
    return this.media && this.media.currentTime;
  }

  getDuration() {
    return this.duration;
  }

  addWaveform(div: HTMLElement) {
    this.createDrawer(div);
  }

  private createDrawer(div: HTMLElement) {

    const drawer = new Drawer(
      div,
      {
        height: 128,
        duration: this.duration,
        peaks: this.peaks,
        pixelRatio: 2,
        minPxPerSec: 20,
        cursorColor: '#bac1da',
        progressColor: '#b9caff',
        waveColor: '#eef1ff',
      }
    );
    this.drawers.push(drawer);

    drawer.seek.subscribe(progress => {
      this.setComment(null);
      const isPlaying = this.isPlaying();
      this.seekTo(progress * this.getDuration());
      if (isPlaying) this.play();
    });
  }

  redraw() {
    this.drawers.forEach(drawer => drawer.drawBuffer());
  }
}
