<template>
  <div class="newDome">
    <super-map
      ref="superMap"
      :url="url"
      :position-x-y-z="positionXYZ"
      :angle="angle"
      :Config="Config"
      :createWebgl="createWebgl"
      :mountedWebgl="mountedWebgl"
      :mountedOpenMap="mountedOpenMap"
      :errorOpenMap="errorOpenMap"
      :RegCesiumClickLeft="RegCesiumClickLeft"
      :RegCesiumClickRight="RegCesiumClickRight"
    >
      <template v-slot:default>
        <div>dsewdewd</div>
        <div>房屋信息XXXXXXXXXXXXXXXXXXXX</div>
      </template>
      <template v-slot:nav>
        <superNav
          :baseUrl="baseUrl"
          :picUrl="picUrl"
          @handleClick="handleClick"
        ></superNav>
      </template>
      <template v-slot:popup>
        <superPopup
          v-if="baseUrlOne.active"
          :baseUrlOne="baseUrlOne"
          :baseUrlItem1="baseUrlItem1"
          @handlePopupTitleIco="handlePopupTitleIco"
          @addFire="addFire"
          @addCarts="addCarts"
        ></superPopup>
      </template>
      <template v-slot:plot>
        <superPlot
          :superPlotIndex="superPlotIndex"
          @handlePopupTitleIco="clearTitle"
        ></superPlot>
      </template>
      <template v-slot:popupActive>
        <div v-if="baseUrlThree.active" class="popupActive">
          <div class="popupActive-title">
            <img src="../assets/popupActive-g-2.png" alt="" />
            <div class="popupActive-title-desc">
              <div class="popupActive-title-gb">是否发起总攻</div>
              <div class="popupActive-title-left" @click="popupActiveTitle(1)">
                是
              </div>
              <div class="popupActive-title-right" @click="popupActiveTitle(0)">
                否
              </div>
            </div>
          </div>
        </div>
      </template>
    </super-map>
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
  InitPlot
} from "../config/Configuration";
let viewer, carts, Fire;
import superNav from "../components/superNav";
import picUrl, { baseUrl, item1 } from "../config/imgIcoConfig";
export default {
  name: "newDome",
  data() {
    return {
      ...demoConfig,
      picUrl: {
        ...picUrl
      },
      baseUrl: [...baseUrl],
      baseUrlItem1: [...item1],
      superPlotIndex: -1,
      isRescue: false
    };
  },
  methods: {
    clearTitle(value) {
      console.log(value);
      this.superPlotIndex = -1;
      this.handlePopupTitleIco(2);
    },
    handlePopupTitleIco(index) {
      this.baseUrl[index].active = !this.baseUrl[index].active;
    },
    handleClick(itemIndex) {
      if (itemIndex == 3 && !this.rescueActive) {
        return;
      } else if (itemIndex == 3 && this.rescueActive) {
        //this.rescue();
        this.isRescue = true;
      }
      this.baseUrl.forEach((item, index) => {
        itemIndex == index ? (item.active = 1) : (item.active = 0);
      });
      itemIndex == 2 ? (this.superPlotIndex = 666) : (this.superPlotIndex = -1);
    },
    clearBaseUrl() {
      this.baseUrl.forEach(item => {
        item.active = false;
      });
    },
    popupActiveTitle(value) {
      console.log(value);
      value && this.rescue();
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
      isRescue && this.clearStatusAll();
      isRescue && this.clearEntities(carts);
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
      console.log(this.baseUrlItem1, this.baseUrl);
    },
    addFire(index, item) {
      console.log(item);
      this.baseUrlItem1[index].active = true;
      Fire = viewerMountedFire(viewer, this.MapFireXYZ);
    },
    addCarts(index, item) {
      this.baseUrlItem1[index].active = true;
      carts = viewerMountedDeployCart(viewer, this.positionCarts);
    },
    RegCesiumClickLeft(e, position) {
      console.log("Left", e, position);
    },
    RegCesiumClickRight(e, position) {
      console.log("Right", e, position);
    },

    mountedWebgl(v) {
      viewer = v;
    },
    mountedOpenMap(viewer, layers) {
      console.log(viewer, 666);
      try {
        InitPlot(viewer, this.serverUrl);
      } catch (e) {
        console.log(e);
      }
    },
    createWebgl(vm) {
      // vm是 superMap的this
    },
    errorOpenMap(e) {},
    RegCesiumClickLayer(feature) {
      this.layerTitle = feature.SMID;
      console.log(feature);
      // this.$message("这个是" + JSON.stringify(feature));
    }
  },
  components: {
    superNav,
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
.popupActive
      position absolute
      width 400px
      height: 225px
      top 0
      left 0
      right 0
      bottom 0
      margin auto
      background-color #0e2d5f
      background url("../assets/popupActive-bg-1.gif")  no-repeat 50% 50%
    .popupActive-title
        position absolute
        height: 100%
        top 0
        left 0
        right 0
        bottom 0
        margin auto
        img
          height:100%
          transform scale(1.08)
          opacity 0.55
        .popupActive-title-desc
            position absolute
            top 0
            left 0
            right 0
            bottom 0
            display flex
            flex-direction column
            .popupActive-title-gb
                font-size 48px
                height calc(100% - 120px)
                display flex
                flex-direction column-reverse
                color #D7EFF9
            .popupActive-title-left
                width:87px;
                height:36px;
                line-height 36px
                font-size 24px
                color #FBFBFB
                background:#0C8BC8;
                border-radius:10px;
                position absolute
                left 100px
                bottom 31px
            .popupActive-title-right
                position absolute
                width:87px;
                height:36px;
                line-height 36px
                font-size 24px
                color #91C1DA
                background:#76ADC8;
                border-radius:10px;
                right 100px
                bottom 31px
</style>
