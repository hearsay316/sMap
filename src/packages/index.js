// 所有的组件的入口

import superMap from "./superMap.vue";
const install = Vue => {
  Vue.component(superMap.name, superMap);
};

// 有可能组件会通过script标签的方式引入
// <script src="superMap"></script>

if (typeof window.Vue !== "undefined") {
  install(Vue); // 全局直接通过script 引用的方式会默认调用install方法
}

export default {
  install
};
