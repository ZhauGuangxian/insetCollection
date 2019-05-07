<template>
    <div class="mtex-transfer-panel">
        <div class="panelInfo">
            <span>{{title}}</span>
            <span>{{selectedShowKeys.length}}/{{transList.length}}</span>
        </div>
        <div class="itemContainer">
            <div class="topSearchBar" v-if="showSearchForm">
                <input type="text" class="commonInputCtrl middle" v-model="keyword"  :placeholder="searchFormPlaceholder">
            </div>
            <ul>
                <li class="ready_item" v-for="item in transList" :key="item[keyProp]" :class="{'active':(selectedKeys||[]).indexOf(item[keyProp]) >= 0}" @click="handleSelect($event,item)">
                    {{item[labelProp] || item[keyProp]}}    
                </li>  
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    name:'TransferPanel',
    props:{
        //自定义属性名
        'props':Object,
        //标题
        title:String,
        //是否显示搜索框
        'showSearchForm':{
            type:Boolean,
            default(){
                return true;
            }
        },
        //搜索框placeholder
        'searchFormPlaceholder':String,
        //自定义搜索事件
        'handleSearch':Function,
        //待选数据
        'data':{
            type:Array,
            default(){
                return [];
            }
        }

    },
    data(){
        return{
            selected:[],
            keyword:'',
            
            
        }
    },
    computed:{
        labelProp(){
            return this.props.label || 'label';
        },
        keyProp(){
            return this.props.key || 'key';
        },
        transList(){
            return this.data.filter(item=>{
                if(typeof this.handleSearch == 'function'){
                    return this.handleSearch(this.keyword,item)
                }else{
                    const label = item[this.labelProp] || item[this.keyProp].toString();
                    return label.toLowerCase().indexOf(this.keyword.toLowerCase())>-1
                }
            })
        },
        selectedKeys(){
            return this.selected.map(e=>{
                return e[this.keyProp]
            })
        },
        selectedShowKeys(){
            return this.selectedShow.map(e=>{
                return e[this.keyProp]
            })
        },
        selectedShow(){
            return this.data.filter(e=>{
                return this.selectedKeys.indexOf(e[this.keyProp]) > -1
            })
        }
    },
    methods:{
        
        handleSelect(event,data){
            let target = event.target;
            if(target.classList.contains('active')){
               
                this.selected = this.selected.filter(item=>{
                    return item[this.keyProp] !== data[this.keyProp]
                })
            }else{
               
                this.selected.push(data)
            }

        }
    },
    watch:{
        selected(val,oldVal){
            const movedKeys = val.concat(oldVal).filter(v => val.indexOf(v) === -1 || oldVal.indexOf(v) === -1);
            this.$emit('selected-change', val, movedKeys);
        },
        data(val,oldVal){
            this.selected = [];
        }
    }
}
</script>

<style lang="less">
    .mtex-transfer-panel{
        width:200px;
        box-sizing: border-box;
         border:1px solid #ddd;
        border-radius:6px;
        overflow: hidden;
        .panelInfo{
            height:40px;line-height:40px;
            padding:0 15px;
            display:flex;justify-content :space-between;
            background-color:#f5f7fa;
            font-size:14px;
            border-bottom:1px solid #ddd;
        }
        .itemContainer{
            position:relative;
            padding:12px;
            box-sizing: border-box;
            
           
            >ul{
                margin-top:10px;
                overflow-y:auto;
                height:260px;
            }
            .ready_item{
                padding-left:10px;
                line-height:30px;
                height:30px;
                color:#666;
                cursor: pointer;
                &:hover{
                    color:#409eff;
                }
                &.active{
                    background-color:#409eff;color:#fff
                }
            }
        }
        .commonInputCtrl{
            width:100%;
            height:30px;
            border-radius:15px;
            margin:0;padding:0;
            outline:none;box-sizing: border-box;border:1px solid #dedede;
            padding-left:14px;
            font-size:16px;color:#666;
        }
    }
</style>
