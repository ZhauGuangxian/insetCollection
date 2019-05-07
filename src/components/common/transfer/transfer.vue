<template>
    <div class="mtex-transfer displayFlex aling-center">
        <TransferPanel class="left" ref="leftPanel" v-bind="$props" :data="sourceData" :title="title[0]" @selected-change="handleLeftChange"></TransferPanel>
        <div class="middle">
            <div class="buttonGroup">

                <el-button circle icon="el-icon-d-arrow-right"
                    type="primary"
                    @click.native="moveToRightAll">
                </el-button>
                <el-button circle  icon="el-icon-arrow-right"
                    type="primary"
                    @click.native="moveToRightSingle"
                    :disabled="leftAvailbale.length === 0">
                
                </el-button>
                <el-button
                    type="primary" icon="el-icon-arrow-left" circle
                    @click.native="moveToLeftSingle"
                    :disabled="rightAvailbale.length === 0">
        
                </el-button>
                <el-button
                    type="primary" circle icon="el-icon-d-arrow-left"
                    @click.native="moveToLeftAll">
                </el-button>
            </div>
        </div>
        <TransferPanel class="right" ref="rightPanel" v-bind="$props" :data="targetData" :title="title[1]" @selected-change="handleRightChange"></TransferPanel>
    </div>
</template>

<script>
import TransferPanel from './transfer-panel';
import {Button} from 'element-ui';
export default {
    name:'MtexTransfer',
    components:{
        TransferPanel,
        'el-button':Button
    },
    props:{
        //自定义属性名
        'props':{
            type:Object,
            default(){
                return {
                    label:'label',
                    key:'key'
                }
            }
        },
        //是否显示搜索框
        'showSearchForm':Boolean,
        //搜索框placeholder
        'searchFormPlaceholder':{
            type:String,
            default(){
                return '搜索内容'
            }
        },
        //自定义搜索事件
        'handleSearch':Function,
        //主体数据
        data:{
            type:Array,
            
            default(){
                return [];
            }
        },
        //绑定到父组件的数据
        value:{
            type:Array,
            default(){
                return [];
            }
        },
        //标题
        title:{
            type:Array,
            default(){
                return ['列表1','列表2']
            }
        }
    },
    computed:{
        dataIds(){
            return this.value.map(element => {
                return element[this.props.key]
            });
        },
        sourceData(){
            
            let result =  this.data.filter(item => this.dataIds.indexOf(item[this.props.key]) === -1);
            return result;
        },
        targetData(){
            let result = this.data.filter(item => this.dataIds.indexOf(item[this.props.key]) > -1);
           return result;
        }
    },
    data(){
        return{
            
            
            rightAvailbale:[],
            leftAvailbale:[]
        }
    },
    methods:{
        handleLeftChange(val,movedVal){
            this.leftAvailbale = val;
            if(typeof movedVal == 'undefined'){
                return ;
            }
            this.$emit('leftPanelChange',val,movedVal)
        },
        handleRightChange(val,movedVal){
            this.rightAvailbale = val;
            if(typeof movedVal == 'undefined'){
                return ;
            }
            this.$emit('rightPanelChange',val,movedVal)
        },
        moveToRightAll(){
            
            //currentValue = currentValue.concat(this.sourceData);
            let currentLefts = this.sourceData.map(e=>{
                return e;
            });
            let currentValue = this.value.slice();
            currentValue = currentValue.concat(currentLefts)
            this.$emit('input',currentValue)
        },
        moveToRightSingle(){
            
            let trueCurrent = this.leftAvailbale.map(e=>{
                let idx = this.dataIds.indexOf(e[this.props.key])
                if(idx === -1){
                    
                    return e;
                }
            })
            let currentValue = this.value.slice();
            currentValue = currentValue.concat(trueCurrent);
            this.$emit('input',currentValue)
        },
        moveToLeftSingle(){
            
            
            let trueCurrent =  this.rightAvailbale.map(e=>{
                let idx = this.dataIds.indexOf(e[this.props.key])
                if(idx > -1){
                    
                    return e;
                }
            });
            let currentValue = this.value.slice();
            currentValue = currentValue.filter(e=>{
                return trueCurrent.indexOf(e) === -1;
            });
            this.$emit('input',currentValue)
        },
        moveToLeftAll(){
            
           
            let currentValue = [];
            this.$emit('input',currentValue)
        }
    }
}
</script>

<style lang="less">
.mtex-transfer{
    
    padding:16px;
    display:flex;
   
    .middle{
        margin:0 12px;
        display:flex;
        width:60px;
        align-items: center;
        button{
            margin-bottom:12px;
            margin-left:0;
            vertical-align: middle;
        }
    }
}
</style>
