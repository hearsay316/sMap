<template>
  <superMap
    :url="url"
    :Config="Config"
    :positionXYZ="positionXYZ"
    :Angle="Angle"
    :createWebgl="createWebgl"
    :mountedWebgl="mountedWebgl"
    :mountedOpenMap="mountedOpenMap"
    :errorOpenMap="errorOpenMap"
    :mountedCesiumClickLayer="mountedCesiumClickLayer"
  ></superMap>
</template>

<script>
export default {
  name: "rvt图层SuperMap.vue",
  data() {
    return {
      url: "http://47.103.125.18:8090/iserver/services/3D-ditie/rest/realspace",
      positionXYZ: {
        x: -1209550.6137063126,
        y: 5655779.937735093,
        z: 2693085.689269533
      },
      Config: {
        name: "Test4",
        setQueryParameter: {
          url:"http://47.103.125.18:8090/iserver/services/data-ditie/rest/data",
          isMerge:true,
          dataSourceName:"Test4"
        }
        // setQueryParameter 设置属性查询参数
        //      Name	        Type	  Default    Description
        //      options	        Object	             对象具有以下属性
        //      url	String		optional             数据服务url。
        //      dataSourceName	String		         optional数据源名称。
        //      dataSetName	    String		         optional数据集名称。
        //      isMerge	        Boolean		         optional该图层是否为合并数据集的，如果是则不用指定数据集名称。
        //      hasGeometry	    Boolean	    false	 optional属性查询返回结果是否包含几何信息。
      },
      Angle: {
        heading: 5.470688272479366,
        pitch: -0.8606068847349784,
        roll: 7.638334409421077e-14
      }
    };
  },
  mounted() {},
  methods: {
    mountedWebgl(viewer) {
      console.log(viewer, 666);
    },
    mountedOpenMap() {},
    createWebgl() {},
    errorOpenMap(e) {},
    mountedCesiumClickLayer(feature){
      console.log(feature)
    },
  }
};
</script>

<style scoped></style>
