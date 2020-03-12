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
    Config: String,
    positionXYZ: Object,
    Angle: Object,
    mountedWebgl: Function,
    createWebgl: Function,
    mountedOpenMap: Function,
    errorOpenMap:Function
  },
  async mounted() {
    this.createWebgl && this.createWebgl();
    let viewer = this.createCesium("superMap");
    console.log(viewer, 1111);
    this.mountedWebgl && this.mountedWebgl(viewer);
    let scene = viewer.scene;
    await this.openMap(
      scene,
      this.url,
      this.Config,
      this.positionXYZ,
      this.Angle,
      this.mountedOpenMap,
        this.errorOpenMap
    );
  },
  methods: {
    ...map
  }
};
</script>

<style scoped></style>
