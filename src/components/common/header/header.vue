<template>
    <div class="icHeader">
        <div class="icHeaderInside flex-box">
            <div class="flex-box vertical-center align-left per50">
                <span class="mainLogo">Inset Collection</span>
            </div>
            <div class="flex-box vertical-center align-right per50">
                <i v-incursor v-if="islogin" class="usersetting el-icon-setting" @click="openSet = !openSet"></i>
                <input type="text" v-model="searchKeyword" class="ICGeneral small">
            </div>
            <ul class="operates" :style="{'display':openSet?'block':'none'}">
                <li class="item" v-incursor @click="handleLoginOut">退出登录</li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    name:'IcHeader',
    data(){
        return {
            searchKeyword:'',
            openSet:false
        }
    },
    methods:{
        handleLoginOut(){
            this.$store.dispatch('login_out');
            this.openSet = false;
        }
    },
    computed:{
        islogin(){
            return this.$store.state.login.loginState
        }
    }
}
</script>

<style lang="less">
@import '../../../assets/style/publicVar.less';
    .icHeader{
        background-color:#fff; 
        width:100%;
        position:fixed;
        z-index:100;
        top:0px;left:0px;
        height:48px;
        box-shadow:0 0 15px -5px rgba(0, 0, 0, 0.3);
        -moz-box-shadow:0 0 15px -5px rgba(0, 0, 0, 0.3);
        -webkit-box-shadow:0 0 15px -5px rgba(0, 0, 0, 0.3);
        .usersetting{
            font-size:24px;margin-left:20px;
        }
        .mainLogo{
            color:#666;
            font-size:26px;

        }
    }
    .icHeaderInside{
        max-width:1200px;
        height:100%;margin:0 auto;
        position:relative;
        .operates{
            position:absolute;
            background-color:#fefefe;
            right:0;
            top:40px;
            padding:5px;
            .item{
                text-align: center;height:24px;line-height:24px;width:90px;
                margin-bottom:5px;color:#333;font-size:12px;
                &:hover{
                    color:#fff;background-color:@themecolor
                }
            }
        }
    }
</style>

