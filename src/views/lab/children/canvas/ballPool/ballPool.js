/*
 * @Author: gaigai
 * @Date: 2019-09-10 09:43:49
 * @LastEditors: gaigai
 * @LastEditTime: 2019-10-11 19:38:50
 * @Description:
 * @Email: 1054257376@qq.com
 * @habit: carton girl
 */
import canvasBase from '../canvaseBase';
class BallPool extends canvasBase {
  constructor(node, options) {
    super(node, options);
    console.log(options);
    this.BallList = [];
    this.BOX_WIDTH = 200;
    this.BOX_HEIGHT = 400;
    this.ctx.lineWidth = 3;
    this.ctx.strokeStyle = '#00a1d6';
    this.ballSpeed = 1;
  }

  initBalls() {
    let beginX = (this.contextWidth - this.BOX_WIDTH) / 2 - 10;
    let endX = (this.contextWidth + this.BOX_WIDTH) / 2 + 10;
    const beginY = (this.contextHeight - this.BOX_HEIGHT) / 2;
    const endY = (this.contextHeight + this.BOX_HEIGHT) / 2;
    let len = this.options.ballNum || 30;
    for (let i = 0; i < len; i++) {
      let radius = 5 + Math.floor(Math.random() * 5);
      let r = 100 + Math.floor(Math.random() * 50);
      let g = 100 + Math.floor(Math.random() * 100);
      let b = 100 + Math.floor(Math.random() * 130);
      let startX = beginX + Math.ceil(Math.random() * (endX - beginX));
      let startY = beginY + Math.ceil(Math.random() * 40);
      let item = {
        radius,
        color: `rgb(${r},${g},${b})`,
        startX,
        startY,
        x: startX,
        y: startY,
        down: false
      };
      this.BallList.push(item);
    }
  }
  init() {
    this.initBalls();
    const left = (this.contextWidth - this.BOX_WIDTH) / 2;
    const right = (this.contextWidth + this.BOX_WIDTH) / 2;
    const bottom = (this.contextHeight + this.BOX_HEIGHT) / 2;
    const top = (this.contextHeight - this.BOX_HEIGHT) / 2;
    this.boxLT = {x: left - 50, y: top};
    this.boxLB = {x: left + 50, y: bottom};
    this.boxRB = {x: right - 50, y: bottom };
    this.boxRT = {x: right + 50, y: top};
        // 框的角度
    this.boxAngel = Math.atan(Math.abs(bottom - top) / 100);
    super.init();
  }
  renderBox() {
    this.ctx.beginPath();

    this.ctx.moveTo(this.boxLT.x, this.boxLT.y);
    this.ctx.lineTo(this.boxLB.x, this.boxLB.y);
    this.ctx.lineTo(this.boxRB.x, this.boxRB.y);
    this.ctx.lineTo(this.boxRT.x, this.boxRT.y);
    this.ctx.stroke();
    this.ctx.closePath();
  }
  judgeOut(x, y, radius) {
    if ((x > this.boxLT.x && x < this.boxLB.x) || (x > this.boxLT.x && x < this.boxLB.x)) {
      let dx = Math.abs(x - this.boxLB.x);
      if (x > this.boxLT.x && x < this.boxLB.x) {
        dx = Math.abs(x - this.boxRB.x);
      }
      let dy = Math.abs(y - this.boxLB.y);
      let angelL = Math.atan(dy / dx);
                // 长边的长
      let dis = Math.sqrt(dx * dx + dy * dy);
      angelL = Math.abs(this.boxAngel - angelL);
                // 圆心到边界的距离
      let dis2 = dis * Math.sin(angelL);
      if (dis2 < radius) {
        return true;
      }
    }

    if (y + radius >= this.boxLB.y - this.boxLT.y) {
      return true;
    }

    return false;
  }
  backFromOut(ball) {
    debugger;
    let {x, y, radius, angel} = ball;
    // srtan_x, stand_y 桶两边的标准x,y
    const stand_y = this.boxLB.y - y;
    let stand_x;
    // 左边
    if (x < this.contextWidth / 2) {
      stand_x = this.boxLB.x - stand_y / Math.tan(angel);
      x = radius * Math.cos(angel) + stand_x;
    } else {
      stand_x = this.boxRB.x + stand_y / Math.tan(angel);
      x = stand_x - radius * Math.cos(angel);
    }
  }
  renderBalls() {
    let len = this.BallList.length;
    for (let i = 0; i < len; i++) {
      const ball = this.BallList[i];
      let {x, y, color, radius} = ball;
            // 判断球是否和边界碰撞 start

      if (!ball.angel) {
                // debugger;
        if (x > this.boxLT.x && x < this.boxLB.x) { // 在左边
          let dx = Math.abs(x - this.boxLB.x);
          let dy = Math.abs(y - this.boxLB.y);
          let angelL = Math.atan(dy / dx);
                    // 长边的长
          let dis = Math.sqrt(dx * dx + dy * dy);
          angelL = Math.abs(this.boxAngel - angelL);
                    // 圆心到边界的距离
          let dis2 = dis * Math.sin(angelL);
          if (dis2 < radius) {
            ball.angel = this.boxAngel;
            ball.dir = 1;
          }
        }
        if (x > this.boxRB.x && x < this.boxRT.x) { // 在右边
          let dx = Math.abs(this.boxRB.x - x);
          let dy = Math.abs(y - this.boxRB.y);
          let angelL = Math.atan(dy / dx);
                    // 长边的长
          let dis = Math.sqrt(dx * dx + dy * dy);
          angelL = Math.abs(this.boxAngel - angelL);
                    // 圆心到边界的距离
          let dis2 = dis * Math.sin(angelL);
          if (dis2 < radius) {
            ball.angel = this.boxAngel;
            ball.dir = -1;
          }
        }
      }


            // 判断球是否和边界碰撞 end
      for (let c = i + 1; c < len; c++) {
        let ballC = this.BallList[c];
        let cx = ballC.x, cy = ballC.y;
        let dx = Math.abs(x - cx);
        let dy = Math.abs(y - cy);
        let dl = Math.sqrt(dx * dx + dy * dy);
        const ballOut = this.judgeOut(ball.c, ball.y, ball.radius);
        const ballCOut = this.judgeOut(ballC.c, ballC.y, ballC.radius);
                // 判断球和球之间是否碰撞
        if (dl <= radius + ballC.radius) {
          const angel = Math.atan(dy / dx);
          if (x < cx) {
            if (ballOut === false) {
              ball.x -= Math.cos(angel) * 1;
            } else {
              this.backFromOut(ball);
            }
            if (ballCOut === false) {
              ballC.x += Math.cos(angel) * 1;
            } else {
              this.backFromOut(ballC);
            }
          } else {
            if (ballOut === false) {
              ball.x += Math.cos(angel) * 1;
            } else {
              this.backFromOut(ball);
            }
            if (ballCOut === false) {
              ballC.x -= Math.cos(angel) * 1;
            } else {
              this.backFromOut(ballC);
            }

              // ball.x += Math.cos(angel) * 1;

              // ballC.x -= Math.cos(angel) * 1;
          }
          if (y < cy) {
            if (ballOut === false) {
              ball.y -= Math.sin(angel) * 1;
            } else {
              this.backFromOut(ball);
            }
            if (ballCOut === false) {
              ballC.y += Math.sin(angel) * 1;
            } else {
              this.backFromOut(ballC);
            }

              // ball.y -= Math.sin(angel) * 1;

              // ballC.y += Math.sin(angel) * 1;
          } else {
            if (ballOut === false) {
              ball.y += Math.sin(angel) * 1;
            } else {
              this.backFromOut(ball);
            }
            if (ballCOut === false) {
              ballC.y -= Math.sin(angel) * 1;
            } else {
              this.backFromOut(ballC);
            }
              // ball.y += Math.sin(angel) * 1;

              // ballC.y -= Math.sin(angel) * 1;
          }
        }
      }

      this.ctx.beginPath();
      this.ctx.moveTo(x, y);
      this.ctx.arc(x, y, radius, 0, Math.PI * 2);
      this.ctx.fillStyle = color;
      this.ctx.fill();
      this.ctx.closePath();

      if (ball.y < (this.contextHeight + this.BOX_HEIGHT) / 2 - radius) {
        ball.y += this.ballSpeed;
        if (ball.angel) {
          let offsetX = this.ballSpeed * Math.cos(this.boxAngel);
          ball.x += ball.dir * offsetX;
        }
      } else {
        ball.done = true;
      }
    }
    this.ballSpeed += 0.15;
    if (this.ballSpeed > 3) {
      this.ballSpeed = 3;
    }
  }
  render() {
    super.render();
    this.renderBox();
    this.renderBalls();
  }
  reset() {
    this.BallList = [];
    this.ballSpeed = 1;

    super.reset();
  }
}

export default BallPool;
