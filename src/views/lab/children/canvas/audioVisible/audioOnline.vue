<template>
        <div class="audioOnline">
            <div class="left">
                <div class="playList">
                    <div class="songTitle">
                        博主18年网易云音乐年度歌单    
                    </div>     
                    <div class="song" v-for="song in playList" :key="song.id">
                        <span @click.self="playSong(song.id)">{{song.name}}</span>
                    </div>
                </div>
            </div>
            <div class="right">

                <p>
                        audioOnline effect
                        <el-button @click="running = !running">播放/暂停</el-button>    
                </p>
               
                <div>
                        <el-select v-model="Type">
                                <el-option v-for="item in options" :key="item.value" :value="item.value" :label="item.label"></el-option>       
                        </el-select>
                </div>
                
                <div class="drawContext" ref="context">

                </div>
            </div>
        </div>
</template>


<script>
import {Select,Option,Button} from 'element-ui'

import audionVisible from './audioVisible.js';
import {fetchGet} from '@/js/fetch.js';
export default {
        name:'audioOnline',
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
                        playList:[],
                        canvasEntity:null,
                        running:false,
                        audioInit:false,
                        onlineAudioNotInt:true,
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
                                }
                        ],
                        Type:'line'
                }
        },
        mounted(){
            //fetchGet('https://api.imjad.cn/cloudmusic/?type=search&s=辉大基基&search_type=1000').then(result=>{
                //console.log(result)
            //}) //2595943882
            let target = this.$refs.context;
            this.canvasEntity = new audionVisible(target,{online:true,Type:this.Type});
            this.canvasEntity.init();
            //我的年度歌单
            fetchGet('https://api.imjad.cn/cloudmusic/?type=playlist&id=2595943882').then(result=>{
                
                if(result && result.playlist){
                    this.playList = result.playlist.tracks;
                    console.log(this.playList);
                }
            })
                //audio.play();
               
        },
        methods:{
            async playSong(id){
                
                let url = `https://api.imjad.cn/cloudmusic/?type=song&id=${id}&br=128000`;
                let mp3Obj = await fetchGet(url);
                if(mp3Obj.data instanceof Array && mp3Obj.data.length>0){
                    let bufferUrl = mp3Obj.data[0].url;
                    if(!bufferUrl){
                        alert('该单曲可能不是免费的')
                    }else{

                        if(this.onlineAudioNotInt === true){
    
                            this.canvasEntity.getOnlineBuffer(bufferUrl,'init');
                            this.onlineAudioNotInt = null;
                        }else{
                            this.canvasEntity.getOnlineBuffer(bufferUrl,'switch');
                        }
                    }
                }
            }
        },
        watch:{
                running(val,oldval){
                       
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
.audioOnline{
    display:flex;
    justify-content: space-between;
    .left{
        width:30%;

    }
    .right{
        width:65%;
    }
}
.drawContext{
        height:300px;
}
.playList{
    height:100%;
    overflow-y: auto;
    .songTitle{
        border-bottom:1px solid #dedede;
        height:36px;
        line-height:36px;
        font-size:14px;
        color:#333;
    }
    .song{
        height:36px;
        line-height:36px;
        color:#666;font-size:12px;
        cursor: pointer;
        border-bottom:1px solid #dedede;
    }
}
</style>
