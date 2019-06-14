<template>
    <div class="inputBloom">
        <p>在输入框里输入</p>
        <div class="darkBox">
            <input type="text" class="inputArea" ref='target'>
        </div>
    </div>
</template>

<script>
export default {
    name:"InputBloom",
    data(){
        return{
            
        }
    }
}
</script>

<style lang="less">
    .darkBox{
        width:400px;height:200px;
        display:inline-block;
        background-color:#0f192e;
        vertical-align: middle;
        .inputArea{
            outline:none;
            height:30px;
            line-height:30px;
            border-radius:2px;
            border:1px solid #33f1ff;
            background-color:transparent;
            color:#33f1ff;
            margin-top:100px;
            padding-left:5px;
            transform:translateY(-50%)
        }
    }
</style>

