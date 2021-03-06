class zhihuHome extends canvasBase{
    constructor(node,options){
        super(node,options);
        //多少距离时才显示连线
        this.showLineDistance = (options||{}).distance || 60
        this.grianList = [];
        if(options){
            this.grianNum = options.grainNumber || 12
        }else{
            this.grianNum = 12;
        }
        this.lineMap = new Map();
    }
    render(){
        super.render();
        this.caculateLine();
        this.ctx.fillStyle = '#3880EB';
        this.ctx.beginPath();
        this.grianList.forEach((item,i)=>{
            let{x,y} = item;

            this.ctx.moveTo(x,this.contextHeight-y)
            this.ctx.arc(x,this.contextHeight-y,2,0,2*Math.PI);
            this.ctx.fillRect(x-1,this.contextHeight-y-1,2,2)
            this.changeState(item);
        })
        this.ctx.closePath();
        this.ctx.fill();

        this.ctx.strokeStyle = "#ddd"
        for(let value of this.lineMap.values()){
            this.ctx.beginPath();
            let {from,to} = value;
            this.ctx.moveTo(from.x,this.contextHeight - from.y);
            this.ctx.lineTo(to.x,this.contextHeight - to.y);
            
            this.ctx.stroke();
            this.ctx.closePath();
        }
    }
    caculateLine(){
        let getDistance = (a,b)=>{
            if(!a || !b){
                console.error('粒子数据的格式有问题')
                return
            }
            let X = parseInt(a.x-b.x);
            let Y = parseInt(a.y-b.y);
            return Math.sqrt(Math.pow(X,2)+Math.pow(Y,2))
        }
        let len = this.grianList.length;

        this.lineMap.clear();
        for(let i=0;i<len-1;i++){
            let dot1 = this.grianList[i];
            for(let c=i+1;c<len;c++){
                let dot2 = this.grianList[c];

                let distance = getDistance(dot1,dot2);

                if(distance <=this.showLineDistance){
                    let key = dot1.name + '-' + dot2.name;
                    let param = {
                        from:{
                            x:dot1.x,
                            y:dot1.y
                        },
                        to:{
                            x:dot2.x,
                            y:dot2.y
                        }
                    }
                    this.lineMap.set(key,param);
                }
            }
        }
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
    init(){
        super.init()
        for(let i=0;i<this.grianNum;i++){
           
            let x = 5 +Math.floor(Math.random()*(this.contextWidth - 10));
            let y = 5 +Math.floor(Math.random()*(this.contextHeight - 10));
            let directAngel = (Math.PI*2)*(Math.floor(Math.random()*360)/360);  //随机移动角度
            let grainItem={
                name:'grian'+i,
                x,
                y,
                directAngel,
                xMoveFlag:1,
                yMoveFlag:1
            }
            this.grianList.push(grainItem);
        }
    }
}

export default zhihuHome;