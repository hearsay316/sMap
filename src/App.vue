<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
import { initStats } from "./utils/base";
export default {
  mounted() {
    initStats();
  }
};
</script>
<style lang="stylus">
html,body,#app{
  width 100%
  height:100%
  margin 0
  padding 0
}
#app
  font-family 'Avenir', Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  text-align center
  color #2c3e50
  background: #F9F9F9;
</style>
