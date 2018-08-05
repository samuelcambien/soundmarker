import * as lamejs from "lamejs";
// import * as flac from "node-flac";
// import * as wav from "node-wav";
// import * as AV from 'av';
// import * as decode from 'audio-decode';
// import * as lena from 'audio-lena/flac';
import * as flac from 'flac.js';

import audiofile, {default as AudioFile} from 'audiofile';

import WaveFile from "wavefile";

declare var require;

export class Mp3Encoder {

  static kbps = 192;
  static sampleBlockSize = 1152;

  static convertFlacDuplicate(buffer: ArrayBuffer, name: String): File {

    let decode = require('audio-decode');
    let flac = require('audio-lena/flac');
    let audio = buffer;

    let encoded;

    console.log(audio);
    decode(audio, (err, buf) => {
      console.log("buf.length");
      console.log(buf.length);

      encoded = buf;
    });

    return new File([encoded], "test.mp3");
  }

  static encodeMp3(buffer: ArrayBuffer, name: String): File {

    let header = lamejs.WavHeader.readHeader(new DataView(buffer));

    let srcData = header ?
      new Int16Array(buffer, header.dataOffset, header.dataLen / 2) :
      new Int16Array(buffer);

    let sampleRate = header ? header.sampleRate : 44100;
    let channels = header ? header.channels : 2;

    let mp3Data;
    switch (channels) {
      case 1:
        mp3Data = this.encodeMp3Mono(srcData, sampleRate);
        break;
      case 2:
      default:
        mp3Data = this.encodeMp3Stereo(srcData, sampleRate);
        break;
    }

    return new File(
      [new Blob(mp3Data, {type: 'audio/mp3'})],
      this.getName(name) + " converted.mp3"
    );
  }

  static encodeMp3Mono(data, sampleRate: number) {

    let i, mp3Data = [], mp3buf = [];

    let mp3Encoder = new lamejs.Mp3Encoder(1, sampleRate, this.kbps);
    for (i = 0; i < data.length; i += this.sampleBlockSize) {
      let buffer = data.subarray(i, i + this.sampleBlockSize);
      mp3buf = mp3Encoder.encodeBuffer(buffer);
      if (mp3buf.length > 0) {
        mp3Data.push(mp3buf);
      }
    }

    mp3buf = mp3Encoder.flush();
    if (mp3buf.length > 0) {
      mp3Data.push(mp3buf);
    }

    return mp3Data;
  }

  static encodeMp3Stereo(data, sampleRate: number) {

    let i, leftArray = [], rightArray = [];

    for (i = 0; i < data.length; i += 2) {
      leftArray.push(data[i]);
      rightArray.push(data[i + 1]);
    }

    let left = new Int16Array(leftArray), right = new Int16Array(rightArray);

    let mp3Encoder = new lamejs.Mp3Encoder(2, sampleRate, this.kbps),
      mp3buf = [],
      mp3Data = [];

    for (i = 0; i < left.length; i += this.sampleBlockSize) {

      let leftChunk = left.subarray(i, i + this.sampleBlockSize);
      let rightChunk = right.subarray(i, i + this.sampleBlockSize);
      mp3buf = mp3Encoder.encodeBuffer(leftChunk, rightChunk);
      if (mp3buf.length > 0) {
        mp3Data.push(mp3buf);
      }
    }
    mp3buf = mp3Encoder.flush();

    if (mp3buf.length > 0) {
      mp3Data.push(mp3buf);
    }

    return mp3Data;
  }

  public static convertFile(file: File, converter: Function) {
    let reader: FileReader = new FileReader();
    reader.onload = () => converter(reader.result);
    reader.readAsArrayBuffer(file);
  }

  static getName(name: String): String {

    return name.split(/(.*)\.(.*)/)[1];
  }

  static getExtension(name: String): String {

    return name.split(/(.*)\.(.*)/)[2];
  }

  public static convertWav16bit(file: File, callback: Function) {
    Mp3Encoder.convertFile(file, (buffer: ArrayBuffer) =>
      callback(
        Mp3Encoder.encodeMp3(buffer, file.name)
      )
    );
  }

