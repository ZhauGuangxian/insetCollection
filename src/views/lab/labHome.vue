<template>
    <div class="labHomeDiv">
        <div class="labChildren">
            
                <router-link to="/lab/threelab"> THREE </router-link>
                <router-link to="/lab/canvaslab"> CANVAS </router-link>
            
        </div>
        <div class="childPageBox">
            <router-view/>
        </div>
        
    </div>
</template>

<script>
export default {
    name:'LabHome',
    data(){
        return {

        }
    }
}
</script>

<style lang="less">
.labHomeDiv{
    height:100%
}
.labChildren{
    height:26px;
    line-height:26px;
}
    .childPageBox{
        height:calc(100% - 26px)
    }
</style>

