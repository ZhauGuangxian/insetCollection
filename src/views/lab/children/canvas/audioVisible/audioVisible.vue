<template>
        <div>
                <p>audioVisible effect</p>
                <audio :src="testAudio" ref="audio"></audio>
                <div class="drawContext" ref="context">

                </div>
        </div>
</template>


<script>
import testAudio from './test.mp3'
import audionVisible from './audioVisible.js';
export default {
        name:'audioVisible',
        data(){
                return{
                        canvasEntity:null,
                        testAudio
                }
        },
        mounted(){
                let target = this.$refs.context;
                let audio = this.$refs.audio;
                audio.play();
                this.canvasEntity = new audionVisible(target,{audioNode:audio});
                this.canvasEntity.init();

        }
}
</script>

<style scoped lang="less">
.drawContext{
        height:300px;
}

</style>
