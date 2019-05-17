<template>
  <div class="hello">
    <!--<MtexTransfer v-model="mockValue" :data="data" :title="['待选的','已选的']" :showSearchForm="true"></MtexTransfer>-->
    <router-link to="/lab">go to lab</router-link>
    <div class="mainContent">
      <div class="inside">
        <div class="left userInfo">
          <div v-if="isLogin">
            <div class="avatarImg">
              <img :src="userData.avatarimg" alt="用户头像">
            </div>
            <div class="nickName">
              <p class="pn" v-incursor>{{userData.nickname || '这个人未登录'}}</p>
              <div class="secondInfo">
                <span class="fans">粉丝-{{userData.fans || 0}}</span>
                <span class="subscribers">关注-{{userData.subscribers || 0}}</span>
                <span class="insetworks">稿件-{{userData.insetworks || 0}}</span>
              </div>
            </div>
          </div>
          <div v-else>
            <LRPanel v-model="loginData" @doSubmit="handleLogin" actionType="login"></LRPanel>
          </div>
        </div>
        
        <div class="center homeInset">
          <div class="recomends">
            <el-button type="primary" @click="handleDialog()">button</el-button>
          </div>
          <div class="subscribes">
            
              <InsetCover v-for="subsitem in subscribesNewList" :insetData="subsitem" :key="subsitem._id" :underGrid="true"></InsetCover>
            
          </div>
          <div class="newCommits"></div>
        </div>
        <div class="left2 rankin">
          <el-upload
            class="avatar-uploader"
            :show-file-list="false"
            action="./api/imgUpload"
            :on-success="handleUploadSuccess"
            :before-upload="handleBeforeUpload"
            name="imageFile"
            >
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </div>
      </div>

    </div>
    
    <el-dialog :visible.sync="visible" title="你喜欢唱/跳/篮球/RAP，Music" >
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="visible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {Tree,Dialog,Button,Upload} from 'element-ui';
import MtexTransfer from '@/components/common/transfer/transfer.vue';
import InsetCover from '@/components/common/insets/insetcover.vue';
import {fetchGet,fetchPost} from '@/js/fetch.js';
import LRPanel from '@/components/login/login-panel.vue'
export default {
  name: 'Home',
  components:{
    MtexTransfer,
    'el-tree':Tree,
    'el-dialog':Dialog,
    'el-button':Button,
    'el-upload':Upload,
    InsetCover,
    LRPanel
  },
  data() {
    const generateData=()=>{
      const data = [];
        for (let i = 1; i <= 199; i++) {
          data.push({
            key: i,
            label: `备选项 ${ i }`,
           
          });
        }
        return data;
    }
    return {
        visible:false,
        data: generateData(),
        mockValue: [],
        loginData:{},
        imageUrl:'',
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      };
  },

  created(){
    
  },
  mounted(){
    let getNewest =async ()=>{
      let result = await fetchPost('./api/inset/getNewestInsets');
      
      //this.subscribesNewList = result.data
      this.$store.dispatch("get_home_subscribe_inset",result.data)
    }
    getNewest();
  },
  computed:{
    subscribesNewList(){
      return this.$store.state.inset.subscribeInsetsHome
    },
    isLogin(){
      return this.$store.state.login.loginState;
    },
    userData(){
      return this.$store.state.login.userData || {}
    }
  },
  methods:{
    handleUploadSuccess(res,file,filelist){
      this.imageUrl =  res.data.path;
    },
    handleBeforeUpload(file){

    },
    handleDialog(){
      this.visible = !this.visible;
      fetchGet('./api/test').then(res=>{
        console.log(res)
      })
    },
    handleLogin(data){
      console.log(data);
      let loginNameOk = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/.test(this.loginData.loginPhoneEmail) || /^((13[0-9])|(14[5,7,9])|(15[^4])|(18[0-9])|(17[0,1,3,5,6,7,8]))\d{8}$/.test(this.loginData.loginPhoneEmail)
      if(!loginNameOk || !this.loginData.loginPhoneEmail){
           return;
        }
      let _this = this;
      fetchPost('./api/login',{
        password:this.loginData.password,
        loginName:this.loginData.loginPhoneEmail
      }).then(res=>{
        //诸葛亮下来战术，约我等明日决战，如何对敌
        if(res.message == 'success'){
          localStorage.setItem("token",res.data.token);
          
          _this.$store.dispatch('get_user_success',res.data.user);
          _this.$store.dispatch('login_in')
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
  @import '../assets/style/publicStyle.less';
  .mainContent{
    .inside{
      width:1200px;
      margin:0 auto;
      grid-column-gap:10px;
      display:grid;
      grid-auto-flow: row dense;
      grid-template-columns: 300px 900px;
      >div{
        border:1px solid #dedede;
        box-sizing: border-box;
        min-height:300px;
        float:left;
        position:relative;
        padding:20px;
      }
      .userInfo{
        padding-top:60px;
        .avatarImg{
          width:180px;
          height:180px;
          margin:0 auto;
          border-radius:90px;
          img{
            width:100%;height:100%;border-radius:50%;
          }
        }
        .nickName{
          margin-top:10px;
          .pn{
            margin-bottom:10px;
            font-weight:600;
            font-size:14px;
          }
          .secondInfo{
            color:#999;
          }
        }
      }
      .center{
        
        padding:20px;
        .subscribes{
          display:grid;
          grid-template-columns:1fr 1fr 1fr;
          grid-template-rows:200px 200px;
          grid-gap: 10px 10px 
        }
      }
    }
  }
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
