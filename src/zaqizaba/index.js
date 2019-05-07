
var workTable = [
    {
        '工作内容':'c#版本规划选址新增得分图例',
        '紧急程度':'高',
        '难度':'中',
        '计划完成时间':'2019-04-17',
        '进度情况':'已完成，待发布',
        '进度风险':'',
        '备注':'',
        '责任人':'汪玲辉',
    },
    {
        '工作内容':'封装穿梭框（大数据量选取）vue组件',
        '紧急程度':'高',
        '难度':'中',
        '计划完成时间':'2019-04-17',
        '进度情况':'已完成，待发布',
        '进度风险':'',
        '备注':'',
        '责任人':'汪玲辉',
    },
    {
        '工作内容':'实现黑点分析——高铁的界面',
        '紧急程度':'高',
        '难度':'中',
        '计划完成时间':'2019-04-18',
        '进度情况':'已完成，待发布',
        '进度风险':'',
        '备注':'',
        '责任人':'汪玲辉',
    },
    {
        '工作内容':'虚拟路测mtex_弱覆盖路段定位--关闭表格加载完成后默认点击事件',
        '紧急程度':'高',
        '难度':'低',
        '计划完成时间':'2019-04-18',
        '进度情况':'已完成，待发布',
        '进度风险':'',
        '备注':'',
        '责任人':'汪玲辉',
    },
    {
        '工作内容':'区域指标--新增可选择预存区域查找的功能',
        '紧急程度':'高',
        '难度':'中',
        '计划完成时间':'2019-04-18',
        '进度情况':'已完成，待发布',
        '进度风险':'',
        '备注':'',
        '责任人':'汪玲辉',
    }
]



var x = 10;
function F(){
    x = 5;
    console.log(x);
    var x = 15;
    console.log(x)
    console.log(this.x)
}


var EventBus = function(name){
    this.handles = {};
    this.name = name;
}
EventBus.prototype = {
    constructor: EventBus,
    on:function(event,callback){
        if (typeof this.handles[event] == 'undefined'){
            this.handles[event] = [];
        }
        if (this.handles[event].indexOf(callback) <0){
            this.handles[event].push(callback);
        }
    },
    emit:function(event){
        if(this.handles[arguments[0]] instanceof Array){
            for (var i = 0; i < this.handles[arguments[0]].length;i++){
                this.handles[arguments[0]][i](arguments[1]);
            }
        }
    }
}
