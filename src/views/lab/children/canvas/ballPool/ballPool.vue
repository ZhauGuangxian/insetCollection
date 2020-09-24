<template>
  <div>
    <el-button type="primary" @click="handleReset">再来</el-button>
    <div id="ballscollect" class="ball-container">
      <p>ballPool</p>
    </div>
  </div>
</template>

<script>
import BallPool from "./ballPool.js";
import { Button } from "element-ui";
export default {
  name: "ballPool",
  components: {
    "el-button": Button
  },
  mounted() {
    this.$nextTick(() => {
      const option = {
        ballNum: 14
      };
      this.$data.canvasEntity = new BallPool(
        document.getElementById("ballscollect"),
        option
      );

      this.$data.canvasEntity.init();
    });
  },
  methods: {
    handleReset() {
      this.$data.canvasEntity.reset();
    }
  }
};
</script>

<style lang="less">
.ball-container {
  height: 600px;
}
</style>
