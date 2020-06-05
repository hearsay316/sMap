import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "index",
    meta: {
      title: "导航"
    },
    component: () =>
      import(/* webpackChunkName: "index" */ "../views/index.vue")
  },
  // {
  //   path: "/home",
  //   name: "home",
  //   meta: {
  //     title: "地球",
  //     icon:
  //       "http://support.supermap.com.cn:8090/webgl/examples/img/ImageryAdjustment.jpg"
  //   },
  //   component: () => import(/* webpackChunkName: "Home" */ "../views/Home.vue")
  // },
  // {
  //   path: "/about",
  //   name: "about",
  //   meta: {
  //     title: "地形影像",
  //     icon:
  //       "http://support.supermap.com.cn:8090/webgl/examples/img/terrainAndImagery.jpg"
  //   },
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () =>
  //     import(/* webpackChunkName: "about" */ "../views/About.vue")
  // },
  // {
  //   path: "/Suofeiya",
  //   name: "Suofeiya",
  //   meta: {
  //     title: "倾斜模型",
  //     icon:
  //       "http://support.supermap.com.cn:8090/webgl/examples/img/S3MTiles_suofeiya.jpg"
  //   },
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () =>
  //     import(/* webpackChunkName: "Suofeiya" */ "../views/Suofeiya.vue")
  // },
  // {
  //   path: "/Particle",
  //   name: "Particle",
  //   meta: {
  //     title: "鸟巢火炬",
  //     icon:
  //       "http://support.supermap.com.cn:8090/webgl/examples/img/Particle System_Fire.jpg"
  //   },
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () =>
  //     import(/* webpackChunkName: "Particle" */ "../views/Particle.vue")
  // },
  // {
  //   path: "/S3MTiles",
  //   name: "S3MTiles",
  //   meta: {
  //     title: "S3MTiles",
  //     icon:
  //       "http://support.supermap.com.cn:8090/webgl/examples/img/S3MTiles.jpg"
  //   },
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () =>
  //     import(/* webpackChunkName: "S3MTiles" */ "../views/S3MTiles.vue")
  // },
  // {
  //   path: "/ParticleWater",
  //   name: "ParticleWater",
  //   meta: {
  //     title: "ParticleWater",
  //     icon:
  //       "http://support.supermap.com.cn:8090/webgl/examples/img/S3MTiles.jpg"
  //   },
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () =>
  //     import(
  //       /* webpackChunkName: "ParticleWater" */ "../views/ParticleWater.vue"
  //     )
  // },
  // {
  //   path: "/demo",
  //   name: "demo",
  //   meta: {
  //     title: "演示1-按钮版",
  //     icon:
  //       "http://support.supermap.com.cn:8090/webgl/examples/img/S3MTiles.jpg"
  //   },
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "demo" */ "../views/demo.vue")
  // },
  // {
  //   path: "/demo2",
  //   name: "demo2",
  //   meta: {
  //     title: "演示2-提示版",
  //     icon:
  //       "http://support.supermap.com.cn:8090/webgl/examples/img/S3MTiles.jpg"
  //   },
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () =>
  //     import(/* webpackChunkName: "demo2" */ "../views/demo2.vue")
  // },
  // {
  //   path: "/plot_dynamicPlot",
  //   name: "plot_dynamicPlot",
  //   meta: {
  //     title: "动态标绘",
  //     icon:
  //       "http://support.supermap.com.cn:8090/webgl/examples/img/S3MTiles.jpg"
  //   },
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () =>
  //     import(
  //       /* webpackChunkName: "plot_dynamicPlot" */ "../views/plot_dynamicPlot.vue"
  //     )
  // },
  // {
  //   path: "/plot_dynamicPlot_icon",
  //   name: "plot_dynamicPlot_icon",
  //   meta: {
  //     title: "动态标绘图标",
  //     icon:
  //       "http://support.supermap.com.cn:8090/webgl/examples/img/S3MTiles.jpg"
  //   },
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () =>
  //     import(
  //       /* webpackChunkName: "plot_dynamicPlot_icon" */ "../views/plot_dynamicPlot_icon.vue"
  //     )
  // },
  // {
  //   path: "/demo3",
  //   name: "demo3",
  //   meta: {
  //     title: "完整演示",
  //     icon:
  //       "http://support.supermap.com.cn:8090/webgl/examples/img/S3MTiles.jpg"
  //   },
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () =>
  //     import(/* webpackChunkName: "demo3" */ "../views/demo3.vue")
  // },
  // {
  //   path: "/rvt",
  //   name: "rvt图层",
  //   meta: {
  //     title: "rvt图层",
  //     icon:
  //       "http://support.supermap.com.cn:8090/webgl/examples/img/S3MTiles.jpg"
  //   },
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () =>
  //     import(/* webpackChunkName: "rvt图层" */ "../views/rvt图层.vue")
  // },
  // {
  //   path: "/rvtSuperMap",
  //   name: "rvt图层SuperMap",
  //   meta: {
  //     title: "rvt图层SuperMap",
  //     icon:
  //       "http://support.supermap.com.cn:8090/webgl/examples/img/S3MTiles.jpg"
  //   },
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () =>
  //     import(
  //       /* webpackChunkName: "rvt图层SuperMap" */ "../views/rvt图层SuperMap.vue"
  //     )
  // },

  {
    path: "/newDome",
    name: "newDome",
    meta: {
      title: "newDome",
      icon:
        "https://www.huaitaos.com:8443/iserver/iClient/for3D/webgl/zh/examples/img/terrainAndImagery.jpg"
    },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "newDome" */ "../views/newDome.vue")
  },
  {
    path: "/Polyline",
    name: "Polyline",
    meta: {
      title: "Polylines",
      icon:
        "https://www.huaitaos.com:8443/iserver/iClient/for3D/webgl/zh/examples/img/terrainAndImagery.jpg"
    },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "newDome" */ "../views/Polyline.vue")
  },
  {
    path: "/Cesium-01",
    name: "Cesium-01.vue",
    meta: {
      title: "Cesium-01.vue",
      icon:
        "https://www.huaitaos.com:8443/iserver/iClient/for3D/webgl/zh/examples/img/terrainAndImagery.jpg"
    },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "Cesium-01.vue" */ "../views/Cesium-01.vue")
  }
];

const router = new VueRouter({
  routes
});

export default router;
