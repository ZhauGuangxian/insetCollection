class canvasBase{
    constructor(){
        this.ctx = null;
        this.canvas = null;
    }

    createContext(node,id){
        let width = node.offsetWidth;
        let height = node.offsetHeight;
        this.canvas = document.createElement('canvas');
        this.canvas.width = width;
        this.canvas.height = height;
        this.ctx = this.canvas.getContext('2d');
        let ctx = this.ctx;
        ctx.fillStyle = "rgb(200,0,0)";
        ctx.fillRect (10, 10, 55, 50);

        ctx.fillStyle = "rgba(0, 0, 200, 0.5)";
        ctx.fillRect (30, 30, 55, 50);
    }
}
export default canvasBase