class autioVisible extends canvasBase{
        constructor(node,options){
                super(node,options);

                this.audioCtx = null;
                this.analyser = null;
    
                this.audio = null;
                this.sourceNode = null;
                this.bufferLength = null;
                if(options){

                        if(options.audioNode && options.audioNode.nodeName == 'AUDIO'){
                                this.audio = options.audioNode
                        }
                        this.Type = options.Type || 'line';
                        this.online = options.online || false;
                        
                }
                
                this.topBarList = [];
                
        }
        init(){
                this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                this.analyser = this.audioCtx.createAnalyser();
                if(this.audio && this.online === false){     
                        this.sourceNode = this.audioCtx.createMediaElementSource(this.audio);          
                }else if(this.online === true){
                        this.sourceNode = this.audioCtx.createBufferSource();
                        this.sourceNode.loop = true;
                }
                let gainNode = this.audioCtx.createGain();
                        
                this.sourceNode.connect(gainNode);
                this.sourceNode.connect(this.analyser);
                gainNode.connect(this.audioCtx.destination);
                this.analyser.fftSize = 1024;
                //this.audioCtx.resume();
                super.init(); //相当于旧的 parent.prototype.init.call(this)
        }
        stop(){
                if(this.online === true){
                        if(this.audioCtx.state == 'running'){

                                this.audioCtx.suspend().then(()=>{
        
                                        this.sourceNode.disconnect(this.analyser);
                                });
                        }
                }else{
                        this.audio.pause();
                }
        }
        play(){
                if(this.online === true){
                       
                        if(this.audioCtx.state == 'suspended'){

                                this.audioCtx.resume().then(()=>{
                                        this.analyser = null;
                                        this.analyser = this.audioCtx.createAnalyser();
                                        this.sourceNode.connect(this.analyser);
                                });
                        }
                }else{
                        this.audio.play();
                }
        }
        drawMain(){
                super.drawMain(); 
        }
        changeType(Type){
                this.Type = Type;
               
        }
        close(){
                if(this.online === true){
                        delete this;
                        this.sourceNode = null;
                }else{
                        this.audio = null;
                        
                }
        }
        async getOnlineBuffer(url,type='switch'){
                if(type === 'switch'){
                        this.sourceNode.stop();
                        this.sourceNode = null;
                        this.sourceNode = this.audioCtx.createBufferSource();
                        let gainNode = this.audioCtx.createGain();
                        
                        this.sourceNode.connect(gainNode);
                        this.sourceNode.connect(this.analyser);
                        this.sourceNode.loop = true;
                        gainNode.connect(this.audioCtx.destination);
                }
                let source = this.sourceNode;
               
                let request = new XMLHttpRequest();
                request.open("GET", url, true);
                request.responseType = "arraybuffer";
                request.send();
                let buffer =await new Promise((resolve,reject)=>{
                        request.onload = ()=>{
                                this.audioCtx.decodeAudioData(request.response, (buffer)=>{
                                        resolve(buffer);
                                }, (e)=>{
                                        reject(e);
                                       
                                });
                        };
                })
                
                this.sourceNode.buffer = buffer;
                this.sourceNode.start(0);
                
        }
        renderLine(){
                //this.analyser.getByteTimeDomainData(this.dataArray);
                this.analyser.fftSize = 1024;
                this.bufferLength = this.analyser.frequencyBinCount;
                let dataArray = new Uint8Array(this.bufferLength);
                this.analyser.getByteTimeDomainData(dataArray);
                this.ctx.fillStyle = '#fff';
                this.ctx.fillRect(0, 0, this.contextWidth, this.contextHeight);
              
                this.ctx.lineWidth = 1;
                this.ctx.strokeStyle = '#00a1d6';
              
                this.ctx.beginPath();
              
                let sliceWidth = this.contextWidth * 1.0 / this.bufferLength;
                let x = 0;
            

                for (let i = 0; i < this.bufferLength; i++) {
              
                  let v = dataArray[i] / 128.0;
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
                this.analyser.fftSize = 256;
                this.ctx.fillStyle = '#fff';
                this.ctx.fillRect(0,0,this.contextWidth,this.contextHeight);
                
                
                let bufferLength = this.analyser.frequencyBinCount;
                let dataArray = new Uint8Array(bufferLength);
                this.analyser.getByteFrequencyData(dataArray);
                let offsetX = 0;
                let barWidth = parseInt(this.contextWidth/bufferLength )
                for (let i = 0; i < bufferLength; i++) {
                       
                        let barHeight = dataArray[i];
                        
                        this.ctx.fillStyle = `rgba(50,50,${barHeight+20})`;
                        this.ctx.fillRect(offsetX,this.contextHeight-barHeight/2,barWidth,barHeight/2);
                        if(this.topBarList.length != bufferLength){
                                let item = {
                                        x:offsetX,
                                        y:this.contextHeight-barHeight/2
                                }
                                this.topBarList.push(item);
                        }else{
                                let y = this.topBarList[i].y;
                                if(y> this.contextHeight-barHeight/2){
                                        this.topBarList[i].y = this.contextHeight-barHeight/2 -1;
                                }else if(this.topBarList[i].y < this.contextHeight && y != this.contextHeight-barHeight/2){
                                        this.topBarList[i].y++;
                                }
                        }
                        
                        let x = this.topBarList[i].x,y=this.topBarList[i].y;
                        this.ctx.fillStyle = '#e41212';
                        this.ctx.fillRect(x,y-3,barWidth,2);
                        offsetX+= barWidth+1;
                       
                        
                }
                
        }
        renderRoundBar(){
                this.analyser.fftSize = 512;
                let bufferLength = this.analyser.frequencyBinCount;
                let dataArray = new Uint8Array(bufferLength);
                this.analyser.getByteFrequencyData(dataArray);
                this.ctx.fillStyle="#fff";
                this.ctx.fillRect(0,0,this.contextWidth,this.contextHeight);
                let radius = Math.min(this.contextHeight,this.contextWidth);
                radius = radius/2 -50;
                
                
                
                let xCenter = this.contextWidth/2;
                let yCenter = this.contextHeight/2;
                let rounddataArray = dataArray.slice(30,bufferLength-50);
                let radian = Math.PI*2/rounddataArray.length;
                let gap = radian/8;
                for(let i=0;i<rounddataArray.length;i++){
                        let barHeight = rounddataArray[i]/8+1;
                        let startAngel=i*radian;
                        this.ctx.fillStyle = `rgb(66,66,${rounddataArray[i]+100})`;
                        let endAngel = (i+1)*radian - gap;
                        this.ctx.beginPath();
                       
                        this.ctx.moveTo(xCenter + Math.cos(startAngel)*radius,yCenter-Math.sin(startAngel)*radius);
                        this.ctx.lineTo(xCenter + Math.cos(endAngel)*radius,yCenter-Math.sin(endAngel)*radius);
                        this.ctx.lineTo(xCenter + Math.cos(endAngel)*(radius+barHeight),yCenter-Math.sin(endAngel)*(radius+barHeight));
                        this.ctx.lineTo(xCenter + Math.cos(startAngel)*(radius+barHeight),yCenter-Math.sin(startAngel)*(radius+barHeight));
                        this.ctx.closePath();
                        this.ctx.fill();
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
                                break;
                        case 'roundBar':
                                this.renderRoundBar();
                                break;
                        default:
                                this.renderLine();
                                break;
                }
                
               
        }
}

export default autioVisible;