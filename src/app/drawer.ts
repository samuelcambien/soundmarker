import {EventEmitter, Output} from "@angular/core";

export class Drawer {

  private container: any;
  private params: any;
  private height: number;
  private lastPos: number;
  private wrapper: any;

  private progressWave: any;
  private progressStart: number;

  private commentWave: any;
  private commentStart: number;
  private commentEnd: number;

  private maxCanvasElementWidth: number;
  private maxCanvasWidth: number;

  private canvases: any;
  private hasProgressCanvas: boolean;
  private halfPixel: number;
  private peaks: number[];
  private duration: any;

  @Output() seek = new EventEmitter();

  constructor(container, params) {

    this.container = container;
    this.params = params;

    this.height = params.height * this.params.pixelRatio;

    this.duration = params.duration;
    this.peaks = params.peaks;

    this.lastPos = 0;

    this.initDrawer(params);

    this.createWrapper();
    this.createElements();
  }

  createWrapper() {

    this.wrapper = this.container.appendChild(
      document.createElement('wave')
    );

    this.style(this.wrapper, {
      display: 'block',
      position: 'relative',
      userSelect: 'none',
      webkitUserSelect: 'none',
      height: this.params.height + 'px',
      width: '100%',
    });

    this.wrapper.addEventListener('click', (e) => this.seek.emit(this.getProgress(e)));
  }

  getProgress(e) {

    var clientX = e.targetTouches ? e.targetTouches[0].clientX : e.clientX;
    var bbox = this.wrapper.getBoundingClientRect();

    return ((clientX - bbox.left + this.wrapper.scrollLeft) / this.wrapper.scrollWidth) || 0;
  }

  drawPeaks(length, start, end) {

    this.updateSize();
    this.updateProgress(this.getPos(this.progressStart));
    this.updateComment(this.getPos(this.commentStart), this.getPos(this.commentEnd));

    this.drawWave(this.peaks, 0, start, end);
  }

  style(el, styles) {
    Object.keys(styles).forEach(function (prop) {
      if (el.style[prop] !== styles[prop]) {
        el.style[prop] = styles[prop];
      }
    });
    return el;
  }

  recenter(percent) {
    var position = this.wrapper.scrollWidth * percent;
    this.recenterOnPosition(position, true);
  }

  recenterOnPosition(position, immediate?) {
    var scrollLeft = this.wrapper.scrollLeft;
    var half = ~~(this.wrapper.clientWidth / 2);
    var target = position - half;
    var offset = target - scrollLeft;
    var maxScroll = this.wrapper.scrollWidth - this.wrapper.clientWidth;

    if (maxScroll == 0) {
      // no need to continue if scrollbar is not there
      return;
    }

    // if the cursor is currently visible...
    if (!immediate && -half <= offset && offset < half) {
      // we'll limit the "re-center" rate.
      var rate = 5;
      offset = Math.max(-rate, Math.min(rate, offset));
      target = scrollLeft + offset;
    }

    // limit target to valid range (0 to maxScroll)
    target = Math.max(0, Math.min(maxScroll, target));
    // no use attempting to scroll if we're not moving
    if (target != scrollLeft) {
      this.wrapper.scrollLeft = target;
    }

  }

  getScrollX() {
    return Math.round(this.wrapper.scrollLeft * this.params.pixelRatio);
  }

  getWidth() {
    return Math.round(this.container.clientWidth * this.params.pixelRatio);
  }

  setHeight(height) {
    if (height == this.height) {
      return;
    }
    this.height = height;
    this.style(this.wrapper, {
      height: ~~(this.height / this.params.pixelRatio) + 'px'
    });
    this.updateSize();
  }

