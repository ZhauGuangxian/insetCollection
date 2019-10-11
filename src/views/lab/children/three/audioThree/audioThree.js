/*
 * @Author: gaigai
 * @Date: 2019-07-24 09:19:53
 * @LastEditors: gaigai
 * @LastEditTime: 2019-10-11 19:31:48
 * @Description: 
 * @Email: 1054257376@qq.com
 * @habit: carton girl
 */

import ThreeBase from '../threeBase.js';
import { BloomEffect } from '../bloomEffect';

class audioThree extends ThreeBase{
    constructor(options){
        super(options);
        
        this.audioCtx = null;
        this.anaylser = null;
        this.renderer.shadowMapEnabled  = true;
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
        this.controls.maxPolarAngle = Math.PI / 2 - Math.PI/180 * 10;
        this.kangkang = true;
       
        let light = new THREE.AmbientLight( 0x777777);
        this.scene.add( light );
        let dirLight = new THREE.DirectionalLight( 0xeeeeee);
		dirLight.position.set( 0, 20, -20 );
        dirLight.castShadow = true;
        this.scene.add( dirLight );
		dirLight.shadow.mapSize.width = 1024;
        dirLight.shadow.mapSize.height = 1024;
        const d = 100;
        dirLight.shadow.camera.left = - d;
        dirLight.shadow.camera.right = d;
        dirLight.shadow.camera.top = d;
        dirLight.shadow.camera.bottom = - d;
        dirLight.shadow.camera.far = 200;
        let ground = new THREE.PlaneBufferGeometry(3000,3000);
        let groundMesh = new THREE.Mesh(ground, new THREE.MeshLambertMaterial({color:0xefefef, side:THREE.DoubleSide}));
        
        groundMesh.rotation.x = -Math.PI / 2;
        groundMesh.receiveShadow = true;
        this.scene.add(groundMesh);
        this.clock = new THREE.Clock();
        this.bloomComposer = BloomEffect(this.renderer, this.scene, this.camera);
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
        this.analyser.fftSize = 256;
        this.bufferLength = 64;
        
        this.initBars();
        this.scene.fog = new THREE.FogExp2(0xcce0ff,0.002);
        super.init();
        //this.camera.position.set( 100, 200, 0 );
    }
    drawMain(){
        
        this.bloomComposer.render();
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
    initBars() {
        let bufferLength = 64;
        let barWidth = 2.5,barGap = 0.5;
        this.barGroup = new THREE.Group();
        //this.cubelineGroup = new THREE.Group();
        this.barGroup.name="bars";
        //this.cubelineGroup.name = "barLines";
        let material = new THREE.MeshStandardMaterial( {color: 0x00a1d6} );
        let geometry = new THREE.BoxBufferGeometry( barWidth, barWidth, barWidth );
        
        for(let i = 0; i < bufferLength; i++){
            // let edge = new THREE.EdgesGeometry(geometry);
            // let cubeline = new THREE.LineSegments(edge,new THREE.MeshBasicMaterial({color:0xffffff}));
            let barItem = new THREE.Mesh( geometry, material );
            barItem.name = 'bar'+i;
            barItem.position.set( (i-Math.ceil(bufferLength/2))*(barWidth+barGap),0, 0 );
            //cubeline.position.set( (i-Math.ceil(bufferLength/2))*(barWidth+barGap),1, 1 );
            //this.cubelineGroup.add(cubeline);
            barItem.castShadow = true;
            barItem.receiveShadow = true;
            this.barGroup.add(barItem);
        }
       
        this.scene.add(this.barGroup);
            //this.scene.add(this.cubelineGroup);
        this.camera.position.set( 50, 50, 100 );
        
    }
    drawBar(){
        this.dataArray = new Uint8Array(this.bufferLength);
        this.analyser.getByteFrequencyData(this.dataArray);
        let bars = this.scene.getObjectByName('bars');
        //let lines = this.scene.getObjectByName('barLines');
        for (let i = 0; i < this.bufferLength; i++) {
            let barHeight = this.dataArray[i]/10 +0.5;
            let mesh = bars.children[i];
            //let mesh2 = lines.children[i];
            mesh.scale.y = barHeight;
        }
    }
}

export default audioThree;