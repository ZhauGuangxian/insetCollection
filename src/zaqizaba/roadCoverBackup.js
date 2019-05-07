/* Author: zhangrong
*  Time: 2019-03-22
*  Description: 黑点问题分析
*/
// import html from "../../../html/plugin/darkSpot/darkSpotAnalysis/darkSpotAnalysis.html";
import html from "../../../html/appModule/layout/tab3gridNgis1.html";
class AppModule extends AppSearchEs6Base {
    constructor() {
        super();
        this.html = html;
        this.ready=["ThreeMapUtil"];
        this.countScenes="道路"; //统计场景
        this.appType="路段"; //应用
        this.transform1 = [
            { fieldname: "黑点ID", template: "<a class=\"dark-spot__intAnalysis\" style=\"cursor: pointer;\" title=\"智能分析该黑点\" >{{row['黑点ID']}}</a>" }
        ];
        this.transform4 = [
            { fieldname: "小区名称", template: "<a class=\"dark-spot__proCheck\" style=\"cursor: pointer;\" title=\"小区体检\" >{{row['小区名称']}}</a>" }
        ];
        this.problemType = '弱覆盖';
    }
    init(appId, appModuleId, param){
        super.init(appId, appModuleId, param);
    }
    /* 重载添加监听方法（界面构造完成后触发）
     *  参数：无
     */
    addListener() {
        //每次进来自动触发
        //执行父的addListener方法
        super.addListener();
        //然后再添加自己的监听
        this.grid1.setListener("rowClickFun", this.grid1CellClick.bind(this));
        this.grid2.setListener("rowClickFun", this.grid2CellClick.bind(this));
        this.grid3.setListener("rowClickFun", this.grid3CellClick.bind(this));
        this.grid4.setListener("rowClickFun", this.grid4CellClick.bind(this));

        this.grid1.setListener("rowDatasLoadedFun", this.rowDataLoaded1.bind(this));
        this.grid2.setListener("rowDatasLoadedFun", this.rowDataLoaded2.bind(this));
        this.grid3.setListener("rowDatasLoadedFun", this.rowDataLoaded3.bind(this));

        //智能分析跳转
        $("#" + this.appModuleId + " #grid1" + this.keycode).on("click", ".dark-spot__intAnalysis", this.gotoIntelligentAnalysis.bind(this));
        //小区体检跳转
        $("#" + this.appModuleId + " #grid4" + this.keycode).on("click", ".dark-spot__proCheck", this.gotoCellCheck.bind(this));
        this.queryToIntelligent();
        this.initCustomSelect()
        /*Modified by wanglinghui at 2019-04-26 start*/
        //选择竞对时 隐藏问题点小区tab
        $('#search1' + this.keycode +' input[data-bind-key="问题类型"]').on('change',function(e){
            console.log(e.target.value)
        })
        console.log(this.selectUtil)
    }
    //modified by wanglinghui at 2019-04-26 初始化下拉选项 
    initCustomSelect(){
        var id = "region_" + this.appModuleId + this.keycode;
        $('#search1' + this.keycode + ' div[data-bind-key="问题类型"]').html("<input type=\"text\" class=\"mt-input\" style=\"width:100%;\" id=\"" +
        id + "\">")
        let mockList = [
            {'name': "弱覆盖", 'value': "弱覆盖"},
      
         {'name': "语音", 'value': "语音"},
            {'name': "竞对", 'value': "竞对"}
        ]
        selectUtil.init(id,mockList,'弱覆盖',{mode:1,filter:false,changeCallback:function(e){
            this.problemType = e.attr('data-item-value');
            if(this.problemType == '竞对'){
                $('#tab3' + this.keycode + ' .mttab__panel[data-tab-name="问题点小区"]').hide();
                //mttab__top 
                $('#tab3' + this.keycode + ' .mttab__top>div[title="问题点小区"]').hide();
            }else{
                $('#tab3' + this.keycode + ' .mttab__panel[data-tab-name="问题点小区"]').show();
                //mttab__top 
                $('#tab3' + this.keycode + ' .mttab__top>div[title="问题点小区"]').show();
            }
        }.bind(this)})
    }
    //查询是否有智能分析
    queryToIntelligent(){
        remoteAjaxUtil.query("/cda/darkSpot/darkSpotAnalysis/queryConfigType",
            this.queryToIntelligentSuccess.bind(this), this.remoteFault.bind(this),
            { cityId: frameService.citySelected.now.id, searchSt: this.countScenes });
    }
    queryToIntelligentSuccess(result){
        if (result && result.type === appConfig.RESULTDATA_TYPE_INFO) {
           let toIntelligentRecord={};
           for(let item of result.data.data){
                toIntelligentRecord[item["问题类型"]]=item["是否有智能分析"];
           }
           this.toIntelligentRecord=toIntelligentRecord;
        } else {
            systemUtil.popupMessage("提示", result.message, result.errorMessage);
        }
    }
    /* 重载添加激活事件方法（界面无论是新打开还是重新打开，都触发此方法，目前主要为Gis监听使用）
    *  参数：无
    */
    addActivateListener() {
        //执行父的addListener方法
        super.addActivateListener();
        //然后再添加自己的监听

        if(this.tileSearchSt){
            this.renderDarkSpot();
        }

        this.gis1.darkSpotTool.corl.onDarkSpotClickChoice.addEvent("dsClick", this.darkSpotClick.bind(this));
    };
    /* 重载按钮点击事件（界面构造完成后触发）
    *  参数：
    *    event：事件
    */
   btnItemClick($btn) {
    //如果验证不通过
        if (!this.validate($btn)) {
            return;
        }     
        let date = new Date();
        this.timeSt = date.format("yyyyMMDDHHmmss") + this.prefixInteger(date.getMilliseconds(), 3);
        this.searchSt = `问题类型#${this.problemType}|`+ this.searchCom.getItemsValue("search1" + this.keycode);
        this.issueType=$("#" + this.appModuleId).find("input[data-bind-key='问题类型']").attr("data-item-value");
        let key = $btn.attr("data-bind-key");
        switch (key) {
            case "Search":
                this.getList();
                break;
            case "base2":
                break;
            default:
                break;
        }
    };
    prefixInteger(num, length) {
        return (Array(length).join("0") + num).slice(-length);
    };
    //存储过程名称加密
    toEncode(proc){
        let mtCoder = new MTB64Coder();
        let procStr = mtCoder.encodeM2(proc);
        return procStr;
    }
    getList() {
        systemUtil.popupLoading(true, $("#" + this.appModuleId), "正在查询数据，请稍候...");
        let searchSt=this.searchSt+"查询标签#"+this.timeSt+"|统计场景#"+this.countScenes+"|";
        this.pointStr=this.gisAreaPointSt1;
        remoteAjaxUtil.query("/cda/darkSpot/darkSpotAnalysis/queryAttributeList",
            this.getListSuccess.bind(this), this.remoteFault.bind(this),
            { cityId: frameService.citySelected.now.id, searchSt: searchSt, areaPointSt: this.gisAreaPointSt1 });
    }
    getListSuccess(result){
        systemUtil.popupLoading(false, $("#" + this.appModuleId));
        if (result && result.type === appConfig.RESULTDATA_TYPE_INFO) {
            this.grid1.setAllDatas({ format: result.data.format, transform: this.transform1 }, result.data.list);
            this.grid2.setAllDatas({ format: "待查询$$160$$l$$$$$$$@" }, []);
            this.grid3.setAllDatas({ format: "待查询$$160$$l$$$$$$$@" }, []);
            this.grid4.setAllDatas({ format: "待查询$$160$$l$$$$$$$@" }, []);
            this.renderDarkSpot();//渲染黑点
        } else {
            systemUtil.popupMessage("提示", result.message, result.errorMessage);
        }
    }
    //渲染黑点
    renderDarkSpot() {
        if (!this.gis1.darkSpotTool.Group) {
            this.gis1.darkSpotTool.init();
        }
        this.gis1.darkSpotTool.removeDarkSpot(); //移除先前的

        let searchSt=this.searchSt+"查询标签#"+this.timeSt+"|统计场景#"+this.countScenes+"|";
        this.tileSearchSt=searchSt; //记录tile查询条件

        this.gis1.sceneTool.setExtOption(this.tileSearchSt); //设置地图条件
        if (this.pointStr) {
            this.gis1.darkSpotTool.corl.tileNeedLoad = false;
            remoteAjaxUtil.query("/cda/darkSpot/darkSpotAnalysis/getDarkSpotEvent",
            this.getDarkSpotEventSuccess.bind(this), this.remoteFault.bind(this),
            { cityId: frameService.citySelected.now.id, searchString: searchSt, areaPointString: this.pointStr });

        } else { //无框选区域则按tile加载  
            if (!this.gis1.darkSpotTool.corl.tileNeedLoad) {
                this.gis1.darkSpotTool.corl.tileNeedLoad = true;
                this.gis1.mapTool.needUpdate = true;
            }
        }       
    }

