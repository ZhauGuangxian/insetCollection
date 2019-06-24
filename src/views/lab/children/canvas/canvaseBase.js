class canvasBase{
    constructor(node,options){
        this.ctx = null;
        this.canvas = null;
        this.mountNode = node;
        this.contextHeight = 0;
        this.contextWidth = 0;
        let {height,width} = options;
        if(height && typeof height == 'number'){
            this.contextHeight = height;
        }
        if(width && typeof width == 'number'){
            this.contextWidth = width;
        }
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
        window.requestAnimationFrame(this.drawMain.bind(this));
        
        
        
    }
    appendContext(){
        
        this.mountNode.appendChild(this.canvas);
    }
}
export default canvasBase