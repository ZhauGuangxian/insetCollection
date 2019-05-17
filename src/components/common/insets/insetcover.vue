<template>
    <div v-incursor class="insetCover" :class="{'normal':!underGrid}" :style="{'width':!underGrid && width,'height':!underGrid && height}">
        <img :src="insetData.insetUrl" :alt="insetData.name" :title="insetData.name" class="coverimg">
        <div class="bottomWrapper">
            <p>{{insetData.name}}</p>
        </div>
    </div>
</template>

<script>
export default {
    name:'InsetCover',
    data(){
        return{

        }
    },
    props:{
        height:{
            type:String,
            default(){
                return '200px'
            }
        },
        width:{
            type:String,
            default(){
                return '300px';
            }
        },
        underGrid:{    //是否需要按grid布局
            type:Boolean,
            default(){
                return false;
            }
        },
        insetData:{
            type:Object,
            default(){
                return {
                    img:'',
                    name:'作品名称',
                    author:'',
                }
            }
        }
    }
}
</script>

<style lang="less" scoped>
.insetCover{
    position:relative;
    overflow:hidden;
    &.normal{
        display:inline-block;
    }
    .coverimg{
        object-fit: cover;
        width:100%;height:100%;
        transform-origin: 50% 20%;
        transform:scale(1.2);
        transition: all ease-out .2s;
    }
    .bottomWrapper{
        position:absolute;
        height:40px;
        width:100%;
        background-image:linear-gradient(to bottom,rgba(0,0,0,0),rgba(0,0,0,0.1) 20%,
        rgba(0,0,0,0.3) 55%,rgba(0,0,0,0.5) 80%,rgba(0,0,0, 0.7));
        bottom:-40px;left:0;
        transition:bottom ease-out .2s;
        color:#fff;
    }
    &:hover{
        .coverimg{
            transform:scale(1);
        }
        .bottomWrapper{
            bottom:0px
        }
    }
    
}

</style>
