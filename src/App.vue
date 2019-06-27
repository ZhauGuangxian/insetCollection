<template>
  <div id="app">
    <IcHeader></IcHeader>
    <router-view/>
  </div>
</template>

<script>
import IcHeader from './components/common/header/header.vue';
import canvasBase from './views/lab/children/canvas/canvaseBase.js';
window.canvasBase = canvasBase;
export default {
  name: 'App',
  components:{
    IcHeader
  }
}
</script>

<style lang="less">

@import './assets/style/publicStyle.less';
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  height:calc(100vh - 60px)
}
</style>
