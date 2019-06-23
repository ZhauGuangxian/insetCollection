import canvasBase from '../canvaseBase.js'
import { Footer } from 'element-ui';
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
        this.ctx.contextHeight = 500;
        window.c = this.ctx;
    }
    render(){
        super.render();
        
        for(let i=0;i<this.wordsList.length;i++){
            let item = this.wordsList[i];
            if(item[0].cuuuentEtc == 16){
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
        let getY = function(R,X){
            return Math.pow(R/2,2)-Math.pow((X-R)/2,2)
        }
        let{x,cuuuentEtc,number,originY} = obj;
        let ratio = Math.ceil(number/2);
        let xDirect = number%2 == 0?1:-1;
        let newY = this.contextHeight - (originY + getY(ratio,cuuuentEtc+1));
        let newX = x + xDirect;
        
        obj.x = newX;
        obj.y = newY;
        obj.cuuuentEtc = cuuuentEtc+1;
       
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
        let rand = Math.floor(Math.random())*6 - 3;
        let arr = [];
        for(let i=0;i<this.dotNumber;i++){
            let x = offsetX;
            
            arr.push({
                x:x+rand,
                y:this.contextHeight/2,
                number:i+1,
                cuuuentEtc:1,
                originX:x+rand,
                originY:this.contextHeight/2
            })
        }
        this.wordsList.push(arr);
    }
}

export default InputBloom;