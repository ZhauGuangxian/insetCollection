import ThreeBase from '../threeBase.js';

class ThreeDemoTwo extends ThreeBase{
    constructor(options){
        super(options);
    }
    init(){
        super.init();
        let geometry = new THREE.BoxGeometry(30,30,30);
        let edge = new THREE.EdgesGeometry(geometry);
        this.cubeline = new THREE.LineSegments(edge,new THREE.MeshBasicMaterial({color:0xffffff}));
        let mesh = new THREE.MeshNormalMaterial({
            color:0x00a1d6,opacity:0.7,transparent:true
        })
        this.cube = new THREE.Mesh(geometry,mesh);
        this.scene.add(this.cube);
        this.scene.add(this.cubeline);
        //this.camera.position.z = 5;
        this.camera.position.set( 100, 200, 0 );
        
        
        
    }
}

export default ThreeDemoTwo;