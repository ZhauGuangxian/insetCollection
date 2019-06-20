class canvasBase{
    constructor(node){
        this.ctx = null;
        this.canvas = null;
        this.mountNode = node;
    }

    createContext(){
        if(!this.mountNode){
            return false;
        }
        let width = this.mountNode.offsetWidth;
        let height = this.mountNode.offsetHeight;
        this.canvas = document.createElement('canvas');
        this.canvas.width = width;
        this.canvas.height = height;
        this.ctx = this.canvas.getContext('2d');
        let ctx = this.ctx;
        ctx.fillStyle = "rgb(200,0,0)";
        ctx.fillRect (10, 10, 55, 50);

        ctx.fillStyle = "rgba(0, 0, 200, 0.5)";
        ctx.fillRect (30, 30, 55, 50);
        this.appendContext();
    }
    appendContext(){
        
        this.mountNode.appendChild(this.canvas);
    }
}
export default canvasBase