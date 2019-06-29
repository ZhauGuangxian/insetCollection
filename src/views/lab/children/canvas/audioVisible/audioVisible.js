class autioVisible extends canvasBase{
        constructor(node,options){
                super(node,options);

                this.audioCtx = null;
                this.analyser = null;
                this.dataArray = null;
                this.audio = null;
                this.localSource = null;
                this.bufferLength = null;
                if(options){

                        if(options.audioNode && options.audioNode.nodeName == 'AUDIO'){
                                this.audio = options.audioNode
                        }
                        this.Type = options.Type || 'line'
                }
                this.kangkang = false;
        }
        init(){
                

                this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                this.analyser = this.audioCtx.createAnalyser();
               
                
                
                
                if(this.audio){
                        this.localSource = this.audioCtx.createMediaElementSource(this.audio);
                        let gainNode = this.audioCtx.createGain();
                        
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
        changeType(Type){
                this.Type = Type;
        }
        renderLine(){
                //this.analyser.getByteTimeDomainData(this.dataArray);
                this.analyser.fftSize = 1024;
                this.bufferLength = this.analyser.frequencyBinCount;
                this.dataArray = new Uint8Array(this.bufferLength);
                this.analyser.getByteTimeDomainData(this.dataArray);
                this.ctx.fillStyle = '#fff';
                this.ctx.fillRect(0, 0, this.contextWidth, this.contextHeight);
              
                this.ctx.lineWidth = 1;
                this.ctx.strokeStyle = '#00a1d6';
              
                this.ctx.beginPath();
              
                let sliceWidth = this.contextWidth * 2.0 / this.bufferLength;
                let x = 0;
                if(this.kangkang === false){
                        console.log(this.dataArray);
                        this.kangkang = true;
                }

                for (let i = 0; i < this.bufferLength; i++) {
              
                  let v = this.dataArray[i] / 128.0;
                  let y = v * this.contextHeight / 2;
              
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
        renderBar(){
                this.ctx.fillStyle = '#fff';
                this.ctx.fillRect(0,0,this.contextWidth,this.contextHeight);
                this.analyser.fftSize = 256;
                
                let bufferLength = this.analyser.frequencyBinCount;
                let dataArray = new Uint8Array(bufferLength);
                this.analyser.getByteFrequencyData(dataArray);
                let x = 0;
                let barWidth = parseInt(this.contextWidth/bufferLength )
                for (let i = 0; i < bufferLength; i++) {
              
                        let barHeight = dataArray[i];
                        if(this.kangkang === false){
                                console.log(dataArray);
                                this.kangkang = true;
                        }
                        this.ctx.fillStyle = `rgba(50,50,${barHeight+20})`;
                        this.ctx.fillRect(x,this.contextHeight-barHeight/2,barWidth,barHeight/2)

                        x+= barWidth+1;
                        
                }
        }
        render(){
                super.render();
                
                switch(this.Type){
                        case 'line':
                                this.renderLine();
                                break;
                        case 'bar':
                                this.renderBar();
                }
                
               
        }
}

export default autioVisible;