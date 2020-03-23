<template>
  <div class="newDome">
    <!--超图的实例-->
    <super-map
      ref="superMap"
      :url="url"
      :position-x-y-z="positionXYZ"
      :angle="angle"
      :Config="Config"
      :earth="earth"
      :createWebgl="createWebgl"
      :mountedWebgl="mountedWebgl"
      :mountedOpenMap="mountedOpenMap"
      :errorOpenMap="errorOpenMap"
      :RegCesiumClickLeft="RegCesiumClickLeft"
      :RegCesiumClickRight="RegCesiumClickRight"
      :RegCesiumClickLayer="RegCesiumClickLayer"
    >
      <template v-slot:default>
        <!--单体化的提示框-->
        <div class="default-img">
          <img
            src="http://img1.imgtn.bdimg.com/it/u=1769822317,2460540396&fm=26&gp=0.jpg"
          />
        </div>
        <div>建筑用材存放</div>
      </template>
      <template v-slot:nav>
        <!--这个是导航栏
        v-if="isSuperNav"
        :baseUrl="baseUrl"  导航栏的主要信息 数据
        :picUrl="picUrl"  背景图信息 数据
        @handleClick="handleClick" 点击导航栏的自定义事件

        -->
        <superNav
          v-if="isSuperNav"
          :baseUrl="baseUrl"
          :picUrl="picUrl"
          @handleClick="handleClick"
        ></superNav>
      </template>
      <template v-slot:popup>
        <!--  弹出框
          @handlePopupTitleIco 点击隐藏的自定义函数
          v-if="baseUrlOne.active"   baseUrlOne 是导航栏的baseUrl项
          :baseUrlOne="baseUrlOne"  用来if的数据  baseUrlOne 是导航栏的baseUrl项
          :baseUrlItem1="baseUrlItem1" 主数据
          @addFire="addFire" 从一到8的点击后的执行函数 这个耦合太高 需要重新思考
          @addCarts="addCarts"
          @measureDis="measureDis"
          @measureArea="measureArea"
          @measureHeight="measureHeight"
          @clearMeasure="clearMeasure"
        -->
        <superPopup
          v-if="baseUrlOne.active"
          :baseUrlOne="baseUrlOne"
          :baseUrlItem1="baseUrlItem1"
          @handlePopupTitleIco="handlePopupTitleIco"
          @addFire="addFire"
          @addCarts="addCarts"
          @measureDis="measureDis"
          @measureArea="measureArea"
          @measureHeight="measureHeight"
          @clearMeasure="clearMeasure"
        ></superPopup>
      </template>
      <template v-slot:plot>
        <!--
        标绘面板
         superPlotIndex  定位的z-index值
         @handlePopupTitleIco 点击隐藏的自定义函数
         -->
        <superPlot
          :superPlotIndex="superPlotIndex"
          @handlePopupTitleIco="clearTitle"
        ></superPlot>
      </template>
      <template v-slot:popupActive>
        <!-- 救援行动启动的弹出框  -->
        <popupActiveTitle
          :popupActiveTitleDesc="popupActiveTitleDesc"
          v-if="baseUrlThree.active"
        >
          <div class="popupActive-title-left" @click="popupActiveTitle(1)">
            是
          </div>
          <div class="popupActive-title-right" @click="popupActiveTitle(0)">
            否
          </div>
        </popupActiveTitle>
      </template>
      <template v-slot:popupActiveEnd>
        <!--救援行动结束的体验-->
        <popupActiveTitle
          :popupActiveTitleDesc="popupActiveEndDesc"
          v-if="popupActiveTitleDescActive"
        >
        </popupActiveTitle>
      </template>
    </super-map>
    <!--首页显示的按钮-->
    <div
      class="newDome-title"
      v-if="isNewDomeTitle"
      @click="handleNewDomeTitle"
    >
      进入场景
    </div>
  </div>
</template>
<!--
1. 点火完毕
2 添加小车
3 等等..
      :RegCesiumClickLayer="RegCesiumClickLayer"

-->
<script>
import { demoConfig } from "../config/mapConfig";
import {
  viewerCreateFireFighting,
  viewerMountedDeployCart,
  viewerMountedFire,
  InitPlot,
  viewerHandlerDis,
  viewerHandlerArea,
  viewerHandlerHeight,
  setView
} from "../config/Configuration";
let viewer, carts, Fire, handlerDis, handlerArea, handlerHeight;
import superNav from "../components/superNav";
import popupActiveTitle from "../components/popupActiveTitle";

