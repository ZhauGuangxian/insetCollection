/*
 * @Author: gaigai
 * @Date: 2019-09-10 09:43:49
 * @LastEditors: gaigai
 * @LastEditTime: 2019-09-10 10:22:00
 * @Description: 
 * @Email: 1054257376@qq.com
 * @habit: carton girl
 */
import canvasBase from '../canvaseBase';
class BallPool extends canvasBase{
    constructor(node, options){
        super(node, options);
        this.BallList = [];
        this.BOX_WIDTH =  200;
        this.BOX_HEIGHT = 400;
        this.ctx.lineWidth = 3;
        this.ctx.strokeStyle = '#00a1d6';
        this.ballSpeed = 1;
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
        let len = this.BallList.length;
        
        for(let i=0;i<len;i ++) {
            const ball = this.BallList[i];
            let {x,y,color,radius} = ball;
            for(let c = i+1; c< len; c++) {
                let ballC = this.BallList[c];
                let cx = ballC.x,cy = ballC.y;
                let dx = Math.abs(x-cx);
                let dy = Math.abs(y-cy);
                let dl = Math.sqrt(dx * dx + dy * dy);
                

                if(dl <= radius + ballC.radius) {
                    const angel = Math.atan(dy / dx);
                    if(x < cx) {
                        ball.x -= Math.cos(angel) * 1;
                        ballC.x += Math.cos(angel) * 1;
                    } else {
                        ball.x += Math.cos(angel) * 1;
                        ballC.x -= Math.cos(angel) * 1;
                    }
                    if(y < cy) {
                        ball.y -= Math.sin(angel) * 1;
                        ballC.y += Math.sin(angel) * 1;
                    } else {
                        ball.y += Math.sin(angel) * 1;
                        ballC.y -= Math.sin(angel) * 1;
                    }
                }
            }
            
            this.ctx.beginPath();
            this.ctx.moveTo(x,y)
            this.ctx.arc(x,y,radius,0,Math.PI * 2);
            this.ctx.fillStyle = color;
            this.ctx.fill();
            this.ctx.closePath();
            if(ball.y <  (this.contextHeight + this.BOX_HEIGHT) / 2) {
                ball.y += this.ballSpeed;

            }
        }
        this.ballSpeed+=0.15;
        if(this.ballSpeed > 4) {
            this.ballSpeed = 4;
        }
    }
    render(){
        super.render();
        this.renderBox();
        this.renderBalls();
    }
}

export default BallPool;