  progress(progress, start?) {

    var minPxDelta = 1 / this.params.pixelRatio;
    this.progressStart = progress;
    var pos = this.getPos(progress);

    if (pos < this.lastPos || pos - this.lastPos >= minPxDelta) {
      this.lastPos = pos;

      if (this.params.scrollParent && this.params.autoCenter) {
        var newPos = ~~(this.wrapper.scrollWidth * progress);
        this.recenterOnPosition(newPos);
      }

      this.updateProgress(pos, this.getPos(start));
    }

    this.drawBuffer();
  }

  highlightComment(start, end) {
    this.commentStart = start;
    this.commentEnd = end;
    this.updateComment(this.getPos(this.commentStart), this.getPos(this.commentEnd));
  }

  getPos(time) {
    var minPxDelta = 1 / this.params.pixelRatio;
    return Math.round(time * this.getWidth()) * minPxDelta;
  }

  updateComment(start, end) {
    this.style(
      this.commentWave,
      {
        clip: 'rect(0px, ' + end + 'px, ' + this.height + 'px, ' + start + 'px)'
      }
    );
  }

  initDrawer (params) {
    this.maxCanvasWidth = params.maxCanvasWidth != null ? params.maxCanvasWidth : 4000;
    this.maxCanvasElementWidth = Math.round(this.maxCanvasWidth / this.params.pixelRatio);

    if (this.maxCanvasWidth <= 1) {
      throw 'maxCanvasWidth must be greater than 1.';
    } else if (this.maxCanvasWidth % 2 == 1) {
      throw 'maxCanvasWidth must be an even number.';
    }

    this.hasProgressCanvas = this.params.waveColor != this.params.progressColor;
    this.halfPixel = 0.5 / this.params.pixelRatio;
    this.canvases = [];
  }

  createElements () {
    this.progressWave = this.wrapper.appendChild(
      this.style(document.createElement('wave'), {
        position: 'absolute',
        zIndex: 2,
        left: 0,
        top: 0,
        bottom: 0,
        overflow: 'hidden',
        width: 0,
        clip: 'rect(0px, 0px, 0px, 0px)',
        display: 'none',
        boxSizing: 'border-box',
      })
    );

    this.commentWave = this.wrapper.appendChild(
      this.style(document.createElement('wave'), {
        position: 'absolute',
        zIndex: 3,
        left: 0,
        top: 0,
        bottom: 0,
        overflow: 'hidden',
        opacity: 0.5,
        width: 0,
        clip: 'rect(0px, 0px, 0px, 0px)',
        boxSizing: 'border-box',
      })
    );

    this.addCanvas();
  }

  updateSize () {
    var totalWidth = Math.round(this.getWidth() / this.params.pixelRatio),
      requiredCanvases = Math.ceil(totalWidth / this.maxCanvasElementWidth);

    while (this.canvases.length < requiredCanvases) {
      this.addCanvas();
    }

    while (this.canvases.length > requiredCanvases) {
      this.removeCanvas();
    }

    for (let i = 0; i < this.canvases.length; i++) {
      // Add some overlap to prevent vertical white stripes, keep the width even for simplicity.
      let canvasWidth = this.maxCanvasWidth + 2 * Math.ceil(this.params.pixelRatio / 2);

      if (i == this.canvases.length - 1) {
        canvasWidth = this.getWidth() - (this.maxCanvasWidth * (this.canvases.length - 1));
      }

      this.updateDimensions(this.canvases[i], canvasWidth, this.height);
      this.clearWaveForEntry(this.canvases[i]);
    }
  }