import picUrl, { baseUrl, item1 } from "../config/imgIcoConfig";
export default {
  name: "newDome",
  data() {
    return {
      ...demoConfig,
      isNewDomeTitle: true,
      picUrl: {
        ...picUrl
      },
      isSuperNav: false,
      baseUrl: [...baseUrl],
      baseUrlItem1: [...item1],
      superPlotIndex: -1,
      isRescue: false,
      popupActiveEndDesc: "总攻结束",
      popupActiveTitleDesc: "是否发起总攻",
      popupActiveTitleDescActive: false
    };
  },
  methods: {
    handleNewDomeTitle() {
      this.isNewDomeTitle = false;
      setView(viewer, this.positionXYZ, this.angle);
      this.isSuperNav = true;
    },
    clearTitle(value) {
      this.superPlotIndex = -1;
      this.handlePopupTitleIco(2);
    },
    handlePopupTitleIco(index) {
      this.baseUrl[index].active = !this.baseUrl[index].active;
    },
    //
    navHandleClick() {
      let vm = this;
      return {
        navHandleClick1(itemIndex) {
          return true;
        },
        navHandleClick2(itemIndex) {
          return (vm.superPlotIndex = 666);
        },
        navHandleClick3(itemIndex) {
          return vm.rescueActive ? (vm.isRescue = true) : false;
        },
        navHandleClick0(itemIndex) {
          return true;
        },
        navHandleClick4(itemIndex) {
          return true;
        }
      };
    },
    handleClick(itemIndex) {
      itemIndex !== 2 ? (this.superPlotIndex = -1) : void 0;
      // 根据itemIndex执行对应的方法
      let navHandleClick = this.navHandleClick();
      let isNavHandleClick = navHandleClick[`navHandleClick${itemIndex}`](
        itemIndex
      );
      // 清除所有状态
      this.baseUrl.forEach((item, index) => {
        isNavHandleClick && itemIndex === index
          ? (item.active = 1)
          : (item.active = 0);
      });
    },
    clearBaseUrl() {
      this.baseUrl.forEach(item => {
        item.active = false;
      });
    },
    popupActiveTitle(value) {
      value && this.rescue();
      value ? (this.isSuperNav = false) : void 0;
      this.isRescue = false;
      this.clearBaseUrl();
    },
    async rescue() {
      let isRescue = await viewerCreateFireFighting(
        viewer,
        this.MapFireXYZ,
        this.positionCarts,
        carts,
        Fire
      );
      this.popupActiveTitleDescActive = true;
      isRescue && this.clearStatusAll();
      isRescue && this.clearEntities(carts);
      let time = setTimeout(() => {
        clearTimeout(time);
        this.popupActiveTitleDescActive = false;
        this.isSuperNav = true;
      }, 4000);
    }, //viewer.entities.remove
    clearEntities(Entities) {
      let Types = Object.prototype.toString.call(Entities);
      typeof this[`Entities${Types}`] === "function"
        ? this[`Entities${Types}`](Entities)
        : this.isError("Entities 类型错误");
    },
    isError(desc) {
      throw new Error(desc);
    },
    "Entities[object Array]"(Entities) {
      Entities.forEach(entity => {
        viewer.entities.remove(entity);
      });
    },
    "Entities[object Object]"(Entities) {
      viewer.entities.remove(Entities);
    },
    clearStatusAll() {
      this.baseUrl.forEach(item => {
        item.active = false;
      });

      this.baseUrlItem1.forEach(item => {
        item.active = false;
      });
    },
    addFire(index, item) {
      this.baseUrlItem1[index].active = true;
      Fire = viewerMountedFire(viewer, this.MapFireXYZ);
    },
    addCarts(index, item) {
      this.baseUrlItem1[index].active = true;
      carts = viewerMountedDeployCart(viewer, this.positionCarts);
    },
    deActiveAll() {
      handlerDis && handlerDis.deactivate();
      handlerArea && handlerArea.deactivate();
      handlerHeight && handlerHeight.deactivate();
    },
    measureDis(index, item) {
      this.deActiveAll();
      this.baseUrlItem1[index].active = true;
      handlerDis
        ? void 0
        : (handlerDis = viewerHandlerDis(viewer, 0, this.baseUrlItem1, index));
      handlerDis && handlerDis.activate();
    },
    measureArea(index, item) {
      this.deActiveAll();
      this.baseUrlItem1[index].active = true;
      handlerArea
        ? void 0
        : (handlerArea = viewerHandlerArea(
            viewer,
            0,
            this.baseUrlItem1,
            index
          ));
      handlerArea && handlerArea.activate();
    },
    measureHeight(index, item) {
      this.deActiveAll();
      this.baseUrlItem1[index].active = true;
      handlerHeight
        ? void 0
        : (handlerHeight = viewerHandlerHeight(
            viewer,
            0,
            this.baseUrlItem1,
            index
          ));
      handlerHeight && handlerHeight.activate();
    },
    clearMeasure() {
      handlerDis && handlerDis.clear();
      handlerArea && handlerArea.clear();
      handlerHeight && handlerHeight.clear();
    },
    RegCesiumClickLeft(e, position) {
      console.log("Left", e, position, viewer);
    },
    RegCesiumClickRight(e, position) {
      console.log("Right", e, position);
    },
    mountedWebgl(v) {
      viewer = v;
    },
    mountedOpenMap(viewer, layers) {
      try {
        InitPlot(viewer, this.serverUrl);
      } catch (e) {
        console.log(e, layers);
      }
    },
    createWebgl(vm) {
      // vm是 superMap的this
    },
    errorOpenMap(e) {},
    RegCesiumClickLayer(feature) {
      this.layerTitle = feature.SMID;
      console.log(feature);
    }
  },
  components: {
    superNav,
    popupActiveTitle,
    superPopup: () => import("../components/superPopup"),
    superPlot: () => import("../components/superPlot")
  },
  computed: {
    baseUrlOne() {
      return this.baseUrl[1];
    },
    baseUrlThree() {
      return this.baseUrl[3];
    },
    rescueActive() {
      return this.baseUrlItem1[0].active && this.baseUrlItem1[1].active;
    }
  }
};
</script>

<style lang="stylus">
.newDome .cesium-viewer-navigationContainer
    display none

.newDome
    position relative
    width:100%
    height:100%
    overflow hidden
    .newDome-nav
        width:200px
        height:200px
        background #0e90d2
        position absolute
        display flex
        flex-direction column
        top 0
        right 0
        div
            height 50px
            line-height 50px
            box-sizing border-box
        :not(first-of-type)
            border-top 1px solid blue
  .newDome-title
      position absolute
      top 20px
      width 64px
      height 64px
      line-height 64px
      border-radius 8px
      color #ffffff
      background-color #0e2d5f
  .newDome-title:hover
      box-shadow 3px 2px 20px #213d96
</style>
