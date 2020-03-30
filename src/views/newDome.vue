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
        <superSingularization
          :superSingularizationData="superSingularizationData"
        ></superSingularization>
        <!--        <div class="default-img">-->
        <!--          <img-->
        <!--            src="http://img1.imgtn.bdimg.com/it/u=1769822317,2460540396&fm=26&gp=0.jpg"-->
        <!--          />-->
        <!--        </div>-->
        <!--        <div>建筑用材存放</div>-->
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
          :baseUrlItems="baseUrlItems" 主数据
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
          :baseUrlItems="baseUrlItems"
          @handlePopupTitleIco="handlePopupTitleIco"
          @handleClickLists="handleClickLists"
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
        <!-- 救援行动启动的弹出框
           popupActiveEndDesc  显示的文字
          -->
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
        <!--救援行动结束的体验
        popupActiveEndDesc  显示的文字
        -->
        <popupActiveTitle
          :popupActiveTitleDesc="popupActiveEndDesc"
          v-if="popupActiveTitleDescActive"
        >
        </popupActiveTitle>
      </template>
      <template v-slot:measure>
        <superMeasure
          v-if="isMeasure"
          :superMeasureData="superMeasureData"
          @handleSuperMeasureActiveItem="handleSuperMeasureActiveItem"
          @handleSuperMeasureActive="handleSuperMeasureActive"
          class="newDome-measure"
          :isSuperMeasure="isSuperMeasure"
        >
        </superMeasure>
      </template>
      <template v-slot:search>
        <superSearch
          :showSuperSearchInput="search.showSuperSearchInput"
          :searchData="search.setLocationFilter"
          @searchItem="searchItem"
          @searchValue="searchValue"
          @modShowSuperSearchInput="modShowSuperSearchInput"
        ></superSearch>
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
import { demoConfig, demoSingConfig } from "../config/mapConfig";
import { setLocation } from "../config/LocationConfig.js";
import {
  viewerCreateFireFighting,
  viewerMountedDeployCart,
  viewerMountedFire,
  InitPlot,
  viewerHandlerDis,
  viewerHandlerArea,
  viewerHandlerHeight,
  setView,
  viewerEntitiesAdd
} from "../config/Configuration";
import MeasuringConfig from "../config/MeasuringConfig.js";
let viewer,
  carts,
  Fire,
  handlerDis,
  handlerArea,
  handlerHeight,
  viewerEntities = [];
