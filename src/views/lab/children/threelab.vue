<template>
    <div>
        <p>ThreeHome</p>
        <el-button @click="cameraPM">camera</el-button>
        <div class="context" ref="ThreeContext"></div>
    </div>
</template>

<script>
import * as THREE from 'three';
import {Button} from 'element-ui';
import OrbitControls from 'three-orbitcontrols';
export default {
    name:'ThreeHome',
    components:{
        'el-button':Button
    },
    data(){
        return {
            scene:null,
            camera:null,
            renderer:null,
            cube:null,
            cubeline:null,
            initX:0,
            initY:0,
            cameraMovedX:0,
            cameraMovedY:0,
            MouseDownActive:false
        }
    },
  
    mounted(){
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xcccccc)
        this.camera = new THREE.PerspectiveCamera(75,this.$refs.ThreeContext.offsetWidth/this.$refs.ThreeContext.offsetHeight,0.1,1000);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize( this.$refs.ThreeContext.offsetWidth, this.$refs.ThreeContext.offsetHeight );
        this.$refs.ThreeContext.appendChild(this.renderer.domElement );
        const geometry = new THREE.BoxGeometry(10,10,10);
        const edge = new THREE.EdgesGeometry(geometry);
        this.cubeline = new THREE.LineSegments(edge,new THREE.MeshBasicMaterial({color:0xffffff}));
        const mesh = new THREE.MeshNormalMaterial({
            color:0x00a1d6,opacity:0.7,transparent:true
        })
        this.cube = new THREE.Mesh(geometry,mesh);
        this.scene.add(this.cube);
        this.scene.add(this.cubeline);
        //this.camera.position.z = 5;
        this.camera.position.set( 400, 200, 0 );
        this.controls = new OrbitControls(this.camera,this.$refs.ThreeContext);
        this.controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
		this.controls.dampingFactor = 0.25;
		this.controls.screenSpacePanning = false;
		this.controls.minDistance = 100;
		this.controls.maxDistance = 500;
		this.controls.maxPolarAngle = Math.PI / 2;
        this.animating();
        this.controls.update();

        console.log(this.scene.position)
    },
    methods:{
        cameraPM(){
            console.log(this.camera.position);
            this.camera.position.x+=0.2;
            this.camera.position.y+=0.2;
            this.camera.position.z+=0.2;
        },
        handleMouseUp(){
            this.MouseDownActive = false;
            this.cameraMovedY = 0;
            this.cameraMovedX = 0;
        },
        handleMouseDown(event){
            //console.log(event)
            this.$data.MouseDownActive = true;
            this.initX = event.offsetX;
            this.initY = event.offsetY;
        },
        handleMouseMove(event){
            //this.cameraMoving = true;
            if(!this.$data.MouseDownActive){
                return;
            }
            this.cameraMovedX = event.offsetX - this.initX
            this.cameraMovedY = event.offsetY - this.initY
        },
        animating(){
            requestAnimationFrame(this.animating);
           /* this.cube.rotation.x += 0.01;
            this.cube.rotation.y += 0.01;   
            this.cubeline.rotation.x += 0.01;
            this.cubeline.rotation.y += 0.01; */
            //this.camera.position.x += (this.cameraMovedX  * 0.05);
            //this.camera.position.y += (this.cameraMovedY * 0.05);
            //this.camera.lookAt(this.$data.scene.position)
            this.controls.update();
            this.renderer.render(this.scene,this.camera);
            
        }
    }
}
</script>

<style lang="less">
.context{
    height:90vh;
    
}
</style>
