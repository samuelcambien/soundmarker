import {RestCall} from "./rest/rest-call";
import * as player from "./player/dist/player";
import {Comment} from "./model/comment";
import {ProjectService} from "./services/project.service";
import {EventEmitter, Output} from "@angular/core";

export class Player {

  private container: HTMLElement;
  private player;
  private peaks: number[];
  private duration: number;
  private awsPath: string;
  private extension: string;
  private context: string;
  private mediaSource: MediaSource;
  private sourceBuffer: SourceBuffer;
  private startIndex: number;

  private comment: Comment;

  @Output() playing = new EventEmitter();
  @Output() finished = new EventEmitter();

  constructor(container: string, peaks: number[], duration: number, awsPath: string, extension: string) {

    const waveformContainer = document.getElementById(container);
    this.container = waveformContainer;

    this.player = player.create({
      container: waveformContainer,
      backend: 'AudioElement',
      dragSelection: false,
      scrollParent: false,
      peaks: peaks,
      duration: duration,
      cursorColor: '#bac1da',
      progressColor: '#b9caff',
      waveColor: '#eef1ff',
    });

    this.player.on('load', () => this.play());
    this.player.on('pause', () => {
      if (this.getComment()) if (this.getComment().loop) {
        this.play(this.getComment());
      } else {
        this.seekTo(this.getComment().start_time);
        this.comment = null;
      }
    });
    this.player.on('finish', () => {
      this.finished.emit();
    });

    this.peaks = peaks;
    this.duration = duration;
    this.awsPath = awsPath;
    this.extension = extension;

    this.createMediaSource();
  }

  createMediaSource(): Promise<void> {

    return new Promise<void>(resolve => {
      this.mediaSource = new MediaSource();
      this.mediaSource.addEventListener('sourceopen', () => {
        this.sourceBuffer = this.mediaSource.addSourceBuffer('audio/mpeg');
        resolve();
      });
      this.context = window.URL.createObjectURL(this.mediaSource);

      const currentTime = this.getCurrentTime();
      this.player.load(this.context, this.peaks);
      this.player.seekTo(currentTime / this.getDuration());

      this.redraw();
    });
  }

  loadAudio(): Promise<any> {

    const startIndex = Math.floor(this.player.getCurrentTime() / 10);

    if (startIndex >= this.startIndex) {
      return Promise.resolve();
    }

    this.unloadAudio();
    return this.createMediaSource().then(() => this.loadChunks(startIndex));
  }

  loadChunks(startIndex: number) {

    // Hard coded sample rate for test data; this could be parsed from the container
    // instead, but for the sake of focus I've hard coded it.
    const SECONDS_PER_SAMPLE = 1 / 44100.0;

    const player = this.player;
    const awsPath = this.awsPath;
    const extension = this.extension;
    const segments = Math.ceil(player.getDuration() / 10);

    const mediaSource = this.mediaSource;
    const sourceBuffer = this.sourceBuffer;

    this.startIndex = startIndex;
    loadChunk(startIndex);

    function loadChunk(index) {
      RestCall.getChunk(awsPath, extension, index)
        .then(data => appendChunk(data, index));
    }

    function appendChunk(data, index) {

      // Parsing the gapless metadata is unfortunately non trivial and a bit
      // messy, so we'll glaze over it here.  See appendix b if you'd like more
      // details on how to extract this metadata.  ParseGaplessData() will return
      // a dictionary with three elements:
      //
      //    audioDuration: Duration in seconds of all non-padding audio.
      //    frontPaddingDuration: Duration in seconds of the front padding.
      //    endPaddingDuration: Duration in seconds of the end padding.
      //
      const gaplessMetadata = parseGaplessData(data);

      // Each appended segment must be appended relative to the next.  To avoid
      // any overlaps we'll use the ending timestamp of the last append as the
      // starting point for our next append or zero if we haven't appended
      // anything yet.
      const appendTime = index > startIndex ?
        sourceBuffer.buffered.end(0) :
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
      sourceBuffer.timestampOffset = appendTime - gaplessMetadata.frontPaddingDuration;

      // Simply put, an append window allows you to trim off audio (or video)
      // frames which fall outside of a specified window.  Here we'll use the
      // end of our last append as the start of our append window and the end of
      // the real audio data for this segment as the end of our append window.
      sourceBuffer.appendWindowStart = appendTime;
      sourceBuffer.appendWindowEnd = appendTime + gaplessMetadata.audioDuration;

      // When appendBuffer() completes it will fire an "updateend" event signaling
      // that it's okay to append another segment of media. Here we'll chain the
      // append for the next segment to the completion of our current append.
      if (index === startIndex) {
        sourceBuffer.addEventListener('updateend', function () {
          if (++index < segments) {
            loadChunk(index);
          } else {
            // We've loaded all available segments, so tell MediaSource there are
            // no more buffers which will be appended.
            mediaSource.endOfStream();
            // player.duration = sourceBuffer.buffered.end(0);
          }
        });
      }

      // mediaSource.addEventListener()

      // appendBuffer() will now use the timestamp offset and append window
      // settings to filter and timestamp the data we're appending.
      sourceBuffer.appendBuffer(data);
    }

    function parseGaplessData(arrayBuffer) {
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

      return {
        audioDuration: realSamples * SECONDS_PER_SAMPLE,
        frontPaddingDuration: frontPadding * SECONDS_PER_SAMPLE,
        endPaddingDuration: endPadding * SECONDS_PER_SAMPLE
      };
    }

    // Since most MP3 encoders store the gapless metadata in binary, we'll need a
    // method for turning bytes into integers.  Note: This doesn't work for values
    // larger than 2^30 since we'll overflow the signed integer type when shifting.
    function readInt(buffer) {
      let result = buffer.charCodeAt(0);
      for (let i = 1; i < buffer.length; ++i) {
        result <<= 8;
        result += buffer.charCodeAt(i);
      }
      return result;
    }
  }

  unloadAudio() {
    delete this.startIndex;
    window.URL.revokeObjectURL(this.context);
    this.mediaSource = null;
    this.player.empty();
  }

  play(comment?: Comment) {

    this.playing.emit();

    if (comment) {
      this.seekTo(comment.start_time);
    }

    this.loadAudio().then(() => {

      this.comment = comment;

      if (!comment) {
        this.player.play();
      } else if (!comment.include_end) {
        this.player.play(comment.start_time);
      } else {
        this.player.play(comment.start_time, comment.end_time);
      }
    });
  }

  getComment() {
    return this.comment;
  }

  seekTo(time: number) {
    this.player.seekTo(time / this.getDuration());
  }

  pause() {
    this.comment = null;
    this.player.pause();
  }

  stop() {
    this.player.stop();
    this.unloadAudio();
  }

  isPlaying() {
    return this.player.isPlaying();
  }

  getCurrentTime() {
    return this.player.getCurrentTime();
  }

  getDuration() {
    return this.player.getDuration();
  }

  redraw() {
    this.player.drawBuffer();
    this.player.drawer.progress(this.player.backend.getPlayedPercents(), this.player.getProgressStart());
  }
}
