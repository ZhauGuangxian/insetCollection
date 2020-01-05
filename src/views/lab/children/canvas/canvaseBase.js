/*
 * @Author: gaigai
 * @Date: 2019-07-24 09:19:53
 * @LastEditors: gaigai
 * @LastEditTime: 2019-08-09 14:29:14
 * @Description: 
 * @Email: 1054257376@qq.com
 * @habit: carton girl
 */
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
            this.options = options;
            let {height,width} = options;
            if(height && typeof height == 'number'){
                this.contextHeight = height;
            }
            if(width && typeof width == 'number'){
                this.contextWidth = width;
            }
        }else{
            this.options = {};
        }

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
        
        this.init()
    }
    init(){
        
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