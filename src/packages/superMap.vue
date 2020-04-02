<template>
  <div class="superMap">
    <div class="superMap-item" ref="superMap"></div>
    <slot></slot>
  </div>
</template>

<!--suppress JSCheckFunctionSignatures, NpmUsedModulesInstalled -->
<script>
import * as map from "../config/Configuration";
import Cesium from "Cesium";
//todo  props需要做验证
export default {
  name: "superMap",
  props: {
    url: String,
    config: Object,
    earth: Object,
    mountedWebgl: Function,
    createWebgl: Function,
    mountedOpenMap: Function,
    errorOpenMap: Function,
    regCesiumClickLayer: Function,
    regCesiumClickLeft: Function,
    regCesiumClickRight: Function
  },
  async mounted() {
    this.createWebgl && this.createWebgl(this);
    const superMap = this.$refs.superMap;
    this.viewer = this.createCesium(superMap);
    this.viewer.customInfobox = document.querySelector("#bubble");
    this.mountedWebgl && this.mountedWebgl(this.viewer);
    const scene = this.viewer.scene;
    this.url &&
      (await this.openMap({
        viewer: this.viewer,
        url: this.url,
        config: this.config,
        earth: this.earth,
        mountedOpenMap: this.mountedOpenMap,
        errorOpenMap: this.errorOpenMap
      }));
    this.config &&
      this.CesiumClickLayer(this.viewer, feature => {
        this.regCesiumClickLayer && this.regCesiumClickLayer(feature);
      });
    this.regCesiumClickLeft &&
      this.CesiumClickLeft(scene, this.regCesiumClickLeft);
    this.regCesiumClickRight &&
      this.CesiumClickRight(scene, this.regCesiumClickRight);
  },
  methods: {
    ...map
  },
  destroyed() {
    console.log("开始destroyed");
    const { ScreenSpaceEventType, KeyboardEventModifier } = Cesium;
    const inputHandler = this.viewer.screenSpaceEventHandler;
    inputHandler.removeInputAction(ScreenSpaceEventType.MOUSE_MOVE);
    inputHandler.removeInputAction(ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    inputHandler.removeInputAction(
      ScreenSpaceEventType.LEFT_DOUBLE_CLICK,
      KeyboardEventModifier.SHIFT
    );
    this.viewer.destroy && this.viewer.destroy();
  }
};
</script>
<style scoped>
.superMap,
#superMap {
  height: 100%;
}
#bubble {
  position: absolute;
  margin: 0;
  background: transparent;
  max-width: none;
  max-height: none;
  text-align: left;
}
.bubble:after {
  border-color: transparent #34eff9;
}
</style>
