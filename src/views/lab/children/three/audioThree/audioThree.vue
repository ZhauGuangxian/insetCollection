<template>
  <div>
    <p>
      audioThree effect
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
    <audio :src="testAudio" ref="audio"></audio>
    <div class="drawContext" ref="context"></div>
  </div>
</template>


<script>
import { Select, Option, Button } from "element-ui";
import testAudio from "@/assets/test.mp3";
import audioThree from "./audioThree.js";
export default {
  name: "audioThree",
  components: {
    "el-select": Select,
    "el-button": Button,
    "el-option": Option,
  },
  beforeDestroy() {
    this.$data.threeEntity.close();
  },
  data() {
    return {
      running: false,
      audioInit: false,
      testAudio,
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
    let context = this.$refs.context;
    let audioNode = this.$refs.audio;
    //audio.play();
    this.$data.threeEntity = new audioThree({
      target: context,
      audioNode,
      dev: true,
      background: 0xcce0ff,
    });
    window.t = this.$data.threeEntity;
    this.$data.threeEntity.init();
  },
  watch: {
    running(val, oldval) {
      let audio = this.$refs.audio;
      if (val === true) {
        audio.play();
      } else {
        audio.pause();
      }
    },
  },
};
</script>

<style scoped lang="less">
.drawContext {
  height: 600px;
}
</style>
