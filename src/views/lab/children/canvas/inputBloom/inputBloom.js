import canvasBase from '../canvaseBase.js'

class InputBloom extends canvasBase{
    constructor(node,options){
        super(node);
        let {dotNumber} = options;
        this.input = null;
        this.wordsList = [];
        //{name ,x,y}
        this.renderIndex = 0;
        this.dotNumber = dotNumber || 12;
        this.testOffset = 0;
    }
    createContext(){
        super.createContext();
        this.input = this.mountNode.querySelector('input');
        if(!(this.input instanceof Element && (this.input.nodeName === 'INPUT' || this.input.nodeName === 'TEXTAREA'))){
            throw new Error('can not find input element');
        }else{
            this.input.style.fontSize = '12px';
            this.input.style.paddingLeft = '5px';
            this.ctx.font = '12px'
        }
        this.ctx.fillStyle = '#fff';
        this.bindEvent();
        //this.contextHeight = this.canvas.height = 100;
        window.c = this.ctx;
    }
    render(){
        super.render();
        
        for(let i=0;i<this.wordsList.length;i++){
            let item = this.wordsList[i];
      
            if(item[0].currentEtc == 24){
                this.wordsList.splice(i,1);
                i--;
                break;
            }
            for(let c=0;c<item.length;c++){
                let dot = item[c];
                let {x,y} = dot;
                this.ctx.fillRect(x,y,1,1);
                this.changeWordsState(dot);//效果不太好看，换一个
            }
        }
        //this.ctx.save()
    }
    changeWordsState(obj){
       
        
        let{x,currentEtc,number,originY,growStop} = obj;
        let newX,newY;
        let xDirect = number%2 == 0?1:-1;
        if(currentEtc <=growStop){
            newY = originY-currentEtc/2;
            newX = x;
        }else{
            let getY = function(R,X){
                return Math.pow(R/2,2)-Math.pow((X-R)/2,2)
            }
            let ratio = Math.ceil(number/2);
           
            newY = this.contextHeight - (originY+(growStop/2) + getY(ratio,(currentEtc+1)/2));
            newX = x + xDirect/2;
        }
       
        obj.x = newX;
        obj.y = newY;
        obj.currentEtc = currentEtc+1;
       
    }
    appendContext(){
        super.appendContext();
        
        
    }
    bindEvent(){
        
        this.input.addEventListener('input',this.drawNewWord.bind(this))
    }
    drawMain(){
        super.drawMain();
        
    }
    drawNewWord(e){
        let value = e.target.value;
        
        //TODO 用e.target.到left-border的距离判断offseX，
        let code = document.createElement('code');
        code.innerHTML = value;
        document.body.appendChild(code);
        let txtWidth = code.offsetWidth;
        code.remove();
        

        this.generateWordData(txtWidth + 5);
    }
    generateWordData(offsetX){
        
        let arr = [],ox,oy
        for(let i=0;i<this.dotNumber;i++){
           
            ox = offsetX+( Math.floor(Math.random()*6) - 6);
            oy  = this.contextHeight/2 +Math.floor(Math.random()*6) - 6;
            arr.push({
                x:ox,
                y:oy,
                number:i+1,
                currentEtc:1,
                growStop:10+Math.floor(Math.random()*8),
                originX:ox,
                originY:oy
            })
            console.log(offsetX+'and'+ox)
        }
        this.wordsList.push(arr);
    }
}

export default InputBloom;