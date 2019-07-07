import OrbitControls from 'three-orbitcontrols';

class ThreeBase{

    static getInstance(options) {
        if (!this.instance) {
            ThreeBase.instance = new this(options);
            return this.instance
        }
        return this.instance;
    }
    /**
     * 
     * @param {Object} options | target,width,height,bacoground
     */
    constructor(options){
        if(!options){
            throw new Error('options is required')
        }
        if(!options.target instanceof Element){
            throw new Error('param target must be an Element')
        }
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(options.background || 0x999999);
        this.selfDom = options.target;
        this.contextWidth = options.target.offsetWidth || options.width;
        this.contextHeight = options.target.offsetHeight || options.height;


       

    }
    init(){

        this.camera = new THREE.PerspectiveCamera(45,this.contextWidth/this.contextHeight,0.1,1000);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(this.contextWidth,this.contextHeight);
        this.selfDom.appendChild(this.renderer.domElement);

      
        this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
        this.controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
		this.controls.dampingFactor = 0.25;
		this.controls.screenSpacePanning = false;
		this.controls.minDistance = 100;
		this.controls.maxDistance = 500;
		this.controls.maxPolarAngle = Math.PI / 2;
        this.controls.update();
        this.drawMain()
    }
    stopDraw(){
        window.cancelAnimationFrame(this.animateId)
    }
    
    drawMain(){
        this.animateId = window.requestAnimationFrame( this.drawMain.bind(this) );
        
        this.render();
        
    }
    render(){
        this.renderer.render( this.scene, this.camera );
        this.controls.update();
    }
    close(){
        this.selfDom.remove();
        this.selfDom = null;
        window.cancelAnimationFrame(this.animateId)
    }
}

export default ThreeBase;