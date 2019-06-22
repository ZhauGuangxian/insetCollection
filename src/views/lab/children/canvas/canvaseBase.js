class canvasBase{
    constructor(node){
        this.ctx = null;
        this.canvas = null;
        this.mountNode = node;
        this.contextHeight = 0;
        this.contextWidth = 0;
        
    }

    createContext(){
        if(!this.mountNode){
            return false;
        }
        let width = this.mountNode.offsetWidth;
        let height = this.mountNode.offsetHeight;
        this.canvas = document.createElement('canvas');
        this.contextWidth = this.canvas.width = width;
        this.contextHeight = this.canvas.height = height;
        this.ctx = this.canvas.getContext('2d');
        let ctx = this.ctx;
        
        this.appendContext();
        this.drawMain();
    }
    render(){
        
        
    }
    drawMain(){
        this.ctx.clearRect(0,0,this.contextWidth,this.contextHeight);
        window.requestAnimationFrame(this.drawMain.bind(this));
        
        
        this.render();
    }
    appendContext(){
        
        this.mountNode.appendChild(this.canvas);
    }
}
export default canvasBase