import * as lamejs from "lamejs";


import WaveFile from "wavefile";
// import * as flac from "node-flac";
// import * as wav from "node-wav";
// import * as AV from 'av';
// import * as decode from 'audio-decode';
// import * as lena from 'audio-lena/flac';
// import * as flac from 'flac.js';

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

  static encodeMp3(buffer: ArrayBuffer, name: string): Promise<File> {

    return new Promise<File>(resolve => {

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

      return mp3Data
        .then(mp3Data => resolve(new File(
          [new Blob(mp3Data, {type: 'audio/mp3'})],
          this.getName(name) + " converted.mp3"
          ))
        );
    });
  }

  static encodeMp3Mono(data, sampleRate: number): Promise<any> {

    return new Promise<any>(resolve => {

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

      resolve(mp3Data);
    });
  }

  static encodeMp3Stereo(data, sampleRate: number): Promise<any> {

    return new Promise<any>(resolve => {

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

      resolve(mp3Data);
    });
  }

  public static read(file: File): Promise<ArrayBuffer> {
    return new Promise<any>(resolve => {
      let reader: FileReader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsArrayBuffer(file);
    })
  }

  static getName(name: string): string {

    return name.split(/(.*)\.(.*)/)[1];
  }

  static getExtension(name: string): string {

    return name.split(/(.*)\.(.*)/)[2];
  }

  public static convertWav16bit(buffer: ArrayBuffer, name: string): Promise<any> {

    return Mp3Encoder.encodeMp3(buffer, name);
  }

  public static convertWavOther(buffer: ArrayBuffer, name: string): Promise<any> {

    let wav = new WaveFile();
    wav.fromBuffer(new Uint8Array(buffer));
    wav.toBitDepth('16', false);

    return Mp3Encoder.read(new File([wav.toBuffer()], name))
      .then(buffer => Mp3Encoder.convertWav16bit(buffer, name));
  }

  public static convertFlac(buffer: ArrayBuffer, name: string): Promise<any> {

    return Mp3Encoder.decode(buffer)
      .then((buf: AudioBuffer) =>
        Mp3Encoder.read(
          new File([require('audiobuffer-to-wav')(buf)], name)
        )
      ).then(buffer => Mp3Encoder.convertWavOther(buffer, name));
  }

  public static decode(buffer: ArrayBuffer): Promise<any> {
    return require("audio-decode")(buffer);
  }

  public static convertAlac(file: File, callback: Function) {

    // require('./node_modules/aurora.js');

    // require("./node_modules/aac.js");

    // require("./flac.js");
    // require("./index.js");
    // var AV = require('av');
    // require('mp3');

    // Mp3Encoder.read(file, (buffer: ArrayBuffer) =>
    //   require("audio-decode")(buffer, (buf: AudioBuffer) => {
    //     require("alac");
    //     Mp3Encoder.convertWavOther(new File([
    //       require('audiobuffer-to-wav')(buf)
    //     ], file.name), callback)
    //   })
    // );

    // console.log(
    //   require("src/app/mp3-encoder/alac")
    // );
    // new AV.Demuxer().decode();

    // Mp3Encoder.read(file, (buffer: ArrayBuffer) => {
    //     // require("av");
    //     // new AudioContext().decodeAudioData(buffer, (buf) => {
    //     require("audio-decode")(buffer, (err, buf: AudioBuffer) => {
    //         try {
    //           Mp3Encoder.convertWavOther(new File([
    //             require('audiobuffer-to-wav')(buf)
    //           ], file.name), callback)
    //         } catch (e) {
    //           console.log(e);
    //         }
    //       }
    //     )
    //   }
    // );
  }

  public static convertAiff(file: File) {


    Mp3Encoder.read(file);

  }


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

// Mp3Encoder.read(file, (buffer: ArrayBuffer) => {
//
//   require("audiofile");
//
//   // require('alac');
//
//   // require("audio-decode")(file, (err, buf: AudioBuffer) => {
//   //   Mp3Encoder.convertWavOther(new File([require('audiobuffer-to-wav')(buf)], file.name), callback)
//   // });
//
//   let streamBuffer = require('stream-array-buffer')({size: this.sampleBlockSize});
//
//   let stream = streamBuffer.toStream();
//
//   // let Alac2Pcm = require('alac2pcm');
//
//   let out = new ArrayBuffer(0);
//
//   // stream.pipe(new Alac2Pcm({bitdepth: 16}))
//
//   // Mp3Encoder.convertWav16bit(new File([
//   //     []
//   //   ])
//   // )
//
// })
// }

//
//
//   // try {
//   //   require("audio-play")(buf, {end_time: 2}, () => console.log("great success"));
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
