class canvasBase{
    constructor(node,options){
        // options.picUrl 背景图
        // options.indistinct 是否模糊背景
        // options.
        this.ctx = null;
        this.canvas = null;
        this.mountNode = node;
        this.contextHeight = 0;
        this.contextWidth = 0;
        if(options){

            let {height,width} = this.options = options;
            if(height && typeof height == 'number'){
                this.contextHeight = height;
            }
            if(width && typeof width == 'number'){
                this.contextWidth = width;
            }
        }else{
            this.options = {};
        }
    }
    close(){
        this.stopRender();
        this.canvas = null;
        this.ctx = null;
        this.mountNode = null;
    }
    reset(options){
        if(options){
            this.options = options;
        }
        this.stopRender();
        this.canvas.remove();
        this.ctx = null;
        this.init()
    }
    init(){
        if(!this.mountNode){
            return false;
        }
        let width = this.mountNode.offsetWidth;
        let height = this.mountNode.offsetHeight;
        this.canvas = document.createElement('canvas');
        if(this.contextHeight == 0){
            this.contextHeight = this.canvas.height = height;
        }else{
            this.canvas.height = this.contextHeight;
        }
        
        if(this.contextWidth == 0){
            this.contextWidth = this.canvas.width = width;
        }else{
            this.canvas.width = this.contextWidth;
        }
        
        this.ctx = this.canvas.getContext('2d');
        
        window.c = this.ctx;
        this.appendContext();
        this.drawMain();
    }
    render(){
        this.ctx.clearRect(0,0,this.contextWidth,this.contextHeight);
        
    }
    drawMain(){
        this.render();
        this.animaReq = window.requestAnimationFrame(this.drawMain.bind(this));
    }
    stopRender(){
        window.cancelAnimationFrame(this.animaReq)
    }
  
    appendContext(){
        
        this.mountNode.appendChild(this.canvas);
    }
    resize(){
        this.contextHeight = this.mountNode.offsetHeight;
        this.contextWidth = this.mountNode.offsetWidth;
        this.canvas.width = this.contextWidth;
        this.canvas.height = this.contextHeight;
    }
}
export default canvasBase;