  public static convertWavOther(file: File, callback: Function) {
    Mp3Encoder.convertFile(file, (buffer: ArrayBuffer) => {
      let wav = new WaveFile();
      wav.fromBuffer(new Uint8Array(buffer));
      wav.toBitDepth('16', false);
      Mp3Encoder.convertWav16bit(new File([
        wav.toBuffer()
      ], file.name), callback);
    });
  }

  public static convertFlac(file: File, callback: Function) {
    Mp3Encoder.convertFile(file, (buffer: ArrayBuffer) =>
      require("audio-decode")(buffer, (err, buf: AudioBuffer) =>
        Mp3Encoder.convertWavOther(new File([
          require('audiobuffer-to-wav')(buf)
        ], file.name), callback)
      )
    );
  }

  public static convertAlac(file: File, callback: Function) {
    Mp3Encoder.convertFile(file, (buffer: ArrayBuffer) => {
        // require("av");
        require("alac");
        // new AudioContext().decodeAudioData(buffer, (buf) => {
        require("audio-decode")(buffer, (err, buf: AudioBuffer) => {
            try {
              Mp3Encoder.convertWavOther(new File([
                require('audiobuffer-to-wav')(buf)
              ], file.name), callback)
            } catch (e) {
              console.log(e);
            }
          }
        )
      }
    );
  }

  public static convertAiff(file: File, callback: Function) {

    // Mp3Encoder.convertFile(file, (buffer: ArrayBuffer) => {
    //
    //   let af = new AudioFile();
    //
    //   require('flac.js');
    //
    //
    //   // af.load();
    //
    //   // console.log(audio);
    //   console.log(audiofile);
    //   // console.log(af);
    //
    //   // let streamBuffer = require('stream-array-buffer')({size: this.sampleBlockSize});
    //   //
    //   // // streamBuffer.toStream()
    //   //
    //   // let Alac2Pcm = require('alac2pcm');
    //   //
    //   // let out = new ArrayBuffer(0);
    //
    //   // buffer.pipe(new Alac2Pcm({bitdepth: 16}))
    //
    //   // Mp3Encoder.convertWav16bit(new File([
    //   //     []
    //   //   ])
    //   // )
    //
    // })

    Mp3Encoder.convertFile(file, (buffer: ArrayBuffer) => {

      let af = new AudioFile();


      // require('alac');

      // require("audio-decode")(file, (err, buf: AudioBuffer) => {
      //   Mp3Encoder.convertWavOther(new File([require('audiobuffer-to-wav')(buf)], file.name), callback)
      // });

      let streamBuffer = require('stream-array-buffer')({size: this.sampleBlockSize});

      let stream = streamBuffer.toStream();

      // let Alac2Pcm = require('alac2pcm');

      let out = new ArrayBuffer(0);

      // stream.pipe(new Alac2Pcm({bitdepth: 16}))

      // Mp3Encoder.convertWav16bit(new File([
      //     []
      //   ])
      // )

    })
  }

  //
  //
  //   // try {
  //   //   require("audio-play")(buf, {end: 2}, () => console.log("great success"));
  //   // } catch (e) {
  //   //   throw e;
  //   // }
  //   //
  //   // let buffer = [];
  //   // for (let i = 0; i < buf.length; i++) {
  //   //   buffer.push(buf.getChannelData(0)[i]);
  //   //   buffer.push(buf.getChannelData(1)[i]);
  //   // }
  //
  //   // encode AudioBuffer to WAV
  //   let wav = toWav(buf);
  //
  //   Mp3Encoder.convertWavOther(new File([wav], file.name), callback);
  //
  //   // do something with the WAV ArrayBuffer ...
  // });

  // private wav16bitConverter: FileConverter = new class extends FileConverter {
  //   public convertBuffer(buffer: ArrayBuffer): File {
  //     return Mp3Encoder.encodeMp3(buffer, name);
  //   }
  // };
  //
  // private wavOtherConverter: FileConverter = new class extends FileConverter {
  //   public convertBuffer(buffer: ArrayBuffer, name: String): File {
  //     return wav16bitConverter(buffer, )
  //   }
  // }
}