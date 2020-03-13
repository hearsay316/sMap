<template>
  <div class="superMap">
    <div id="superMap"></div>
  </div>
</template>

<script>
import * as map from "../config/Configuration";
export default {
  name: "superMap",
  props: {
    // :url="url" :Config="Config" :positionXYZ="positionXYZ" :Angle="Angle"
    url: String,
    Config: Object,
    positionXYZ: Object,
    Angle: Object,
    mountedWebgl: Function,
    createWebgl: Function,
    mountedOpenMap: Function,
    errorOpenMap: Function,
    mountedCesiumClickLayer: Function
  },
  async mounted() {
    this.createWebgl && this.createWebgl();
    let viewer = this.createCesium("superMap");
    this.mountedWebgl && this.mountedWebgl(viewer);
    const scene = viewer.scene;
    await this.openMap({
      viewer,
      url: this.url,
      Config: this.Config,
      positionXYZ: this.positionXYZ,
      Angle: this.Angle,
      mountedOpenMap: this.mountedOpenMap,
      errorOpenMap: this.errorOpenMap
    });
    this.Config &&
      this.CesiumClickLayer(viewer, feature => {
        this.mountedCesiumClickLayer && this.mountedCesiumClickLayer(feature);
      });
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
</style>
