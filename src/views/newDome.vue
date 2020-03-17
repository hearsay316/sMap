<template>
  <div class="newDome">
    <super-map
      ref="superMap"
      :url="url"
      :position-x-y-z="positionXYZ"
      :angle="angle"
      :Config="Config"
      :createWebgl="createWebgl"
      :mountedWebgl="mountedWebgl"
      :mountedOpenMap="mountedOpenMap"
      :errorOpenMap="errorOpenMap"
      :RegCesiumClickLayer="RegCesiumClickLayer"
      :RegCesiumClickLeft="RegCesiumClickLeft"
      :RegCesiumClickRight="RegCesiumClickRight"
    >
      <template v-slot:default>
        <div>dsewdewd</div>
        <div>房屋信息XXXXXXXXXXXXXXXXXXXX</div>
      </template>
      <template v-slot:nav>
        <!--        <div class="newDome-nav">-->
        <!--          <div @click="addFire">添加火</div>-->
        <!--          <div>2</div>-->
        <!--          <div>3</div>-->
        <!--          <div>4</div>-->
        <!--        </div>-->
        <superNav></superNav>
      </template>
    </super-map>
  </div>
</template>
<!--
1. 点火完毕
2 添加小车
3 等等..

-->
<script>
import { demoConfig } from "../config/mapConfig";
import { viewerMountedFire } from "../config/Configuration";
let viewer;
import superNav from "../components/superNav";

export default {
  name: "newDome",
  data() {
    return {
      ...demoConfig
    };
  },
  methods: {
    addFire() {
      viewerMountedFire(viewer, this.MapFireXYZ);
    },
    RegCesiumClickLeft(e, position) {
      console.log("Left", e, position);
    },
    RegCesiumClickRight(e, position) {
      console.log("Right", e, position);
    },

    mountedWebgl(v) {
      console.log(viewer, 666);
      viewer = v;
    },
    mountedOpenMap(viewer, layers) {},
    createWebgl(vm) {
      // vm是 superMap的this
    },
    errorOpenMap(e) {},
    RegCesiumClickLayer(feature) {
      this.layerTitle = feature.SMID;
      console.log(feature);
      // this.$message("这个是" + JSON.stringify(feature));
    }
  },
  components: {
    superNav
  }
};
</script>

<style lang="stylus">
.newDome .cesium-viewer-navigationContainer
    display none

.newDome
    position relative
    width:100%
    height:100%
    overflow hidden
    .newDome-nav
        width:200px
        height:200px
        background #0e90d2
        position absolute
        display flex
        flex-direction column
        top 0
        right 0
        div
            height 50px
            line-height 50px
            box-sizing border-box
        :not(first-of-type)
            border-top 1px solid blue
</style>
