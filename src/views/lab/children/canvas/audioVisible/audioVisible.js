class autioVisible extends canvasBase{
        constructor(node,options){
                super(node,options);

                this.audioCtx = null;
                this.analyser = null;
                this.dataArray = null;
                this.audio = null;
                this.localSource = null;
                this.bufferLength = null;
                if(options && options.audioNode && options.audioNode.nodeName == 'AUDIO'){
                        this.audio = options.audioNode
                }
        }
        init(){
                

                this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                this.analyser = this.audioCtx.createAnalyser();
               
                this.analyser.fftSize = 2048;
                this.bufferLength = this.analyser.frequencyBinCount;
                this.dataArray = new Uint8Array(this.bufferLength);
                this.analyser.getByteTimeDomainData(this.dataArray);
                if(this.audio){
                        this.localSource = this.audioCtx.createMediaElementSource(this.audio);
                        var gainNode = this.audioCtx.createGain();
                        
                        this.localSource.connect(gainNode);
                        this.localSource.connect(this.analyser);
                        gainNode.connect(this.audioCtx.destination);
                }
                //this.audioCtx.resume();
                super.init(); //相当于旧的 parent.prototype.init.call(this)
        }
        drawMain(){
                super.drawMain();
                
        }
        render(){
                super.render();
               
                
                this.analyser.getByteTimeDomainData(this.dataArray);
              
                this.ctx.fillStyle = 'rgb(200, 200, 200)';
                this.ctx.fillRect(0, 0, this.contextWidth, this.contextHeight);
              
                this.ctx.lineWidth = 2;
                this.ctx.strokeStyle = 'rgb(0, 0, 0)';
              
                this.ctx.beginPath();
              
                var sliceWidth = this.contextWidth * 1.0 / this.bufferLength;
                var x = 0;
              
                for (var i = 0; i < this.bufferLength; i++) {
              
                  var v = this.dataArray[i] / 128.0;
                  var y = v * this.contextHeight / 2;
              
                  if (i === 0) {
                    this.ctx.moveTo(x, y);
                  } else {
                    this.ctx.lineTo(x, y);
                  }
              
                  x += sliceWidth;
                }
              
                this.ctx.lineTo(this.contextWidth, this.contextHeight / 2);
                this.ctx.stroke();
        }
}

export default autioVisible;