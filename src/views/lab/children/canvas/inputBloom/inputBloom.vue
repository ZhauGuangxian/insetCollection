<template>
    <div class="inputBloom">
        <p>在输入框里输入</p>
        <Button type="primary" v-if="animaiReady" @click="handleAnimaiState">动画启停</Button>
        <div class="darkBox">
            <div class="inputAreaCont" ref='target'>

                <input type="text" class="inputArea" >
            </div>
        </div>
    </div>
</template>

<script>
import InputBloom from './inputBloom.js';
import {Button} from 'element-ui';
export default {
    name:"InputBloom",
    components:{
        Button
    },
    data(){
        return{
            canvasEntity:null,
            animaiReady:false,
            animaiRun:true
        }
    },
    beforeDestroy(){
        this.canvasEntity.close();
    },
    methods:{
        handleAnimaiState(){
            this.handleAnimaiState = !this.handleAnimaiState;
            if(this.handleAnimaiState === true){
                this.canvasEntity.drawMain();
            }else{
                this.canvasEntity.stopRender();
            }
        }
    },
    mounted(){
        let target = this.$refs.target;
        this.canvasEntity = new InputBloom(target,{dotNumber:12,height:100});
        this.canvasEntity.init();
        this.animaiReady = true;
    }
}
</script>

<style lang="less">
    .darkBox{
        width:400px;height:200px;
        display:inline-block;
        background-color:#0f192e;
        vertical-align: middle;
        .inputAreaCont{
            height:30px;
            line-height:30px;
            display:inline-block;
            width:240px;
            margin-top:100px;
            padding-left:5px;
            transform:translateY(-50%)
        }
        .inputArea{
            outline:none;
            height:30px;
            line-height:30px;
            width:100%;
            border-radius:2px;
            border:1px solid #33f1ff;
            background-color:transparent;
            color:#33f1ff;
           
        }
    }
</style>

