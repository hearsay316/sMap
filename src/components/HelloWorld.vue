<template>
  <div class="hello">
    <div id="cesiumContainer"></div>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  props: {
    msg: String
  },
  mounted() {
    /* eslint-disable */
    var viewer = new Cesium.Viewer("cesiumContainer");
    /* eslint-enable */
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
#cesiumContainer {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  margin: 0;
  overflow: hidden;
  padding: 0;
  font-family: sans-serif;
}
</style>
