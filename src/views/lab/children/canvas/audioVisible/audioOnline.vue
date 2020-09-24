<!--
 * @Author: gaigai
 * @Date: 2019-07-24 09:19:53
 * @LastEditTime : 2020-09-24 19:26:27
 * @Description: 
 * @Email: 1054257376@qq.com
 * @habit: carton girl
 -->
<template>
  <div class="audioOnline" ref="main">
    <div class="left">
      <div class="playList">
        <div class="songTitle">网易云歌单：~Perfume~po主觉得软就够了！￣へ￣</div>
        <div class="song" v-for="song in playList" :key="song.id">
          <span @click.self="playSong(song)">{{ song.name }}</span>
        </div>
      </div>
    </div>
    <div class="right">
      <p>
        audioOnline effect
        <el-button @click="running = !running">播放/暂停</el-button>
      </p>

      <div>
        <el-select v-model="Type">
          <el-option
            v-for="item in options"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          ></el-option>
        </el-select>
      </div>

      <div class="drawContext" ref="context"></div>
      <img :src="picUrl" alt style="width:200px;height:200px" />
    </div>
  </div>
</template>

<script>
import { Select, Option, Button, Loading } from "element-ui";
import request from "@/utils/request";
import audionVisible from "./audioVisible.js";
import { fetchGet } from "@/js/fetch.js";
export default {
  name: "audioOnline",
  components: {
    "el-select": Select,
    "el-button": Button,
    "el-option": Option,
  },
  beforeDestroy() {
    if (this.canvasEntity) {
      this.canvasEntity.close();
    }
  },
  data() {
    return {
      playList: [],
      canvasEntity: null,
      running: true,
      audioInit: false,
      onlineAudioNotInt: true,
      onlineLoading: false,
      picUrl: "",
      options: [
        {
          value: "line",
          label: "line",
        },
        {
          value: "bar",
          label: "bar",
        },
        {
          value: "roundBar",
          label: "roundBar",
        },
        {
          value: "crystal",
          label: "crystal",
        },
      ],
      Type: "line",
    };
  },
  mounted() {
    let target = this.$refs.context;
    this.canvasEntity = new audionVisible(target, {
      online: true,
      Type: this.Type,
    });
    this.canvasEntity.init();
    //PERFUME歌单
    request({
      withCredentials: true,
      method: "GET",
      url: "/musicapi/playlist/detail?id=2650020",
    }).then((result) => {
      if (result && result.playlist) {
        this.playList = result.playlist.tracks;
        console.log(this.playList);
      }
    });

    //audio.play();
  },
  methods: {
    async playSong(song) {
      let { id } = song;
      let url = `/musicapi/song/url?id=${id}&br=128000`;
      let picUrl = (song.al || {}).picUrl;
      this.$set(this, "picUrl", picUrl);
      const newOptions = { online: true, Type: this.Type };

      let mp3Obj = await fetchGet(url);
      if (mp3Obj.data instanceof Array && mp3Obj.data.length > 0) {
        let bufferUrl = mp3Obj.data[0].url;
        if (!bufferUrl) {
          alert("该单曲可能不是免费的");
          this.running = false;
        } else {
          this.canvasEntity.reset(newOptions);
          let loadingInstance = Loading.service({
            body: true,
            text: "音频加载中",
          });
          if (this.onlineAudioNotInt === true) {
            this.canvasEntity.getOnlineBuffer(bufferUrl, "init", () => {
              loadingInstance.close();
            });
            this.onlineAudioNotInt = null;
          } else {
            this.canvasEntity.getOnlineBuffer(bufferUrl, "switch", () => {
              loadingInstance.close();
            });
          }
        }
      }
    },
  },
  watch: {
    running(val, oldval) {
      if (this.canvasEntity) {
        if (val === true) {
          this.canvasEntity.play();
        } else {
          this.canvasEntity.stop();
        }
      }
    },
    Type(val, oldval) {
      let audio = this.$refs.audio;
      if (this.canvasEntity) {
        this.canvasEntity.changeType(val);
      }
    },
  },
};
</script>

<style scoped lang="less">
.audioOnline {
  display: flex;
  justify-content: space-between;
  .left {
    width: 30%;
  }
  .right {
    width: 65%;
  }
}
.drawContext {
  height: 300px;
}
.playList {
  height: 100%;
  overflow-y: auto;
  .songTitle {
    border-bottom: 1px solid #dedede;
    height: 36px;
    line-height: 36px;
    font-size: 14px;
    color: #333;
  }
  .song {
    height: 36px;
    line-height: 36px;
    color: #666;
    font-size: 12px;
    cursor: pointer;
    border-bottom: 1px solid #dedede;
  }
}
</style>