  addCanvas () {

    let entry = {
      wave: null, waveCtx: null, progress: null, progressCtx: null, comment: null, commentCtx: null
    };
    const leftOffset = this.maxCanvasElementWidth * this.canvases.length;

    entry.wave = this.wrapper.appendChild(
      this.style(document.createElement('canvas'), {
        position: 'absolute',
        zIndex: 1,
        left: leftOffset + 'px',
        top: 0,
        bottom: 0
      })
    );
    entry.waveCtx = entry.wave.getContext('2d');

    if (this.hasProgressCanvas) {
      entry.progress = this.progressWave.appendChild(
        this.style(document.createElement('canvas'), {
          position: 'absolute',
          left: leftOffset + 'px',
          top: 0,
          bottom: 0
        })
      );
      entry.progressCtx = entry.progress.getContext('2d');

      entry.comment = this.commentWave.appendChild(
        this.style(document.createElement('canvas'), {
          position: 'absolute',
          left: leftOffset + 'px',
          top: 0,
          bottom: 0
        })
      );
      entry.commentCtx = entry.comment.getContext('2d');
    }

    this.canvases.push(entry);
  }

  removeCanvas () {
    var lastEntry = this.canvases.pop();
    lastEntry.wave.parentElement.removeChild(lastEntry.wave);
    if (this.hasProgressCanvas) {
      lastEntry.progress.parentElement.removeChild(lastEntry.progress);
    }
  }

  updateDimensions (entry, width, height) {
    var elementWidth = Math.round(width / this.params.pixelRatio),
      totalWidth = Math.round(this.getWidth() / this.params.pixelRatio);

    // Where the canvas starts and ends in the waveform, represented as a decimal between 0 and 1.
    entry.start = (entry.waveCtx.canvas.offsetLeft / totalWidth) || 0;
    entry.end = entry.start + elementWidth / totalWidth;

    entry.waveCtx.canvas.width = width;
    entry.waveCtx.canvas.height = height;
    this.style(entry.waveCtx.canvas, {width: elementWidth + 'px'});

    this.style(this.progressWave, {width: this.getWidth() / 2 + 'px'});
    this.style(this.commentWave, {width: this.getWidth() / 2 + 'px'});

    this.style(this.progressWave, {display: 'block'});
    this.style(this.commentWave, {display: 'block'});

    if (this.hasProgressCanvas) {
      entry.progressCtx.canvas.width = width;
      entry.progressCtx.canvas.height = height;
      this.style(entry.progressCtx.canvas, {width: elementWidth + 'px'});

      entry.commentCtx.canvas.width = width;
      entry.commentCtx.canvas.height = height;
      this.style(entry.commentCtx.canvas, {width: elementWidth + 'px'});
    }
  }

  clearWaveForEntry (entry) {
    entry.waveCtx.clearRect(0, 0, entry.waveCtx.canvas.width, entry.waveCtx.canvas.height);
    if (this.hasProgressCanvas) {
      entry.progressCtx.clearRect(0, 0, entry.progressCtx.canvas.width, entry.progressCtx.canvas.height);
    }
  }

  drawWave (peaks, channelIndex, start, end) {
    var my = this;
    // Split channels
    if (peaks[0] instanceof Array) {
      var channels = peaks;
      if (this.params.splitChannels) {
        this.setHeight(channels.length * this.params.height * this.params.pixelRatio);
        channels.forEach(function (channelPeaks, i) {
          my.drawWave(channelPeaks, i, start, end);
        });
        return;
      } else {
        peaks = channels[0];
      }
    }

    // Support arrays without negative peaks
    var hasMinValues = [].some.call(peaks, function (val) {
      return val < 0;
    });
    if (!hasMinValues) {
      var reflectedPeaks = [];
      for (var i = 0, len = peaks.length; i < len; i++) {
        reflectedPeaks[2 * i] = peaks[i];
        reflectedPeaks[2 * i + 1] = -peaks[i];
      }
      peaks = reflectedPeaks;
    }

    // A half-pixel offset makes lines crisp
    var height = this.params.height * this.params.pixelRatio;
    var offsetY = height * channelIndex || 0;
    var halfH = height / 2;

    var absmax = 1;
    if (this.params.normalize) {
      var max = Math.max(peaks);
      var min = Math.min(peaks);
      absmax = -min > max ? -min : max;
    }

    this.drawLine(peaks, absmax, halfH, offsetY, start, end);

    // Always draw a median line
    this.fillRect(0, halfH + offsetY - this.halfPixel, this.getWidth(), this.halfPixel);
  }

