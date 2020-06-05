<template>
  <div class="superMap">
    <transition name="fade">
      <div v-show="superMapTransition" class="superMap-transition-loader">
        <super-map-transition></super-map-transition>
      </div>
    </transition>
    <div class="superMap-item" ref="superMap"></div>
    <slot></slot>
  </div>
</template>

<!--suppress JSCheckFunctionSignatures, NpmUsedModulesInstalled -->
<script>
import {
  createCesium,
  openMap,
  CesiumClickLayer,
  CesiumClickLeft,
  CesiumClickRight
} from "../config/Configuration";
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
    regCesiumClickRight: Function,
    superMapTransitionLoader: {
      type: Boolean,
      default: () => false
    }
  },
  data() {
    return {
      superMapTransitionItem: false
    };
  },
  computed: {
    superMapTransition() {
      if (this.superMapTransitionLoader) {
        return false;
      }
      return !this.superMapTransitionItem;
    }
  },
  async mounted() {
    await this.createCesiumInit();
  },
  async created() {},
  methods: {
    async createCesiumInit() {
      // typeof Cesium != "undefined" &&
      //   this.$refs.superMap &&
      //   (await this.Init(Cesium)); // 切换页面js 已经创建 所以就不用在创建dom 直接执行渲染代码
      // css从上到下会有覆盖,所以要和写在页面中的时候相反
      let basePathInit = this.basePathInit();
      console.log("开始加载Cesium函数");
      if (typeof Cesium === "undefined") {
        try {
          await this.urlUpRecursive(basePathInit);
          global.Cesium = Cesium;
          this.$refs.superMap && (await this.Init(window.Cesium));
        } catch (e) {
          console.log("加载Cesium函数失败");
        }
      } else {
        this.$refs.superMap && (await this.Init(window.Cesium));
      }
    },
    basePathInit() {
      const { path } = this._Cesium();
      if (!path) {
        throw new Error("path 错误");
      }
      let fucType = "path" + Object.prototype.toString.call(path);
      return typeof this[fucType] === "function" && this[fucType](path);
    },
    "path[object String]"() {},
    "path[object Array]"(path) {
      // url正则
      // const URL_REGULAR_EXPRESSION = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
      // const objExp = new RegExp(URL_REGULAR_EXPRESSION);
      // path.map(url => {
      //   console.log(objExp.test(url), "dddddddddddddddddd");
      // });
      return path;
    },
    async Init(Cesium) {
      // 创建createWebgl之前的用户传来的函数
      this.createWebgl && this.createWebgl(this);
      // 获取dom
      const superMap = this.$refs.superMap;
      // 创建 三维实例
      this.viewer = this.createCesium(superMap, Cesium);
      // 绑定 创建单体化弹框的dom
      this.viewer.customInfobox = document.querySelector("#bubble");
      // 创建三维之后
      this.mountedWebgl && this.mountedWebgl(this.viewer, Cesium);
      const scene = this.viewer.scene;
      // 打开三维模型
      this.url &&
        (await this.openMap(
          {
            viewer: this.viewer, //视图实例 ,千万不要把视图实例绑定在data上
            url: this.url, //  url
            config: this.config, // config配置
            earth: this.earth, // 跳转的三位模式
            mountedOpenMap: this.mountedOpenMap, // 创建之后执行的函数
            errorOpenMap: this.errorOpenMap // 报错之后的回调
          },
          Cesium
        ));
      // 打开三维模型后 隐藏加载动画
      this.superMapTransitionItem = true;
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
        //"webgl/examples/js/plotPanelControl/"
        link.href = url;
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
        document.getElementsByTagName("body")[0].appendChild(script);
      });
    },
    urlUpRecursive(arr) {
      const vm = this;
      let index = 0;
      async function next(arr, index) {
        console.log("正在开始加载_Cesium");
        if (arr.length === index) {
          return { type: 1 };
        }

        let data = await vm.processUrl(arr[index++]);
        if (data === 1) {
          return await next(arr, index);
        }
      }
      return next(arr, index);
    },
    processUrl(url) {
      return url.includes(".css")
        ? this.link(url)
        : url.includes(".js")
        ? this.script(url)
        : void 0;
    },
    createCesium,
    openMap,
    CesiumClickLayer,
    CesiumClickLeft,
    CesiumClickRight
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
    //window.Cesium = undefined;
    this.viewer.destroy && this.viewer.destroy();
    console.log("删除页面的数据防止数据出错");
  }
};
</script>
<style scoped>
.superMap {
  position: relative;
  height: 100vh;
  width: 100%;
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
.superMap-transition-loader {
  position: absolute;
  bottom: 20px;
  line-height: 60px;
  width: 300px;
  left: 0;
  right: 0;
  margin: auto;
  text-align: center;
  z-index: 10;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
