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
  {
    path: "/home",
    name: "home",
    meta: {
      title: "地球",
      icon:
        "http://support.supermap.com.cn:8090/webgl/examples/img/ImageryAdjustment.jpg"
    },
    component: () => import(/* webpackChunkName: "Home" */ "../views/Home.vue")
  },
  {
    path: "/about",
    name: "about",
    meta: {
      title: "地形影像",
      icon:
        "http://support.supermap.com.cn:8090/webgl/examples/img/terrainAndImagery.jpg"
    },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue")
  },
  {
    path: "/Suofeiya",
    name: "Suofeiya",
    meta: {
      title: "倾斜模型",
      icon:
        "http://support.supermap.com.cn:8090/webgl/examples/img/S3MTiles_suofeiya.jpg"
    },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "Suofeiya" */ "../views/Suofeiya.vue")
  },
  {
    path: "/Particle",
    name: "Particle",
    meta: {
      title: "鸟巢火炬",
      icon:
        "http://support.supermap.com.cn:8090/webgl/examples/img/Particle System_Fire.jpg"
    },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "Suofeiya" */ "../views/Particle.vue")
  },
  {
    path: "/S3MTiles",
    name: "S3MTiles",
    meta: {
      title: "S3MTiles",
      icon:
        "http://support.supermap.com.cn:8090/webgl/examples/img/S3MTiles.jpg"
    },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "Suofeiya" */ "../views/S3MTiles.vue")
  },
  {
    path: "/ParticleWater",
    name: "ParticleWater",
    meta: {
      title: "ParticleWater",
      icon:
        "http://support.supermap.com.cn:8090/webgl/examples/img/S3MTiles.jpg"
    },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "ParticleWater" */ "../views/ParticleWater.vue")
  }
];

const router = new VueRouter({
  routes
});

export default router;
