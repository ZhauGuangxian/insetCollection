<template>
    <div class="loginandregistpanel">
        <div class="formRow mb_20" v-for="item in renderConfig" :key="item.key">
            <input :type="item.type" v-model="formData[item.key]" class="ICGeneral" :placeholder="item.placeholder" @input="handleInput($event,item.key)">
        </div>
        <div class="text-center mb_20">
            <button class="ICGeneral big" @click="handleSubmit">{{buttonLabel}}</button>
        </div>
    </div>
</template>

<script>
//var hash = CryptoJS.MD5("Message");

import CryptoJS from "crypto-js"; 
export default {
    name:'LRPanel',
    data(){
        return {
            formData:{

            }
        }
    },
    computed:{
        renderConfig(){
            if(this.actionType == 'login'){
                return [
                    {
                        label:'手机或邮箱',
                        key:'loginPhoneEmail',
                        type:'text',
                        placeholder:'请输入手机或邮箱'
                    },{
                        label:'密码',
                        key:'password',
                        type:'password',
                        placeholder:'请输入密码'
                    }
                ]
            }else{
                return [
                    {
                        label:'昵称',
                        key:'nickName',
                        type:'text',
                        placeholder:'请输入登录名'
                    },{
                        label:'手机或邮箱',
                        key:'loginPhoneEmail',
                        type:'text',
                        placeholder:'请输入手机或邮箱'
                    },{
                        label:'密码',
                        key:'password',
                        type:'password',
                        placeholder:'请输入密码'
                    }
                ]
            }
        },

    },
    /*watch:{
        formData(newVal,oldVal){
            let temp = JSON.parse(JSON.stringify(newVal));
            temp['password'] = CryptoJS.MD5(newVal['password']);
            this.$emit('input',temp)
            
        }
    },*/
    props:{ //类型 login or regist
        buttonLabel:{
            type:String,
            default(){
                return '登录'
            }
        },
        actionType:{
            type:String,
            default(){
                return 'login'
            }
        },
        //绑定到父元素的数据
        value:{
            type:Object,
            default(){
                return {}
            }
        }
      
    },
    methods:{
        handleSubmit(){
            this.$emit('doSubmit',this.formData)
        },
        handleInput(event,key){
            let temp = JSON.parse(JSON.stringify(this.formData));
            
            // Encrypt
            //var ciphertext = CryptoJS.AES.encrypt(this.formData['password'], 'InsetColl');
            // Decrypt
            //var bytes  = CryptoJS.AES.decrypt(ciphertext.toString(), 'InsetColl');
            //var plaintext = bytes.toString(CryptoJS.enc.Utf8);
            //ciphertext = CryptoJS.enc.Utf8.parse(ciphertext);
            // Encrypt
            var ciphertext = CryptoJS.MD5(this.formData['password']+'InsetCollKey').toString();
            // Decrypt
           
            temp['password'] = ciphertext;
            this.$emit('input',temp)
        }
    }
}
</script>
