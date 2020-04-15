import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import router from "./router";
import "./plugins/element.js";

Vue.config.productionTip = false;
import superMap from "./packages/index";
Vue.use(superMap, {
  path: "zhge shi dizhi "
});
new Vue({
  store,
  router,
  render: h => h(App)
}).$mount("#app");
