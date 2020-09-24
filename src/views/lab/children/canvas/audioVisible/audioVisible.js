/*
 * @Author: gaigai
 * @Date: 2019-07-24 09:19:53
 * @LastEditors  : gaigai
 * @LastEditTime : 2020-09-24 19:54:05
 * @Description:
 * @Email: 1054257376@qq.com
 * @habit: carton girl
 */

let playingNode = null;

const gaussBlur = function(imgData, radius, sigma) {
  var pixes = imgData.data;
  var width = imgData.width;
  var height = imgData.height;
  var gaussMatrix = [],
    gaussSum = 0,
    x,
    y,
    r,
    g,
    b,
    a,
    i,
    j,
    k,
    len;

  var radius = radius || 10;
  var sigma = sigma || 5;

  a = 1 / (Math.sqrt(2 * Math.PI) * sigma);
  b = -1 / (2 * sigma * sigma);
  // 生成高斯矩阵
  for (i = 0, x = -radius; x <= radius; x++, i++) {
    g = a * Math.exp(b * x * x);
    gaussMatrix[i] = g;
    gaussSum += g;
  }

  // 归一化, 保证高斯矩阵的值在[0,1]之间
  for (i = 0, len = gaussMatrix.length; i < len; i++) {
    gaussMatrix[i] /= gaussSum;
  }
  // x 方向一维高斯运算
  for (y = 0; y < height; y++) {
    for (x = 0; x < width; x++) {
      r = g = b = a = 0;
      gaussSum = 0;
      for (j = -radius; j <= radius; j++) {
        k = x + j;
        if (k >= 0 && k < width) {
          // 确保 k 没超出 x 的范围
          // r,g,b,a 四个一组
          i = (y * width + k) * 4;
          r += pixes[i] * gaussMatrix[j + radius];
          g += pixes[i + 1] * gaussMatrix[j + radius];
          b += pixes[i + 2] * gaussMatrix[j + radius];
          // a += pixes[i + 3] * gaussMatrix[j];
          gaussSum += gaussMatrix[j + radius];
        }
      }
      i = (y * width + x) * 4;
      // 除以 gaussSum 是为了消除处于边缘的像素, 高斯运算不足的问题
      // console.log(gaussSum)
      pixes[i] = r / gaussSum;
      pixes[i + 1] = g / gaussSum;
      pixes[i + 2] = b / gaussSum;
      // pixes[i + 3] = a ;
    }
  }
  // y 方向一维高斯运算
  for (x = 0; x < width; x++) {
    for (y = 0; y < height; y++) {
      r = g = b = a = 0;
      gaussSum = 0;
      for (j = -radius; j <= radius; j++) {
        k = y + j;
        if (k >= 0 && k < height) {
          // 确保 k 没超出 y 的范围
          i = (k * width + x) * 4;
          r += pixes[i] * gaussMatrix[j + radius];
          g += pixes[i + 1] * gaussMatrix[j + radius];
          b += pixes[i + 2] * gaussMatrix[j + radius];
          // a += pixes[i + 3] * gaussMatrix[j];
          gaussSum += gaussMatrix[j + radius];
        }
      }
      i = (y * width + x) * 4;
      pixes[i] = r / gaussSum;
      pixes[i + 1] = g / gaussSum;
      pixes[i + 2] = b / gaussSum;
    }
  }
  return imgData;
};

