<template>
    <div class="demo2">
        <p class="title">demo2 three</p>
        <div class="context" ref="context"></div>
    </div>
</template>

<script>
import ThreeDemoTwo from './demo2.js';
export default {
    name:'ThreeDemoTwo',
    data(){
        return{
            ThreeEntity:null
        }
    },
    mounted(){
        let context = this.$refs.context;
        this.ThreeEntity = new ThreeDemoTwo({
            target:context
        })
        this.ThreeEntity.init();
    }
}
</script>
