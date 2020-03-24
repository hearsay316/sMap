<template>
  <div class="superMap">
    <div id="superMap"></div>
    <div id="bubble" class="bubble">
      <slot></slot>
    </div>
    <slot name="nav"></slot>
    <slot name="popup"></slot>
    <slot name="plot"></slot>
    <slot name="popupActive"></slot>
    <slot name="popupActiveEnd"></slot>
    <slot name="measure"></slot>
  </div>
</template>

<script>
import * as map from "../config/Configuration";
//todo  props需要做验证
export default {
  name: "superMap",
  props: {
    url: String,
    Config: Object,
    positionXYZ: Object,
    Angle: Object,
    earth: Object,
    mountedWebgl: Function,
    createWebgl: Function,
    mountedOpenMap: Function,
    errorOpenMap: Function,
    RegCesiumClickLayer: Function,
    RegCesiumClickLeft: Function,
    RegCesiumClickRight: Function
  },
  async mounted() {
    this.createWebgl && this.createWebgl(this);
    let viewer = this.createCesium("superMap");
    viewer.customInfobox = document.querySelector("#bubble");
    this.mountedWebgl && this.mountedWebgl(viewer);
    const scene = viewer.scene;
    await this.openMap({
      viewer,
      url: this.url,
      Config: this.Config,
      earth: this.earth,
      mountedOpenMap: this.mountedOpenMap,
      errorOpenMap: this.errorOpenMap
    });
    this.Config &&
      this.CesiumClickLayer(viewer, feature => {
        this.RegCesiumClickLayer && this.RegCesiumClickLayer(feature);
      });
    this.RegCesiumClickLeft &&
      this.CesiumClickLeft(scene, this.RegCesiumClickLeft);
    this.RegCesiumClickRight &&
      this.CesiumClickRight(scene, this.RegCesiumClickRight);
  },
  methods: {
    ...map
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
  background: #ffffff;
  padding: 8px;
  border-radius: 3px;
}
</style>