    getDarkSpotEventSuccess(result) {
        if (result.type === appConfig.RESULTDATA_TYPE_INFO) {
            if (result.data.length) {
                this.gis1.darkSpotTool.createDarkSpotData(result.data, "darkSpotData");
            }
        } else {
            systemUtil.popupMessage("提示", result.message, result.errorMessage);
        }
    }
     //GIS黑点点击
    darkSpotClick(data) {
        if (data) {
            let value = data.name;
            let key = "黑点ID";
            $("#" + this.appModuleId + " #grid1" + this.keycode).find(".mtable-content tr.mtable-tr-select").removeClass("mtable-tr-select");
            this.grid1.scrollToKeyVal(key, value);
            if (this.BlackSpot !== value) {
                this.BlackSpot = value;
                let searchSt="统计场景#"+this.countScenes+"|黑点ID#"+this.BlackSpot+"|问题类型#"+this.problemType+"|";
                this.getStateList(searchSt);
            }
        }
    }
    rowDataLoaded1(){
        if (this.grid1.rowDatas.length > 0) {
            $("#grid1" + this.keycode + " .mtable-content>.mtable tr[data-row-index='0']").trigger("click");
        }
    }
    grid1CellClick(elem){
        let selectItem = this.grid1.getElementItem($(elem));
        let lat = selectItem["中心纬度"];
        let lng = selectItem["中心经度"];
        let id = selectItem["黑点ID"];
        this.gis1.searchTool.goToAddress(lat, lng); //定位到该黑点

        let searchSt="统计场景#"+this.countScenes+"|黑点ID#"+selectItem["黑点ID"]+"|问题类型#"+this.problemType+"|";
        this.getStateList(searchSt);
        this.gis1.darkSpotTool.corl.onDarkSpotLoad.addOneEvent("link", (function () {
            this.linkGisDarkSpotEvent(lat, lng, id);
        }).bind(this));
    }
    linkGisDarkSpotEvent(lat, lng, id) {
        let name; //根据找到group下相应的子元素
        if (this.gisAreaPointSt1) {//按框选区域查找，名称固定
            name = "darkSpotData";
        } else {//按tile查找，找到对应的tile
            let zoom = this.gis1.darkSpotTool.corl.zoom;
            let tileX = this.gis1.mapTool.long2tile(lng, zoom);
            let tileY = this.gis1.mapTool.lat2tile(lat, zoom);
            name = tileX + "," + tileY + ";";
        }
        this.gis1.darkSpotTool.linkDarkSpotById(name, id);
    };
    getStateList(searchSt){
        systemUtil.popupLoading(true, $("#" + this.appModuleId), "正在查询数据，请稍候...");
        let proc="proc_通用查询_黑点问题分析_数据_状态";
        let procStr = this.toEncode(proc);
        remoteAjaxUtil.query("/cda/darkSpot/darkSpotAnalysis/commonQueryList",
            this.getStateListSuccess.bind(this), this.remoteFault.bind(this),
            { cityId: frameService.citySelected.now.id, searchSt: searchSt, procStr: procStr });
    }
    getStateListSuccess(result){
        systemUtil.popupLoading(false, $("#" + this.appModuleId));
        if (result && result.type === appConfig.RESULTDATA_TYPE_INFO) {
            this.grid2.setAllDatas({ format: result.data.format }, result.data.list);
            this.grid3.setAllDatas({ format: "待查询$$160$$l$$$$$$$@" }, []);
            this.grid4.setAllDatas({ format: "待查询$$160$$l$$$$$$$@" }, []);
        } else {
            systemUtil.popupMessage("提示", result.message, result.errorMessage);
        }
    }
    rowDataLoaded2(){
        if (this.grid2.rowDatas.length > 0) {
            $("#grid2" + this.keycode + " .mtable-content>.mtable tr[data-row-index='0']").trigger("click");
        }
    }
    grid2CellClick(elem){
        let selectItem = this.grid2.getElementItem($(elem));
        this.time=selectItem["时间"];
        let searchSt="时间#"+selectItem["时间"]+"|黑点ID#"+selectItem["黑点ID"]+"|统计场景#"+this.countScenes+"|";
        this.getDetailList(searchSt);
    }
    getDetailList(searchSt){
        systemUtil.popupLoading(true, $("#" + this.appModuleId), "正在查询数据，请稍候...");
        let proc="proc_通用查询_黑点问题分析_数据_" + this.problemType + "_事件";
        let procStr = this.toEncode(proc);
        remoteAjaxUtil.query("/cda/darkSpot/darkSpotAnalysis/commonQueryList",
            this.getDetailListSuccess.bind(this), this.remoteFault.bind(this),
            { cityId: frameService.citySelected.now.id, searchSt: searchSt, procStr: procStr });
    }
    getDetailListSuccess(result){
        systemUtil.popupLoading(false, $("#" + this.appModuleId));
        if (result && result.type === appConfig.RESULTDATA_TYPE_INFO) {
            this.grid3.setAllDatas({ format: result.data.format }, result.data.list);
            this.grid4.setAllDatas({ format: "待查询$$160$$l$$$$$$$@" }, []);
            tabUtil.openTabItem("tab3" + this.keycode, 0);
        } else {
            systemUtil.popupMessage("提示", result.message, result.errorMessage);
        }
    }
    rowDataLoaded3(){
        if (this.grid3.rowDatas.length > 0) {
            $("#grid3" + this.keycode + " .mtable-content>.mtable tr[data-row-index='0']").trigger("click");
        }
    }
    grid3CellClick(elem){
        let selectItem = this.grid3.getElementItem($(elem));
        let searchSt="时间#"+this.time+"|黑点ID#"+selectItem["黑点ID"]+"|路段ID#"+selectItem["路段ID"]+"|";
        this.getProblemCell(searchSt);
    }
    getProblemCell(searchSt){
        systemUtil.popupLoading(true, $("#" + this.appModuleId), "正在查询数据，请稍候...");
        let proc="proc_通用查询_黑点问题分析_数据_" + this.appType + "_" + this.problemType + "_事件小区";
        let procStr = this.toEncode(proc);
        remoteAjaxUtil.query("/cda/darkSpot/darkSpotAnalysis/commonQueryList",
            this.getProblemCellSuccess.bind(this), this.remoteFault.bind(this),
            { cityId: frameService.citySelected.now.id, searchSt: searchSt, procStr: procStr });
    }
    getProblemCellSuccess(result){
        systemUtil.popupLoading(false, $("#" + this.appModuleId));
        if (result && result.type === appConfig.RESULTDATA_TYPE_INFO) {
            this.grid4.setAllDatas({ format: result.data.format, transform: this.transform4 }, result.data.list);
            tabUtil.openTabItem("tab3" + this.keycode, 1);
        } else {
            systemUtil.popupMessage("提示", result.message, result.errorMessage);
        }
    }
    grid4CellClick(elem) {
        let selectItem = this.grid4.getElementItem($(elem));
        this.gis1.searchTool.goToAddress(selectItem["小区纬度"], selectItem["小区经度"]);
    }
    //跳转智能分析
    gotoIntelligentAnalysis(event) {
        if(this.toIntelligentRecord[this.issueType]===0){
            systemUtil.popupMessage("提示", "未对"+this.issueType+"问题进行智能分析");
            return;
        }
        let id = $(event.currentTarget).text();
        let param = {
            problemObject: "道路",
            problemType: this.problemType,
            lastAppId: this.appId,
            id: id,
        };
        frameService.appOpenById("fef1b7f2-2133-f00e-8d3c-00557499f05d", param);
        return false;
    };
    //小区体检跳转
    gotoCellCheck(event) {
        let name = $(event.currentTarget).text();
        let param = {
            cellName: name,
            lastAppId: this.appId,
            urlChain: this.appId,
        };
        frameService.appOpenById("6f828700-2133-efa7-8d0c-455e33d9b21d", param);
        return false;
    }
    /*获取结果失败*/
    remoteFault(result) {
        systemUtil.popupLoading(false, $("#" + this.appModuleId));
        remoteAjaxUtil.faultTip(result);
    }
}
export default AppModule;