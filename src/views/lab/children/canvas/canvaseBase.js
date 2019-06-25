class canvasBase{
    constructor(node,options){
        this.ctx = null;
        this.canvas = null;
        this.mountNode = node;
        this.contextHeight = 0;
        this.contextWidth = 0;
        let {height,width} = this.options = options;
        if(height && typeof height == 'number'){
            this.contextHeight = height;
        }
        if(width && typeof width == 'number'){
            this.contextWidth = width;
        }
    }
    close(){
        this.canvas = null;
        this.ctx = null;
        this.mountNode = null;
    }
    reset(options){
        if(options){
            this.options = options;
        }
        this.canvas.remove();
        this.ctx = null;
        this.stopRender();
        this.createContext()
    }
    createContext(){
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
}
export default canvasBase