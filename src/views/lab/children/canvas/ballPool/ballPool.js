import canvasBase from '../canvaseBase';
class BallPool extends canvasBase{
    constructor(node, options){
        super(node, options);
        this.BallList = [];
        this.BOX_WIDTH =  200;
        this.BOX_HEIGHT = 400;
        this.ctx.lineWidth = 3;
        this.ctx.strokeStyle = '#00a1d6';
    }

    initBalls(){
        let beginX = (this.contextWidth - this.BOX_WIDTH) / 2 - 10;
        let endX = (this.contextWidth + this.BOX_WIDTH) / 2 + 10;
        const beginY = (this.contextHeight - this.BOX_HEIGHT) / 2;
        const endY = (this.contextHeight + this.BOX_HEIGHT) / 2;
        let len = this.options.ballNum || 30;
        for(let i = 0;i < len;i ++) {
            let radius = 5 +  Math.floor(Math.random() * 5);
            let r = 100 + Math.floor(Math.random() * 50);
            let g =  100 + Math.floor(Math.random() * 100);
            let b =  100 + Math.floor(Math.random() * 130);
            let startX = beginX + Math.ceil(Math.random() * (endX - beginX));
            let startY =  beginY + Math.ceil(Math.random() * 40);
            let item = {
                radius,
                color: `rgb(${r},${g},${b})`,
                startX,
                startY,
                x: startX,
                y: startY
            };
            this.BallList.push(item);
        }
    }
    init(){
        this.initBalls();
        super.init();
    }
    renderBox() {
        const left = (this.contextWidth - this.BOX_WIDTH) / 2;
        const right = (this.contextWidth + this.BOX_WIDTH) / 2;
        const bottom = (this.contextHeight + this.BOX_HEIGHT) / 2;
        const top = (this.contextHeight - this.BOX_HEIGHT) / 2;
        this.ctx.beginPath();
        
        this.ctx.moveTo(left - 50, top);
        this.ctx.lineTo(left + 50, bottom);
        this.ctx.lineTo(right - 50, bottom);
        this.ctx.lineTo(right + 50,top);
        this.ctx.stroke();
        this.ctx.closePath();
    }
    renderBalls() {
        const len = this.BallList.length;
        
        for(let i=0;i<len;i ++) {
            const ball = this.BallList[i];
            const {x,y,color,radius} = ball;
            this.ctx.beginPath();
            this.ctx.moveTo(x,y)
            this.ctx.arc(x,y,radius,0,Math.PI * 2);
            this.ctx.fillStyle = color;
            this.ctx.fill();
            this.ctx.closePath();
        }
    }
    render(){
        super.render();
        this.renderBox();
        this.renderBalls();
    }
}

export default BallPool;