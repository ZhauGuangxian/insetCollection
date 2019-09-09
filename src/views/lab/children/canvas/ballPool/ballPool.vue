<template>
    <div>
        <div id="ballscollect" class="ball-container">
            <p>ballPool</p>
        </div>
    </div>
</template>

<script>
import BallPool from './ballPool.js';
export default {
    name: 'ballPool',
    mounted() {
        this.$nextTick(() => {
            const option = {
                ballNum: 28
            }
            this.$data.canvasEntity = new BallPool(document.getElementById('ballscollect',option));
            this.$data.canvasEntity.init();
        })
    }
}
</script>

<style lang="less">
    .ball-container{
        height: 600px;
    }
</style>