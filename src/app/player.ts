import {RestCall} from "./rest/rest-call";
import {Comment} from "./model/comment";
import {EventEmitter, Output} from "@angular/core";
import {Drawer} from "./drawer";
import {Utils} from "./app.component";

export class Player {

  private context: string;
  private mediaSource: MediaSource;
  private sourceBuffer: SourceBuffer;
  private media: HTMLMediaElement;

  private startIndex: number;
  private endIndex: number;
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
    this.createMediaSource();
    this.setupProgress();
    this.redraw();
  }

  createMediaSource(): Promise<void> {

    return new Promise<void>(resolve => {
      this.mediaSource = new MediaSource();
      this.mediaSource.addEventListener('sourceopen', () => {
        this.sourceBuffer = this.mediaSource.addSourceBuffer('audio/mpeg');
        resolve();
      });
      this.context = window.URL.createObjectURL(this.mediaSource);

      this.createMedia();
      this.redraw();
    });
  }

  createMedia() {

    if (this.media) {
      document.body.removeChild(this.media);
    }

    this.media = document.createElement('audio');
    this.media.src = this.context;
    this.media.addEventListener('ended', () => this.finished.emit());

    document.body.appendChild(this.media);
  }

  setupProgress() {

    const onAudioProcess = () => {
      if (!this.isPlaying()) {
        return;
      }

      if (this.comment && this.comment.include_end && this.getCurrentTime() > this.comment.end_time) {
        if (this.comment.loop)
          this.play(this.comment);
        else {
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

  loop(): boolean {
    return this.comment && this.comment.loop;
  }

  loadAudio(startTime: number): Promise<any> {

    const startIndex = Math.floor(startTime / 10);

    if (startIndex >= this.startIndex && startIndex <= this.endIndex) {
      return Promise.resolve();
    }

    this.unloadAudio();
    return this.createMediaSource().then(() => this.loadChunks(startIndex));
  }

  loadChunks(startIndex: number) {

    const loadChunk = (index) => {
      RestCall.getChunk(this.awsPath, this.extension, index)
        .then(data => {
          appendChunk(data, index);
          this.endIndex = index;
        });
    };

    const appendChunk = (data: ArrayBuffer, index) => {

      const dataCopy = data.slice(0);

      // Parsing the gapless metadata is unfortunately non trivial and a bit
      // messy, so we'll glaze over it here.  See appendix b if you'd like more
      // details on how to extract this metadata.  ParseGaplessData() will return
      // a dictionary with three elements:
      //
      //    audioDuration: Duration in seconds of all non-padding audio.
      //    frontPaddingDuration: Duration in seconds of the front padding.
      //    endPaddingDuration: Duration in seconds of the end padding.
      //
      parseGaplessData(data)
        .then(gaplessMetadata => {

          // Each appended segment must be appended relative to the next.  To avoid
          // any overlaps we'll use the ending timestamp of the last append as the
          // starting point for our next append or zero if we haven't appended
          // anything yet.
          const appendTime = index > startIndex ?
            this.sourceBuffer.buffered.end(0) :
            10 * startIndex;

          // The timestampOffset field essentially tells MediaSource where in the
          // media timeline the data given to appendBuffer() should be placed.  I.e.
          // if the timestampOffset is 1 second, the appended data will start 1
          // second into playback.
          //
          // MediaSource requires that the media timeline starts from time zero, so
          // we need to ensure that the data left after filtering by the append
          // window starts at time zero.  We'll do this by shifting all of the
          // padding we want to discard before our append time.
          this.sourceBuffer.timestampOffset = appendTime - gaplessMetadata.frontPaddingDuration;

          // Simply put, an append window allows you to trim off audio (or video)
          // frames which fall outside of a specified window.  Here we'll use the
          // end of our last append as the start of our append window and the end of
          // the real audio data for this segment as the end of our append window.
          this.sourceBuffer.appendWindowStart = appendTime;
          this.sourceBuffer.appendWindowEnd = appendTime + gaplessMetadata.audioDuration;

          // When appendBuffer() completes it will fire an "updateend" event signaling
          // that it's okay to append another segment of media. Here we'll chain the
          // append for the next segment to the completion of our current append.
          if (index === startIndex) {
            this.sourceBuffer.addEventListener('updateend', () => {
              if (++index < segments) {
                loadChunk(index);
              } else {
                // We've loaded all available segments, so tell MediaSource there are
                // no more buffers which will be appended.
                this.mediaSource.endOfStream();
              }
            });
          }

          // appendBuffer() will now use the timestamp offset and append window
          // settings to filter and timestamp the data we're appending.
          this.sourceBuffer.appendBuffer(dataCopy);
        });
    };

    const parseGaplessData: (ArrayBuffer) => Promise<{audioDuration, frontPaddingDuration, endPaddingDuration}>
      = (arrayBuffer) => {
      // Gapless data is generally within the first 4096 bytes, so limit parsing.
      const byteStr = String.fromCharCode.apply(
        null, new Uint8Array(arrayBuffer.slice(0, 4096)));

      let frontPadding = 0;
      let endPadding = 0;
      let realSamples = 0;

      // iTunes encodes the gapless data as hex strings like so:
      //
      //    'iTunSMPB[ 26 bytes ]0000000 00000840 000001C0 0000000000046E00'
      //    'iTunSMPB[ 26 bytes ]####### frontpad  endpad    real samples'
      //
      // The approach here elides the complexity of actually parsing MP4 atoms. It
      // may not work for all files without some tweaks.
      const iTunesDataIndex = byteStr.indexOf('iTunSMPB');
      if (iTunesDataIndex !== -1) {
        const frontPaddingIndex = iTunesDataIndex + 34;
        frontPadding = parseInt(byteStr.substr(frontPaddingIndex, 8), 16);

        const endPaddingIndex = frontPaddingIndex + 9;
        endPadding = parseInt(byteStr.substr(endPaddingIndex, 8), 16);

        const sampleCountIndex = endPaddingIndex + 9;
        realSamples = parseInt(byteStr.substr(sampleCountIndex, 16), 16);
      }

      // Xing padding is encoded as 24bits within the header.  Note: This code will
      // only work for Layer3 Version 1 and Layer2 MP3 files with XING frame counts
      // and gapless information.  See the following documents for more details:
      // http://www.codeproject.com/Articles/8295/MPEG-Audio-Frame-Header (2.3.1)
      // http://gingko.homeip.net/docs/file_formats/dxhead.html (FRAMES_FLAG)
      let xingDataIndex = byteStr.indexOf('Xing');
      if (xingDataIndex === -1) {
        xingDataIndex = byteStr.indexOf('Info');
      }
      if (xingDataIndex !== -1) {

        const frameCountIndex = xingDataIndex + 8;
        const frameCount = readInt(byteStr.substr(frameCountIndex, 4));

        // For Layer3 Version 1 and Layer2 there are 1152 samples per frame.
        realSamples = frameCount * 1152;

        xingDataIndex = byteStr.indexOf('LAME');
        if (xingDataIndex === -1) {
          xingDataIndex = byteStr.indexOf('Lavf');
        }
        if (xingDataIndex !== -1) {
          const gaplessDataIndex = xingDataIndex + 21;
          const gaplessBits = readInt(byteStr.substr(gaplessDataIndex, 3));

          // Upper 12 bits are the front padding, lower are the end padding.
          frontPadding = gaplessBits >> 12;
          endPadding = gaplessBits & 0xFFF;
        }

        realSamples -= frontPadding + endPadding;
      }

      if (realSamples != 0) {
        return Promise.resolve({
          audioDuration: realSamples * SECONDS_PER_SAMPLE,
          frontPaddingDuration: frontPadding * SECONDS_PER_SAMPLE,
          endPaddingDuration: endPadding * SECONDS_PER_SAMPLE
        });
      } else {
        return new Promise(resolve =>
          new AudioContext().decodeAudioData(arrayBuffer).then(
            audio => resolve({
              audioDuration: audio.duration,
              frontPaddingDuration: 0,
              endPaddingDuration: 0
            })
          )
        );
      }
    };

    // Since most MP3 encoders store the gapless metadata in binary, we'll need a
    // method for turning bytes into integers.  Note: This doesn't work for values
    // larger than 2^30 since we'll overflow the signed integer type when shifting.
    const readInt = (buffer) => {
      let result = buffer.charCodeAt(0);
      for (let i = 1; i < buffer.length; ++i) {
        result <<= 8;
        result += buffer.charCodeAt(i);
      }
      return result;
    };

    // Hard coded sample rate for test data; this could be parsed from the container
    // instead, but for the sake of focus I've hard coded it.
    const SECONDS_PER_SAMPLE = 1 / 44100.0;

    const segments = Math.ceil(this.getDuration() / 10);

    this.startIndex = startIndex;
    let prevXingDataIndex;

    loadChunk(startIndex);
  }

  unloadAudio() {
    delete this.startIndex;
    window.URL.revokeObjectURL(this.context);
    this.mediaSource = null;
  }

  play(comment?: Comment) {

    this.setComment(comment);

    this.playFromStart(comment ? comment.start_time : this.getCurrentTime());
  }

  playFromStart(startTime?: number) {

    if (!startTime) startTime = 0;

    this.seekTo(startTime)
      .then(() => {
        this.media.play();
        this.playing.emit();
      });
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

  seekTo(progress: number): Promise<void> {

    return this.loadAudio(progress).then(() => {
      this.media.currentTime = progress;
      this.drawers.forEach(drawer => drawer.progress(progress / this.getDuration(), 0));
    });
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
      this.seekTo(progress * this.getDuration()).then(() => {
        if (isPlaying) this.play();
      });
    });
  }

  redraw() {
    this.drawers.forEach(drawer => drawer.drawBuffer());
  }
}
