<template>
  <div class="superMap">
    <div class="superMap-item" ref="superMap"></div>
    <slot></slot>
  </div>
</template>

<!--suppress JSCheckFunctionSignatures, NpmUsedModulesInstalled -->
<script>
import * as map from "../config/Configuration";
// import Cesium from "Cesium";
//todo  props需要做验证
export default {
  name: "superMap",
  props: {
    path: String,
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
    // await this.Init();
  },
  async created() {
    let arr = [["http://cdn.j6375x.cn/cdn/superMap/Build/Cesium/Cesium.js"]];
    typeof Cesium != "undefined" &&
      this.scriptAdd(arr).then(async res => {
        console.log(typeof Cesium, "顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶");
        await this.Init(window.Cesium);
      });
    // 开始封装动态加载 _Cesium
    console.log(this._Cesium(), this);
  },
  methods: {
    async Init(Cesium) {
      //http://cdn.j6375x.cn/cdn/superMap/Build/Cesium/Cesium.js

      // 创建createWebgl之前的用户传来的函数
      this.createWebgl && this.createWebgl(this);
      // 获取dom
      const superMap = this.$refs.superMap;
      // 创建 三维实例
      this.viewer = this.createCesium(superMap, Cesium);
      console.log(
        this.viewer,
        "this.viewerthis.viewerthis.viewerthis.viewerthis.viewerthis.viewerthis.viewerthis.viewerthis.viewerthis.viewer"
      );
      // 绑定 创建单体化弹框的dom
      this.viewer.customInfobox = document.querySelector("#bubble");
      // 创建三维之后
      this.mountedWebgl && this.mountedWebgl(this.viewer, Cesium);
      const scene = this.viewer.scene;
      // 打开三维模型
      // 这个是不是应该用promise 重写?
      this.url &&
        (await this.openMap({
          viewer: this.viewer, //视图实例 ,千万不要把视图实例绑定在data上
          url: this.url, //  url
          config: this.config, // config配置
          earth: this.earth, // 跳转的三位模式
          mountedOpenMap: this.mountedOpenMap, // 创建之后执行的函数
          errorOpenMap: this.errorOpenMap // 报错之后的回调
        }));
      // 注册单体化点击事件
      this.config &&
        this.CesiumClickLayer(this.viewer, feature => {
          this.regCesiumClickLayer && this.regCesiumClickLayer(feature);
        });
      // 左键
      this.regCesiumClickLeft &&
        this.CesiumClickLeft(scene, this.regCesiumClickLeft, Cesium);
      // 右键
      this.regCesiumClickRight &&
        this.CesiumClickRight(scene, this.regCesiumClickRight, Cesium);
    },
    link(url) {
      return new Promise((resolve, reject) => {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.onload = function() {
          resolve(1);
        };
        link.onerror = function() {
          reject(0);
        };
        link.href = "webgl/examples/js/plotPanelControl/" + url;
        document.getElementsByTagName("head")[0].appendChild(link);
      });
    },
    script(url) {
      return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.type = "text/javascript";
        if (script.readyState) {
          //IE
          script.onreadystatechange = function() {
            if (
              script.readyState == "loaded" ||
              script.readyState == "complete"
            ) {
              script.onreadystatechange = null;
              resolve(1);
            }
          };
        } else {
          //Others
          script.onload = function() {
            resolve(1);
          };
          script.onerror = function() {
            reject(0);
          };
        }
        //"webgl/examples/js/plotPanelControl/"
        script.src = url;
        document.getElementsByTagName("head")[0].appendChild(script);
      });
    },
    scriptAdd(arr) {
      const vm = this;
      let index = 0,
        dataIndex = 0;
      async function next(arr, index, dataIndex) {
        console.log(arr, index, dataIndex);
        if (
          arr.length === index + 1 &&
          arr[arr.length - 1].length === dataIndex
        ) {
          return { type: 1 };
        }
        if (arr[index].length === dataIndex) {
          return next(arr, ++index, 0);
        }
        let data = await vm.processUrl(arr[index][dataIndex++]);
        if (data === 1) {
          return await next(arr, index, dataIndex);
        }
      }
      return next(arr, index, dataIndex);
    },
    processUrl(url) {
      return url.includes(".css")
        ? this.link(url)
        : url.includes(".js")
        ? this.script(url)
        : void 0;
    },
    ...map
  },
  destroyed() {
    // console.log("开始destroyed");
    // const { ScreenSpaceEventType, KeyboardEventModifier } = Cesium;
    // const inputHandler = this.viewer.screenSpaceEventHandler;
    // inputHandler.removeInputAction(ScreenSpaceEventType.MOUSE_MOVE);
    // inputHandler.removeInputAction(ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    // inputHandler.removeInputAction(
    //   ScreenSpaceEventType.LEFT_DOUBLE_CLICK,
    //   KeyboardEventModifier.SHIFT
    // );
    // this.viewer.destroy && this.viewer.destroy();
  }
};
</script>
<style scoped>
.superMap,
#superMap {
  height: 100%;
}
.superMap-item {
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
