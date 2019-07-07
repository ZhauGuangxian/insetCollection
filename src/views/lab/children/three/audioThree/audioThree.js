
import ThreeBase from '../threeBase.js';

class audioThree extends ThreeBase{
    constructor(options){
        super(options);

        this.audioCtx = null;
        this.anaylser = null;
        if(options.type == 'online'){
            this.online = true;
            
        }else{
            this.online = false;
            if(!options.audioNode || options.audioNode.nodeName !='AUDIO'){
                throw new Error('audio element is required under offline mode');
            }else{

                this.audioNode = options.audioNode;
            }


        }
        this.animateType = options.animateType || 'bar';
        this.barGroup = null;
        this.cubelineGroup = null;
        this.kangkang = true;
    }
    init(){

        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        this.analyser = this.audioCtx.createAnalyser();
        if(this.audioNode && this.online === false){     
                this.sourceNode = this.audioCtx.createMediaElementSource(this.audioNode);          
        }else if(this.online === true){
                this.sourceNode = this.audioCtx.createBufferSource();
                this.sourceNode.loop = true;
        }
        let gainNode = this.audioCtx.createGain();
                
        this.sourceNode.connect(gainNode);
        this.sourceNode.connect(this.analyser);
        gainNode.connect(this.audioCtx.destination);
        var light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
        this.scene.add( light );
        super.init();
 
        //this.camera.position.set( 100, 200, 0 );
    }
    drawMain(){
        
        super.drawMain();
    }
    render(){
        switch(this.animateType){
            case 'bar':
                    
                    this.drawBar();
                    break;
            default:
                break;
        }
        super.render();
    }
    drawBar(){
        this.analyser.fftSize = 256;
       

        let bufferLength = 64;
        let dataArray = new Uint8Array(bufferLength);
        this.analyser.getByteFrequencyData(dataArray);
       
        let barWidth = 1.5,barGap = 2;
        
        if(!this.barGroup){
            this.barGroup = new THREE.Group();
            this.cubelineGroup = new THREE.Group();
            this.barGroup.name="bars";
            this.cubelineGroup.name = "barLines"
            for(let i = 0; i < bufferLength; i++){
                let geometry = new THREE.BoxBufferGeometry( barWidth, barWidth, 2 );
                let material = new THREE.MeshBasicMaterial( {color: 0x00a1d6} );
                let edge = new THREE.EdgesGeometry(geometry);
                let cubeline = new THREE.LineSegments(edge,new THREE.MeshBasicMaterial({color:0xffffff}));
                let barItem = new THREE.Mesh( geometry, material );
                barItem.name = 'bar'+i;
                barItem.position.set( i*(barWidth+barGap)-100,1, 1 );
                cubeline.position.set( i*(barWidth+barGap)-100,1, 1 );
                this.cubelineGroup.add(cubeline);
                
                this.barGroup.add(barItem);
            }
            this.scene.add(this.barGroup);
            this.scene.add(this.cubelineGroup);
            this.camera.position.set( 0, 0, 0 );
        }else{
            let bars = this.scene.getObjectByName('bars');
            let lines = this.scene.getObjectByName('barLines');
            for (let i = 0; i < bufferLength; i++) {

                let barHeight = dataArray[i]/10 +0.5;
    
                let mesh = bars.children[i];
                let mesh2 = lines.children[i];
                mesh.scale.y = barHeight;
                mesh2.scale.y = barHeight;
    
            }
        }
        
        
    }
}

export default audioThree;