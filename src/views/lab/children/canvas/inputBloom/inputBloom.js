import canvasBase from '../canvaseBase.js'
class InputBloom extends canvasBase{
    constructor(node,options){
        super(node);
        let {dotNumber} = options;
        this.input = null;
        this.wordsList = [];
        //{name ,x,y}
        this.renderIndex = 0;
        this.dotNumber = dotNumber || 16;
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
        this.ctx.fillStyle = '#00a1d6';
    }
    render(){
        super.render();
        
        this.ctx.fillRect(this.testOffset,0,10,10);
        this.testOffset++;
        if(this.testOffset == this.contextWidth){
            this.testOffset = 0;
        }
    }
    appendContext(){
        super.appendContext();
       
    }
    bindEvent(){
        
        this.input.addEventListener('input',this.drawNewWord.bind(this))
    }
    drawNewWord(e){
        let value = e.targer.value;

    }
}

export default InputBloom;