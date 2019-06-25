import canvasBase from '../canvaseBase.js';

class zhihuHome extends canvasBase{
    constructor(node,options){
        super(node,options);
        
        this.grianList = [];
        if(options){
            this.grianNum = option.grainNumber || 12
        }else{
            this.grianNum = 12;
        }
    }
    render(){
        super.render();
        
        this.ctx.fillStyle = '#3880EB';
        this.ctx.beginPath();
        this.grianList.forEach((item,i)=>{
            let{x,y} = item;

            this.ctx.moveTo(x,this.contextHeight-y)
            this.ctx.arc(x,this.contextHeight-y,2,0,2*Math.PI);
            //this.ctx.fillRect(x-1,this.contextHeight-y-1,2,2)
            this.changeState(item);
        })
        this.ctx.closePath();
        this.ctx.fill();
    }
    caculateLine(){
        
    }
    changeState(item){
        let {x,y,directAngel,xMoveFlag,yMoveFlag} = item;
        let offsetX = Math.cos(directAngel)/2,offsetY = Math.sin(directAngel)/2
        item.x = x+offsetX*xMoveFlag;
        item.y = y+offsetY*yMoveFlag;
        if(!(item.x <= this.contextWidth-5&&item.x >= 5)){
            item.xMoveFlag =  item.xMoveFlag*-1;
        }
        if(!(item.y <= this.contextHeight-5 && item.y >= 5)){
            item.yMoveFlag =  item.yMoveFlag*-1;
        }
    }
    appendContext(){
        super.appendContext();
        
    }
    createContext(){
        super.createContext()
        for(let i=0;i<this.grianNum;i++){
           
            let x = 5 +Math.floor(Math.random()*(this.contextWidth - 10));
            let y = 5 +Math.floor(Math.random()*(this.contextHeight - 10));
            let directAngel = (Math.PI*2)*(Math.floor(Math.random()*360)/360)
            let grainItem={
                name:'grian'+i,
                x,
                y:y,
                directAngel,
                xMoveFlag:1,
                yMoveFlag:1
            }
            this.grianList.push(grainItem);
        }
    }
}

export default zhihuHome;