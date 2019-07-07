<template>
    <div class="CanvasLabHome" ref="CanvasLabHome">
        <div class="intro">
            thisp age is three lab home
        </div>
        <div class="leftList">
            <p @click="selectCanvasName='ThreeDemo'">threeDemo</p>
            <p @click="selectCanvasName='audioThree'">audioThree</p>
            <p @click="selectCanvasName='ThreeDemoTwo'">ThreeDemoTwo</p>
        </div>
        <div class="rightShowBox">
            <component :is="selectCanvasName"></component>
        </div>
    </div>
</template>

<script>
import ThreeDemo from './threeDemo/threeDemo.vue';
import audioThree from './audioThree/audioThree.vue';
import ThreeDemoTwo from './threeDemo2/threeDemo2.vue';
export default {
    name:'CanvasLabHome',
    components:{
        ThreeDemo,
        audioThree,
        ThreeDemoTwo
    },
    data(){
        return{
            appHeight:0,
            selectCanvasName:'ThreeDemo'
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
            padding:10px 5px;
            border-top:1px solid #ddd;
            border-right:1px solid #ddd;
            >p{
                line-height:32px;
                border-bottom:1px solid #dedede;
                &:last-child{
                    border-bottom:0
                }
            }
        }
        .rightShowBox{
            margin-left:300px;
            min-height:400px;
        }
    }
</style>