  drawLine (peaks, absmax, halfH, offsetY, start, end) {
    for (var index in this.canvases) {
      var entry = this.canvases[index];

      this.setFillStyles(entry);

      this.drawLineToContext(entry, entry.waveCtx, peaks, absmax, halfH, offsetY, start, end);
      this.drawLineToContext(entry, entry.progressCtx, peaks, absmax, halfH, offsetY, start, end);
      this.drawLineToContext(entry, entry.commentCtx, peaks, absmax, halfH, offsetY, start, end);
    }
  }

  drawLineToContext (entry, ctx, peaks, absmax, halfH, offsetY, start, end) {
    if (!ctx) {
      return;
    }

    var length = peaks.length / 2;

    var scale = 1;
    if (this.getWidth() != length) {
      scale = this.getWidth() / length;
    }

    var first = Math.round(length * entry.start),
      last = Math.round(length * entry.end);
    if (first > end || last < start) {
      return;
    }
    var canvasStart = Math.max(first, start);
    var canvasEnd = Math.min(last, end);

    ctx.beginPath();
    ctx.moveTo((canvasStart - first) * scale + this.halfPixel, halfH + offsetY);

    for (var i = canvasStart; i < length; i++) {
      var peak = peaks[2 * i] || 0;
      var h = Math.round(peak / absmax * halfH);
      ctx.lineTo((i - first) * scale + this.halfPixel, halfH - h + offsetY);
    }

    ctx.lineTo((length - 1 - first) * scale + this.halfPixel, halfH + offsetY);

    ctx.closePath();
    ctx.fill();
  }

  fillRect (x, y, width, height) {
    var startCanvas = Math.floor(x / this.maxCanvasWidth);
    var endCanvas = Math.min(Math.ceil((x + width) / this.maxCanvasWidth) + 1,
      this.canvases.length);
    for (var i = startCanvas; i < endCanvas; i++) {
      var entry = this.canvases[i],
        leftOffset = i * this.maxCanvasWidth;

      var intersection = {
        x1: Math.max(x, i * this.maxCanvasWidth),
        y1: y,
        x2: Math.min(x + width, i * this.maxCanvasWidth + entry.waveCtx.canvas.width),
        y2: y + height
      };

      if (intersection.x1 < intersection.x2) {
        this.setFillStyles(entry);

        this.fillRectToContext(entry.waveCtx,
          intersection.x1 - leftOffset,
          intersection.y1,
          intersection.x2 - intersection.x1,
          intersection.y2 - intersection.y1);

        this.fillRectToContext(entry.progressCtx,
          intersection.x1 - leftOffset,
          intersection.y1,
          intersection.x2 - intersection.x1,
          intersection.y2 - intersection.y1);

        this.fillRectToContext(entry.commentCtx,
          intersection.x1 - leftOffset,
          intersection.y1,
          intersection.x2 - intersection.x1,
          intersection.y2 - intersection.y1);
      }
    }
  }

  fillRectToContext (ctx, x, y, width, height) {
    if (!ctx) {
      return;
    }
    ctx.fillRect(x, y, width, height);
  }

  setFillStyles (entry) {
    entry.waveCtx.fillStyle = this.params.waveColor;
    if (this.hasProgressCanvas) {
      entry.progressCtx.fillStyle = this.params.progressColor;
      entry.commentCtx.fillStyle = '#7397ff';
    }
  }

  updateProgress (pos, start?) {
    if (!start) start = 0;
    this.style(this.progressWave, {
      clip: 'rect(0px, ' + pos + 'px, ' + this.height + 'px, ' + start + 'px)'
    });
  }

  drawBuffer() {
    const start = 0;
    this.drawPeaks(this.getWidth(), start, this.getWidth());
  }
}