const getImageColor = function(data, width, height) {
  let r = 0,
    g = 0,
    b = 0;

  // 取所有像素的平均值
  for (var row = 0; row < height; row++) {
    for (var col = 0; col < width; col++) {
      r += data[(width * row + col) * 4];
      g += data[(width * row + col) * 4 + 1];
      b += data[(width * row + col) * 4 + 2];
    }
  }

  // 求取平均值
  r /= width * height;
  g /= width * height;
  b /= width * height;

  // 将最终的值取整
  r = Math.round(r);
  g = Math.round(g);
  b = Math.round(b);
  return {
    r,
    g,
    b
  };
};
class autioVisible extends canvasBase {
  constructor(node, options) {
    super(node, options);

    this.audioCtx = null;
    this.analyser = null;
    this.firstLoadPic = true;
    this.audio = null;
    this.sourceNode = null;
    this.bufferLength = null;

    if (options) {
      if (options.audioNode && options.audioNode.nodeName == "AUDIO") {
        this.audio = options.audioNode;
      }
      this.Type = options.Type || "line";
      this.online = options.online || false;
    }
    this.options.color = options.color || "#00a1d6";
    this.topBarList = [];
  }
  init() {
    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    this.analyser = this.audioCtx.createAnalyser();
    if (this.audio && this.online === false) {
      this.sourceNode = this.audioCtx.createMediaElementSource(this.audio);
    } else if (this.online === true) {
      this.sourceNode = this.audioCtx.createBufferSource();
      this.sourceNode.loop = true;
    }
    let gainNode = this.audioCtx.createGain();

    this.sourceNode.connect(gainNode);
    this.analyser.smoothingTimeConstant = 0.8;
    this.sourceNode.connect(this.analyser);
    gainNode.connect(this.audioCtx.destination);
    this.analyser.fftSize = 1024;
    // this.audioCtx.resume();
    super.init(); // 相当于旧的 parent.prototype.init.call(this)
    // 背景设置模糊的封面
    if (this.options.picUrl) {
      if (this.firstLoadPic === true) {
        this.picImg = new Image();
        this.picImg.crossOrigin = "";
        this.picImg.src = this.options.picUrl;
        let _this = this;
        this.picImg.onload = () => {
          _this.ctx.drawImage(
            _this.picImg,
            0,
            0,
            _this.contextWidth,
            _this.contextHeight
          );
          _this.CoverImgData = _this.ctx.getImageData(
            0,
            0,
            _this.contextWidth,
            _this.contextHeight
          );
          let themeColor = getImageColor(
            _this.CoverImgData.data,
            _this.contextWidth,
            _this.contextHeight
          );
          const { r, g, b } = themeColor;
          _this.options.color = `rgb(${255 - r},${255 - g},${255 - b})`;
          console.log(_this.options.color);
          _this.CoverImgData = gaussBlur(_this.CoverImgData, 40, 80);
          _this.ctx.putImageData(_this.CoverImgData, 0, 0);
          _this.picImg.src = this.canvas.toDataURL();

          _this.picImg.onload = null;
          _this.firstLoadPic = false;
        };
      }
    }
    this.count = 1;
  }
  stopRender() {
    super.stopRender();
  }
  stop() {
    this.stopRender();
    if (this.online === true) {
      if (this.audioCtx.state == "running") {
        this.audioCtx.suspend().then(
          function() {
            this.sourceNode.disconnect(this.analyser);
          }.bind(this)
        );
      }
    } else {
      this.audio.pause();
    }
  }
  play() {
    this.drawMain();
    if (this.online === true) {
      if (this.audioCtx.state == "suspended") {
        this.audioCtx.resume().then(
          function() {
            this.analyser = null;
            this.analyser = this.audioCtx.createAnalyser();
            this.sourceNode.connect(this.analyser);
          }.bind(this)
        );
      }
    } else {
      this.audio.play();
    }
  }
  reset(options) {
    super.reset(options);
    if (this.options.picUrl) {
      if (this.firstLoadPic === true) {
        this.picImg = new Image();
        this.picImg.crossOrigin = "";
        this.picImg.src = this.options.picUrl;
        let _this = this;
        this.picImg.onload = () => {
          _this.ctx.drawImage(
            _this.picImg,
            0,
            0,
            _this.contextWidth,
            _this.contextHeight
          );
          _this.CoverImgData = _this.ctx.getImageData(
            0,
            0,
            _this.contextWidth,
            _this.contextHeight
          );

          _this.CoverImgData = gaussBlur(_this.CoverImgData, 40, 80);
          _this.ctx.putImageData(_this.CoverImgData, 0, 0);
          _this.picImg.src = this.canvas.toDataURL();

          _this.picImg.onload = null;
          _this.firstLoadPic = false;
        };
      }
    }
  }
  drawMain() {
    super.drawMain();
  }
  changeType(Type) {
    this.Type = Type;
  }
  close() {
    playingNode.stop(this.audioCtx.currentTime + 1);
    if (this.online === true) {
      playingNode = null;
      this.sourceNode = null;
    } else {
      this.audio = null;
    }
    this.audioCtx = null;
    this.analyser = null;
    this.firstLoadPic = true;
    this.audio = null;
    this.sourceNode = null;
    this.bufferLength = null;
  }
  async getOnlineBuffer(url, type = "switch", callback) {
    if (type === "switch") {
      //this.sourceNode.stop(this.audioCtx.currentTime + 1);
      playingNode.stop(this.audioCtx.currentTime + 1);
      // stop之后要等一下
      setTimeout(() => {
        this.sourceNode = null;
        this.sourceNode = this.audioCtx.createBufferSource();
        let gainNode = this.audioCtx.createGain();

        this.sourceNode.connect(gainNode);
        this.sourceNode.connect(this.analyser);
        this.sourceNode.loop = true;
        gainNode.connect(this.audioCtx.destination);
      }, 0);
    }
    let request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";
    request.send();
    let buffer = await new Promise((resolve, reject) => {
      request.onload = () => {
        if (typeof callback == "function") {
          callback.call(this);
        }
        this.audioCtx.decodeAudioData(
          request.response,
          buffer => {
            resolve(buffer);
          },
          e => {
            reject(e);
          }
        );
      };
    });

    this.sourceNode.buffer = buffer;
    playingNode = this.sourceNode;
    // this.sourceNode.start(0);
    playingNode.start(0);
    window.ss = this.sourceNode;
  }
  renderLine() {
    // this.analyser.getByteTimeDomainData(this.dataArray);
    this.analyser.fftSize = 512;
    this.bufferLength = this.analyser.frequencyBinCount;
    let dataArray = new Uint8Array(this.bufferLength);
    this.analyser.getByteTimeDomainData(dataArray);
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = this.options.color || "#00a1d6";
    this.count++;

    this.ctx.beginPath();

    let sliceWidth = (this.contextWidth * 1.0) / this.bufferLength;
    let x = 0;

    for (let i = 0; i < this.bufferLength; i++) {
      let v = dataArray[i] / 256.0;
      let y = (v * this.contextHeight) / 2 + this.contextHeight / 4;

      if (i === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    this.ctx.lineTo(this.contextWidth, this.contextHeight / 2);
    this.ctx.stroke();
    // this.ctx.save();
  }
  renderBar() {
    this.analyser.fftSize = 512;

    let bufferLength = 240;
    let dataArray = new Uint8Array(240);
    this.analyser.getByteFrequencyData(dataArray);
    let offsetX = 0;
    let barWidth = parseInt(this.contextWidth / bufferLength);
    for (let i = 0; i < bufferLength; i++) {
      let barHeight = dataArray[i];
      let color;
      if (!this.options.color) {
        this.options.color = "rgb(25,68,112)";
      }
      color = this.options.color.replace(
        /^rgb\(([\d]{1,3}),([\d]{1,3}),([\d]{1,3})\)$/,
        "rgb($1,$2," + (barHeight + 20) + ")"
      );
      this.ctx.fillStyle = color;
      this.ctx.fillRect(
        offsetX,
        this.contextHeight - barHeight / 2,
        barWidth,
        barHeight / 2
      );
      if (this.topBarList.length != bufferLength) {
        let item = {
          x: offsetX,
          y: this.contextHeight - barHeight / 2
        };
        this.topBarList.push(item);
      } else {
        let y = this.topBarList[i].y;
        if (y > this.contextHeight - barHeight / 2) {
          this.topBarList[i].y = this.contextHeight - barHeight / 2 - 1;
        } else if (
          this.topBarList[i].y < this.contextHeight &&
          y != this.contextHeight - barHeight / 2
        ) {
          this.topBarList[i].y++;
        }
      }

      let x = this.topBarList[i].x,
        y = this.topBarList[i].y;
      this.ctx.fillStyle = this.options.color || "#e41212";
      this.ctx.fillRect(x, y - 3, barWidth, 2);
      offsetX += barWidth + 1;
    }
  }
  resize() {
    this.topBarList = [];
    super.resize();
  }
  renderRoundBar() {
    this.analyser.minDecibels = -90;
    this.analyser.maxDecibels = -10;
    this.analyser.fftSize = 1024;
    let bufferLength = 180; // this.analyser.frequencyBinCount;
    let dataArray = new Uint8Array(bufferLength);
    this.analyser.getByteFrequencyData(dataArray);

    let radius = Math.min(this.contextHeight, this.contextWidth);
    radius = radius / 2 - 50;

    let xCenter = this.contextWidth / 2;
    let yCenter = this.contextHeight / 2;
    let rounddataArray = [...dataArray];
    rounddataArray = rounddataArray.slice(32, rounddataArray.length);
    let gap1 = rounddataArray[0] - rounddataArray[rounddataArray.length - 1],
      count = 0;
    let lowest = rounddataArray[rounddataArray.length - 1];
    while (count < 4) {
      count++;
      lowest += gap1 / 4;
      rounddataArray.push(lowest);
    }

    let radian = (Math.PI * 2) / rounddataArray.length;
    let gap = radian / 4;
    for (let i = 0; i < rounddataArray.length; i++) {
      let barHeight = rounddataArray[i] / 6 + 1;
      let startAngel = i * radian;
      this.ctx.fillStyle = `rgb(66,66,${rounddataArray[i]})`;
      let endAngel = (i + 1) * radian - gap;
      this.ctx.beginPath();

      this.ctx.moveTo(
        xCenter + Math.cos(startAngel) * radius,
        yCenter - Math.sin(startAngel) * radius
      );
      this.ctx.lineTo(
        xCenter + Math.cos(endAngel) * radius,
        yCenter - Math.sin(endAngel) * radius
      );
      this.ctx.lineTo(
        xCenter + Math.cos(endAngel) * (radius + barHeight),
        yCenter - Math.sin(endAngel) * (radius + barHeight)
      );
      this.ctx.lineTo(
        xCenter + Math.cos(startAngel) * (radius + barHeight),
        yCenter - Math.sin(startAngel) * (radius + barHeight)
      );
      this.ctx.closePath();
      this.ctx.fill();
    }
  }
  renderCrystal() {
    this.analyser.minDecibels = -90;
    this.analyser.maxDecibels = -10;
    this.analyser.fftSize = 1024;
    let bufferLength = 128;
    let dataArray = new Uint8Array(bufferLength);
    this.analyser.getByteFrequencyData(dataArray);
    this.ctx.strokeStyle = this.options.clolr || "#e43f71";
    let radius = Math.min(this.contextHeight, this.contextWidth);
    radius = radius / 2 - 50;
    let xCenter = this.contextWidth / 2;
    let yCenter = this.contextHeight / 2;
    this.ctx.beginPath();
    let max = Math.max.apply([], dataArray);
    let line = max / 2,
      growRatio = 6;
    let transedDataArray = [...dataArray]; // .concat([...dataArray].reverse());
    transedDataArray = transedDataArray.slice(32, transedDataArray.length);

    let gap1 =
        transedDataArray[0] - transedDataArray[transedDataArray.length - 1],
      count = 0;
    let lowest = transedDataArray[transedDataArray.length - 1],
      firstHeight = transedDataArray[0];
    while (count < 8) {
      count++;
      lowest += gap1 / 8;
      transedDataArray.push(lowest);
    }
    let radian = (Math.PI * 2) / transedDataArray.length;
    this.ctx.moveTo(
      xCenter +
        Math.cos(0) * (radius + Math.max(firstHeight - line, 0) / growRatio),
      yCenter +
        Math.sin(0) * (radius + Math.max(firstHeight - line, 0) / growRatio)
    );
    for (let i = 0; i < transedDataArray.length; i++) {
      let height = transedDataArray[i];
      let angel = (i + 1) * radian;
      if (height > line) {
        this.ctx.lineTo(
          xCenter + Math.cos(angel) * (radius + (height - line) / growRatio),
          yCenter + Math.sin(angel) * (radius + (height - line) / growRatio)
        );
      } else {
        this.ctx.lineTo(
          xCenter + Math.cos(angel) * radius,
          yCenter + Math.sin(angel) * radius
        );
      }
    }

    this.ctx.stroke();
    this.ctx.closePath();

    this.ctx.beginPath();
    this.ctx.moveTo(
      xCenter +
        Math.cos(0) * (radius - Math.max(firstHeight - line, 0) / growRatio),
      yCenter +
        Math.sin(0) * (radius - Math.max(firstHeight - line, 0) / growRatio)
    );
    for (let c = 0; c < transedDataArray.length; c++) {
      let height = transedDataArray[c];
      let angel = (c + 1) * radian;

      if (height > line) {
        this.ctx.lineTo(
          xCenter + Math.cos(angel) * (radius - (height - line) / growRatio),
          yCenter + Math.sin(angel) * (radius - (height - line) / growRatio)
        );
        this.ctx.lineTo(
          xCenter + Math.cos(angel) * (radius + (height - line) / growRatio),
          yCenter + Math.sin(angel) * (radius + (height - line) / growRatio)
        );
        this.ctx.moveTo(
          xCenter + Math.cos(angel) * (radius - (height - line) / growRatio),
          yCenter + Math.sin(angel) * (radius - (height - line) / growRatio)
        );
      } else if (c > 0 && transedDataArray[c - 1] > line) {
        this.ctx.lineTo(
          xCenter + Math.cos(angel) * radius,
          yCenter + Math.sin(angel) * radius
        );
      } else {
        this.ctx.moveTo(
          xCenter + Math.cos(angel) * radius,
          yCenter + Math.sin(angel) * radius
        );
      }
    }

    this.ctx.stroke();
    this.ctx.closePath();
    this.ctx.save();
  }
  render() {
    super.render();
    if (this.firstLoadPic === false) {
      this.ctx.putImageData(this.CoverImgData, 0, 0);
      // this.picImg.src = this.canvas.toDataURL();
      // this.picImg.onload = null;
    }

    switch (this.Type) {
      case "line":
        this.renderLine();
        break;
      case "bar":
        this.renderBar();
        break;
      case "roundBar":
        this.renderRoundBar();
        break;
      case "crystal":
        this.renderCrystal();
        break;
      default:
        this.renderLine();
        break;
    }
  }
}

export default autioVisible;
