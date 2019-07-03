<template>
        <div>
                <p>
                        audioVisible effect
                        <el-button @click="running = !running">播放/暂停</el-button>    
                </p>
                <div>
                        <el-select v-model="Type">
                                <el-option v-for="item in options" :key="item.value" :value="item.value" :label="item.label"></el-option>       
                        </el-select>
                </div>
                <audio :src="testAudio" ref="audio"></audio>
                <div class="drawContext" ref="context">

                </div>
        </div>
</template>


<script>
import {Select,Option,Button} from 'element-ui'
import testAudio from './test.mp3'
import audionVisible from './audioVisible.js';
export default {
        name:'audioVisible',
        components:{
                'el-select':Select,
                'el-button':Button,
                'el-option':Option
        },
        beforeDestroy(){
                if(this.canvasEntity){
                        this.canvasEntity.close();
                }
        },
        data(){
                return{
                        canvasEntity:null,
                        running:false,
                        audioInit:false,
                        testAudio,
                        options:[
                                {
                                        value:'line',
                                        label:'line'
                                },
                                {
                                        value:'bar',
                                        label:'bar'
                                },{
                                        value:'roundBar',
                                        label:'roundBar'
                                },{
                                    value:'crystal',
                                    label:'crystal'
                                }
                        ],
                        Type:'line'
                }
        },
        mounted(){
               
                //audio.play();
               
        },
        watch:{
                running(val,oldval){
                        let audio = this.$refs.audio;
                        if(val === true){
                                if(this.audioInit === false){
                                        this.audioInit = true;
                                        let target = this.$refs.context;
                                      
                                        this.canvasEntity = new audionVisible(target,{audioNode:audio,Type:this.Type});
                                        this.canvasEntity.init();

                                }
                                audio.play();
                        }else{
                                audio.pause();
                        }
                },
                Type(val,oldval){
                        let audio = this.$refs.audio;
                        if(this.canvasEntity){

                                this.canvasEntity.changeType(val)
                        }
                }
        }
}
</script>

<style scoped lang="less">
.drawContext{
        height:300px;
}

</style>
