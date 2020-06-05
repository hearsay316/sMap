// 所有的组件的入口

import superMap from "./superMap.vue";
import superMapTransition from "./superMap-transition";
const install = (Vue, options) => {
  // 单利每次都能返回一个新的options,防止被修改
  Vue.prototype._Cesium = () => options;
  // superMap.__Cesium = () => options;
  Vue.component(superMap.name, superMap);
  Vue.component(superMapTransition.name, superMapTransition);
};

// 有可能组件会通过script标签的方式引入
// <script src="superMap"></script>

if (typeof window.Vue !== "undefined") {
  install(Vue); // 全局直接通过script 引用的方式会默认调用install方法
}

export default {
  install
};
