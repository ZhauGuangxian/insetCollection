<template>
    <div class="CanvasLabHome" ref="CanvasLabHome">
        <div class="intro">
            thisp age is canvas lab home
        </div>
        <div class="leftList">
            <p @click="selectCanvasName = 'InputBloom'">InputBloom</p>
        </div>
        <div class="rightShowBox">
            <component :is="selectCanvasName"></component>
        </div>
    </div>
</template>

<script>
import InputBloom from './inputBloom/inputBloom'
export default {
    name:'CanvasLabHome',
    components:{
        InputBloom
    },
    data(){
        return{
            appHeight:0,
            selectCanvasName:''
        }
    },
    mounted(){
        let CanvasLabHome = this.$refs.CanvasLabHome;
        this.appHeight = CanvasLabHome.offsetHeight 
    }
}
</script>

<style lang="less" scoped>
    .CanvasLabHome{
        height:100%;
        .intro{
            height:24px;
            line-height:24px;
        }
        .leftList{
            height:calc(100% - 110px);
            position:fixed;
            bottom:0;
            left:0;
            width:300px;
            border-top:1px solid #ddd;
            border-right:1px solid #ddd;
        }
        .rightShowBox{
            margin-left:300px;
            min-height:400px;
        }
    }
</style>
