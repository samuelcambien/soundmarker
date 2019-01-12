export class SoundCloudWaveform {

  canvas;
  context;
  canvas_width = 700;
  canvas_height = 40;
  bar_width = 1;
  bar_gap = 0.1;
  wave_color = "#ccd9fc";
  download = false;
  onComplete;

  audioContext = new AudioContext();

  generate(buffer, options) {

    // preparing canvas
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');

    this.canvas.width = (options.canvas_width !== undefined) ? parseInt(options.canvas_width) : this.canvas_width;
    this.canvas.height = (options.canvas_height !== undefined) ? parseInt(options.canvas_height) : this.canvas_height;

    // setting fill color
    this.wave_color = (options.wave_color !== undefined) ? options.wave_color : this.wave_color;

    // setting bars width and gap
    this.bar_width = (options.bar_width !== undefined) ? parseInt(options.bar_width) : this.bar_width;
    this.bar_gap = (options.bar_gap !== undefined) ? parseFloat(options.bar_gap) : this.bar_gap;

    this.download = (options.download !== undefined) ? options.download : this.download;

    this.onComplete = (options.onComplete !== undefined) ? options.onComplete : this.onComplete;
    this.extractBuffer(buffer);
  }

  extractBuffer(buffer) {
    buffer = buffer.getChannelData(0);
    var sections = this.canvas.width;
    var len = Math.floor(buffer.length / sections);
    var maxHeight = this.canvas.height;
    var vals = [];
    for (var i = 0; i < sections; i += this.bar_width) {
      vals.push(this.bufferMeasure(i * len, len, buffer) * 10000);
    }

    for (var j = 0; j < sections; j += this.bar_width) {
      var scale = maxHeight / Math.max.apply(Math, vals);
      var val = this.bufferMeasure(j * len, len, buffer) * 10000;
      val *= scale;
      val += 1;
      this.drawBar(j, val);
    }

    if (this.download) {
      this.generateImage();
    }
    this.onComplete(this.canvas.toDataURL('image/png'), this.context.getImageData(0, 0, this.canvas.width, this.canvas.height));
    // clear canvas for redrawing
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  bufferMeasure(position, length, data) {
    var sum = 0.0;
    for (var i = position; i <= (position + length) - 1; i++) {
      sum += Math.pow(data[i], 2);
    }
    return Math.sqrt(sum / data.length);
  }

  drawBar(i, h) {

    this.context.fillStyle = this.wave_color;

    var w = this.bar_width;
    if (this.bar_gap !== 0) {
      w *= Math.abs(1 - this.bar_gap);
    }
    var x = i + (w / 2),
      y = this.canvas.height - h;

    this.context.fillRect(x, y, w, h);
  }

  generateImage() {
    var image = this.canvas.toDataURL('image/png');

    var link = document.createElement('a');
    link.href = image;
    link.setAttribute('download', '');
    link.click();
  }
}
