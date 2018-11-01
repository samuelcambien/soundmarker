import {now} from "moment";

export class Player {

  constructor(private track_url: string, private duration: number) {
    this.audioContext = new AudioContext();
    this.audioContext.suspend();
    this.loadBuffers(0, 1);
  }

  private static buffer_count: number = 6;
  private static buffer_length: number = 10;

  private static getIndex(time: number): number {
    return Math.floor(time / Player.buffer_length);
  }

  private static getOffset(time: number): number {
    return time % Player.buffer_length;
  }

  private static copy(src: ArrayBuffer): ArrayBuffer {
    var dst = new ArrayBuffer(src.byteLength);
    new Uint8Array(dst).set(new Uint8Array(src));
    return dst;
  }

  private audioContext: AudioContext;
  private audioBuffers: ArrayBuffer[] = [];
  private audioSources: AudioBufferSourceNode[] = [];
  private maxIndex: number = Player.getIndex(this.duration);

  private startTime: number = 0;
  private currentIndex: number = 0;
  private currentSource: AudioBufferSourceNode;
  private playID: number;

  loadBuffers(start: number, end?: number, callback?: Function) {

    for (let index = start; index < (end ? end : start + Player.buffer_count) && index <= this.maxIndex; index++) {
      if (!this.audioSources[index]) {
        this.loadBuffer(index, () => {
          if (index == start && callback) callback()
        });
      } else if (index == start && callback) callback()
    }
  }

  private loadBuffer(index: number, callback?: Function) {

    let my = this;

    fetch(this.track_url + index.toString() + ".mp3")
      .then(response => {

        let array: Uint8Array = new Uint8Array();
        my.readResponse(response.body.getReader(), array, 0, (completeArray) => {
          my.audioBuffers[index] = Player.copy(completeArray.buffer);
          my.decodeBuffer(index, completeArray.buffer, callback);
        });
      });
  }

  private readResponse(reader: ReadableStreamReader, array: Uint8Array, index, callback: Function) {
    reader.read().then(({value, done}) => {
      if (!done) {
        let extendedArray = new Uint8Array(array.length + value.length);
        extendedArray.set(array);
        extendedArray.set(value, array.length);
        index++;
        this.readResponse(reader, extendedArray, index, callback);
      } else {
        callback(array);
      }
    });
  }

  private decodeBuffer(index: number, arrayBuffer: ArrayBuffer, callback?) {
    this.audioBuffers[index] = Player.copy(arrayBuffer);
    this.audioContext.decodeAudioData(arrayBuffer, (audioBuffer: AudioBuffer) => {
      let audioSource: AudioBufferSourceNode = this.audioContext.createBufferSource();
      audioSource.connect(this.audioContext.destination);
      audioSource.buffer = audioBuffer;
      this.audioSources[index] = audioSource;
      if (callback) callback();
    });
  }

  private stop(callback?: Function) {
    if (this.currentSource) {
      this.playID = null;
      this.currentSource.stop();
      this.currentSource = null;
      this.decodeBuffer(this.currentIndex, this.audioBuffers[this.currentIndex], callback);
    } else {
      callback();
    }
  }

  private playBuffer(index: number, offset: number) {

    let my = this;

    my.currentSource = my.audioSources[index];
    my.currentIndex = index;

    my.currentSource.start(0, offset);

    let playID = this.playID = now();
    this.currentSource.onended = () => {
      if (my.playID == playID) {
        if (index + 1 <= this.maxIndex) {
          my.playBuffer(index + 1, 0);
          my.loadBuffers(index + 1);
        } else {
          my.audioContext.suspend().then(() => {
            this.currentSource = null;
            this.startTime = 0;
          });
        }
        my.decodeBuffer(index, this.audioBuffers[index]);
      }
    };
  }

  private playFromStartTime() {
    this.playBuffer(Player.getIndex(this.startTime), Player.getOffset(this.startTime));
  }






  isPlaying() {
    return this.audioContext.state == "running";
  }

  play() {
    this.audioContext.resume().then(() => {
      if (!this.currentSource) {
        this.loadBuffers(0, Player.buffer_count, () => {
          this.playFromStartTime();
        })
      }
    });
  }

  pause() {
    this.audioContext.suspend().then(() => {
    });
  }

  getCurrentPosition(): number {
    return this.audioContext.currentTime;
  }

  getDuration(): number {
    return this.duration;
  }

  seekTo(time: number, callback?) {
    this.stop(() => {
      this.startTime = time;
      this.loadBuffers(Player.getIndex(time), Player.buffer_count, () => {
        if (callback) callback();
      });
    });
  }
}

export class Playback {

  private start: number;
  private end: number;

  play() {

  }
}