import picUrl, { baseUrl, item1 } from "../config/imgIcoConfig";
export default {
  name: "newDome",
  data() {
    return {
      ...demoSingConfig,
      superSingularizationData: {
        title: "大行仓库(厂房或者货场面积大于9000m2)dd",
        titleImg:
          "http://cdn.j6375x.cn/cdn/pic/img/superSingularization/001.png",
        desc: "标准结构",
        descImg:
          "http://cdn.j6375x.cn/cdn/pic/img/superSingularization/002.png",
        features:
          "机械加工制造、重工类：一般要求单层，而且对厂房的高度、地面承重有要求，部分行业要求行车梁，可以装行车（吊车）。",
        FeaturesImg:
          "http://cdn.j6375x.cn/cdn/pic/img/superSingularization/003.png"
      },
      isMeasure: false,
      search: {
        showSuperSearchInput: false,
        setLocation: [...setLocation],
        setLocationFilter: []
      },
      isNewDomeTitle: true,
      picUrl: {
        ...picUrl
      },
      superMeasureData: {
        ...MeasuringConfig
      },
      isSuperMeasure: false,
      isSuperNav: false,
      baseUrl: [...baseUrl],
      baseUrlItems: [...item1],
      superPlotIndex: -1,
      isRescue: false,
      popupActiveEndDesc: "总攻结束",
      popupActiveTitleDesc: "是否发起总攻",
      popupActiveTitleDescActive: false,
      Resources: {
        Active: {
          active: false,
          index: undefined,
          url: ""
        }
      }
    };
  },
  methods: {
    modShowSuperSearchInput(value) {
      this.search.showSuperSearchInput = value;
    },
    searchItem(item) {
      setView(viewer.scene, item.position, item.angle);
      this.search.showSuperSearchInput = false;
    },
    searchValue(value) {
      this.search.setLocationFilter = this.search.setLocation.filter(item => {
        return item.name.includes(value);
      });
    },
    SuperMeasure() {
      //测量全部的函数
      let vm = this;
      return {
        measureDis(index) {
          vm.deActiveAll();
          handlerDis
            ? void 0
            : (handlerDis = viewerHandlerDis(
                viewer,
                0,
                vm.superMeasureData,
                index
              ));
          handlerDis && handlerDis.activate();
        },
        measureArea(index) {
          vm.deActiveAll();
          handlerArea
            ? void 0
            : (handlerArea = viewerHandlerArea(
                viewer,
                0,
                vm.superMeasureData,
                index
              ));
          handlerArea && handlerArea.activate();
        },
        measureHeight(index) {
          vm.deActiveAll();
          handlerHeight
            ? void 0
            : (handlerHeight = viewerHandlerHeight(
                viewer,
                0,
                vm.superMeasureData,
                index
              ));
          handlerHeight && handlerHeight.activate();
        },
        clearMeasure() {
          handlerDis && handlerDis.clear();
          handlerArea && handlerArea.clear();
          handlerHeight && handlerHeight.clear();
        }
      };
    },
    handleSuperMeasureActiveItem(index) {
      // 测量的emit的子定义事件
      let obj = this.superMeasureData.MeasuringConfig[index];
      let SuperMeasure = this.SuperMeasure();
      let fun = this.superMeasureData.MeasuringConfig[index].fun;
      fun && SuperMeasure[fun](index);
      index !== 3
        ? this.superMeasureData.MeasuringConfig.splice(index, 1, {
            ...obj,
            active: 1
          })
        : void 0;
    },
    handleSuperMeasureActive() {
      // 控制测量工具的显示和收缩
      this.superMeasureData.active = !this.superMeasureData.active;
    },
    handleNewDomeTitle() {
      // 首页专场的视角移动
      this.isNewDomeTitle = false;
      // 控制按钮
      setView(viewer, this.positionXYZ, this.angle);
      this.isSuperNav = true;
      // 导航栏显示
      this.isMeasure = true;
      //工具栏显示
    },
    clearTitle(value) {
      // 控制Plot 隐藏显示
      this.superPlotIndex = -1;
      this.handlePopupTitleIco(2);
    },
    handlePopupTitleIco(index) {
      // 控制导航栏的 Plot 高亮显示
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
    clearStatusAll(baseUrl, baseUrlItems) {
      baseUrl &&
        this.baseUrl.forEach(item => {
          item.active = false;
        });

      baseUrlItems &&
        this.baseUrlItems.forEach(item => {
          item.active = false;
        });
    },
    handleClickLists(index) {
      let arrFUnc = [
        "addMedical",
        "addEmergency",
        "addExpert",
        "addSupplies",
        "addCommand"
      ];
      let baseUrlItemFucName = this.baseUrlItems[index]?.fun;
      let fuc = this.baseUrlItemsFun();
      index !== 7 ? (this.baseUrlItems[index].active = true) : void 0;
      arrFUnc.includes(baseUrlItemFucName)
        ? fuc.addFuc(index)
        : fuc[baseUrlItemFucName](index);
    },
    baseUrlItemsFun() {
      let vm = this;
      return {
        addFire(index) {
          // vm.baseUrlItems[index].active = true;
          Fire = viewerMountedFire(viewer, vm.MapFireXYZ);
        },
        addCarts(index) {
          // vm.baseUrlItems[index].active = true;
          carts = viewerMountedDeployCart(viewer, vm.positionCarts);
        },
        addFuc(index) {
          console.log("addFuc");
          vm.Resources.Active.active = true;
          vm.Resources.Active.index = index;
          vm.Resources.Active.url = vm.baseUrlItems[index].url;
        },
        clearMeasure(index) {
          viewerEntities.map(item => {
            viewer.entities.remove(item);
          });
          Fire && viewer.scene.primitives.remove(Fire.FireParticleSystem);
          vm.clearStatusAll(0, 1);
        }
      };
    },
    deActiveAll() {
      handlerDis && handlerDis.deactivate();
      handlerArea && handlerArea.deactivate();
      handlerHeight && handlerHeight.deactivate();
    },
    RegCesiumClickLeft(e, position) {
      let obj = {
        show: true,
        // point: {
        //   //点
        //   pixelSize: 5,
        //   color: Cesium.Color.RED,
        //   outlineColor: Cesium.Color.WHITE,
        //   outlineWidth: 2
        // },
        billboard: {
          //图标
          image: this.Resources.Active.url,
          width: 32,
          height: 32,
          show: true
        }
      };
      let viewerEntity =
        this.Resources.Active.active &&
        viewerEntitiesAdd(
          viewer,
          { x: position.x, y: position.y, z: this.Z },
          obj
        );
      viewerEntities.push(viewerEntity);
      viewerEntity ? (this.Resources.Active.active = false) : void 0;
      viewerEntity
        ? (this.baseUrlItems[this.Resources.Active.index].active = false)
        : void 0;
    },
    RegCesiumClickRight(e, position) {
      console.log("Right", e, position);
    },
    mountedWebgl(v) {
      viewer = v;
      window.scene = viewer.scene;
      window.qaz = scene.Cartesian3;
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
    superSingularization: () =>
      import(
        /* webpackChunkName: "superNav" */ "../components/superSingularization"
      ),
    superNav: () =>
      import(/* webpackChunkName: "superNav" */ "../components/superNav"),
    popupActiveTitle: () =>
      import(
        /* webpackChunkName: "popupActiveTitle" */ "../components/popupActiveTitle"
      ),
    superPopup: () =>
      import(/* webpackChunkName: "superPopup" */ "../components/superPopup"),
    superPlot: () =>
      import(/* webpackChunkName: "superPlot" */ "../components/superPlot"),
    superMeasure: () =>
      import(
        /* webpackChunkName: "superMeasure" */ "../components/superMeasure"
      ),
    superSearch: () =>
      import(
        /* webpackChunkName: "superSearch" */ "../components/superSearch.vue"
      )
  },
  computed: {
    baseUrlOne() {
      return this.baseUrl[1];
    },
    baseUrlThree() {
      return this.baseUrl[3];
    },
    rescueActive() {
      return this.baseUrlItems[0].active && this.baseUrlItems[1].active;
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
  .newDome-measure
    position absolute
    top 10px
    right 410px
    width:74px
</style>
