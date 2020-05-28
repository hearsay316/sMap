<template>
  <superMap
    :url="url"
    :earth="positionXYZ"
    :Config="Config"
    :createWebgl="createWebgl"
    :mountedWebgl="mountedWebgl"
    :mountedOpenMap="mountedOpenMap"
    :errorOpenMap="errorOpenMap"
    :RegCesiumClickLayer="RegCesiumClickLayer"
    :RegCesiumClickLeft="RegCesiumClickLeft"
    :RegCesiumClickRight="RegCesiumClickRight"
  >
    <div>这个是卡槽{{ layerTitle }}</div>
  </superMap>
</template>

<script>
// import { demoSingConfig } from "../config/mapConfig";

export default {
  name: "rvt图层SuperMap.vue",
  data() {
    return {
      layerTitle: "",
      url:
        "https://47.103.125.18:8443/iserver/services/3D-supermap03261643/rest/realspace",
      positionXYZ: {
        //地球来的地址
        positionXYZ: {
          x: -31907059.63158584,
          y: 31790256.53609646,
          z: 6842226.596228782
        },
        orientation: {
          heading: 5.748175488108613,
          pitch: -1.5279875767724511,
          roll: 0
        }
      },
      Config: {
        name: "Test4",
        setQueryParameter: {
          url:
            "https://47.103.125.18:8443/iserver/services/data-ditie/rest/data",
          isMerge: true,
          dataSourceName: "Test4"
        }
        // setQueryParameter 设置属性查询参数
        //      Name	        Type	  Default    Description
        //      options	        Object	             对象具有以下属性
        //      url	String		optional             数据服务url。
        //      dataSourceName	String		         optional数据源名称。
        //      dataSetName	    String		         optional数据集名称。
        //      isMerge	        Boolean		         optional该图层是否为合并数据集的，如果是则不用指定数据集名称。
        //      hasGeometry	    Boolean	    false	 optional属性查询返回结果是否包含几何信息。
      }
    };
  },
  mounted() {},
  methods: {
    RegCesiumClickLeft(e, position) {
      console.log("Left", e, position);
    },
    RegCesiumClickRight(e, position) {
      console.log("Right", e, position);
    },

    mountedWebgl(viewer) {
      this.viewer = viewer;
      console.log(viewer, 666);
    },
    mountedOpenMap(viewer, layers) {},
    createWebgl(vm) {
      // vm是 superMap的this
    },
    errorOpenMap(e) {},
    RegCesiumClickLayer(feature) {
      this.layerTitle = feature.SMID;
      console.log(feature);
    }
  }
};
</script>

<style scoped></style>
