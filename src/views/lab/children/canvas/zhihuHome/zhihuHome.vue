<template>
    <div class="zhihuHome">
        <p class="desc">纯粹的没乱用的知乎首页特效</p>
        <!--包裹画布的容器div-->
        <div class="contextContainer" ref="target">

        </div>
    </div>
</template>

<script>
import zhihuHome from './zhihuHome.js';
export default {
    name:"zhihuHome",
    data(){
        return{
            canvasEntity:null
        }
    },
    mounted(){
        let node = this.$refs['target']
        this.canvasEntity = new zhihuHome(node);
        this.canvasEntity.init();  //这个方法应该改名叫init,好理解一些
    }
}
</script>

<style lang="less" scoped>
.contextContainer{
    height:400px;
    background-color: transparent
}
</style>
