<template>
  <div class="newDome">
    <!--超图的实例-->
    <super-map
      ref="superMap"
      :url="url"
      :config="Config"
      :earth="earth"
      :createWebgl="createWebgl"
      :mountedWebgl="mountedWebgl"
      :mountedOpenMap="mountedOpenMap"
      :errorOpenMap="errorOpenMap"
      :regCesiumClickLeft="RegCesiumClickLeft"
      :regCesiumClickRight="RegCesiumClickRight"
      :regCesiumClickLayer="RegCesiumClickLayer"
    >
      <!--单体化的提示框
        superSingularizationData 数据参数
        -->
      <div id="bubble" class="bubble">
        <superSingularization
          v-if="showSuperSingularizationData"
          :superSingularizationData="superSingularizationData"
        ></superSingularization>
      </div>
      <!--这个是导航栏
        v-if="isSuperNav"
        :baseUrl="baseUrl"  导航栏的主要信息 数据
        :picUrl="picUrl"  背景图信息 数据
        @handleClick="handleClick" 点击导航栏的自定义事件
        -->
      <superNav
        v-if="isSuperNav && baseUrl.length > 0"
        :baseUrl="baseUrl"
        :picUrl="picUrl"
        @handleClick="handleClick"
      ></superNav>
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
        v-if="isBaseUrlOne"
        :baseUrlOne="baseUrlOne"
        :baseUrlItems="baseUrlItems"
        @handlePopupTitleIco="handlePopupTitleIco"
        @handleClickLists="handleClickLists"
      ></superPopup>
      <!--
        标绘面板
         superPlotIndex  定位的z-index值
         @handlePopupTitleIco 点击隐藏的自定义函数
         -->
      <superPlot
        :superPlotIndex="superPlotIndex"
        @handleControlPanelItem="handleControlPanelItem"
        @handlePopupTitleIco="clearTitle"
        @initPlot="myInitPlot"
      ></superPlot>
      <!-- 救援行动启动的弹出框
           popupActiveEndDesc  显示的文字
          -->
      <popupActiveTitle
        :popupActiveTitleDesc="popupActiveTitleDesc"
        :popupActiveBg="popupActiveBg"
        v-if="baseUrlThree.active"
      >
        <div class="popupActive-title-left" @click="popupActiveTitle(1)">
          是
        </div>
        <div class="popupActive-title-right" @click="popupActiveTitle(0)">
          否
        </div>
      </popupActiveTitle>
      <!--救援行动结束的体验
        popupActiveEndDesc  显示的文字
        -->
      <popupActiveTitle
        :popupActiveBg="popupActiveBg"
        :popupActiveTitleDesc="popupActiveEndDesc"
        v-if="popupActiveTitleDescActive"
      >
      </popupActiveTitle>
      <!--
      superMeasure 工具栏 测距 测高 侧面积  清除
      superMeasureData : 数据
      handleSuperMeasureActiveItem: 点击控制测量工具对应执行的方法
      handleSuperMeasureActive // 控制测量工具的显示和收缩
      -->
      <superMeasure
        v-if="isMeasure"
        :superMeasureData="superMeasureData"
        @handleSuperMeasureActiveItem="handleSuperMeasureActiveItem"
        @handleSuperMeasureActive="handleSuperMeasureActive"
        class="newDome-measure"
      >
      </superMeasure>
      <!--      superSearch 搜索
      search.showSuperSearchInput  是否显示input 框
      searchData 搜索传入的列表
      searchItem 点击搜索执行的方法
      searchValue 搜索data的数据
      modShowSuperSearchInput 控制是否显示隐藏input的方法
      -->
      <superSearch
        :showSuperSearchInput="search.showSuperSearchInput"
        :searchData="search.setLocationFilter"
        @searchItem="searchItem"
        @searchValue="searchValue"
        @modShowSuperSearchInput="modShowSuperSearchInput"
      ></superSearch>
    </super-map>
    <!--首页显示的按钮-->
    <div
      class="newDome-title"
      v-if="isNewDomeTitle"
      @click="handleNewDomeTitle"
    >
      进入场景
    </div>
    <div class="newDome-test">
      <router-link to="/">点击换</router-link>
    </div>
  </div>
</template>
<!--
1. 点火完毕
2 添加小车
3 等等..
      :RegCesiumClickLayer="RegCesiumClickLayer"
-->
<!--suppress JSUnusedGlobalSymbols, JSUnresolvedFunction, JSUnresolvedVariable -->
<script>
import { demoSingConfig } from "../config/mapConfig";
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
//import MeasuringConfig from "../config/MeasuringConfig.js";

//import picUrl, { item1 } from "../config/imgIcoConfig";
//import bg from "../config/bgConfig.js";

export default {
  name: "newDome",
  data() {
    return {
      ...demoSingConfig,
      superSingularizationData: {},
      isMeasure: false,
      search: {
        showSuperSearchInput: false,
        // setLocation: [...setLocation],
        setLocation: () =>
          import(
            /* webpackChunkName: "LocationConfig", webpackPrefetch: true */ "../config/LocationConfig.js"
          ),
        setLocationFilter: []
      },
      isNewDomeTitle: true,
      picUrl: {},
      superMeasureData: "",
      isSuperNav: false,
      baseUrl: [],
      baseUrlItems: [],
      superPlotIndex: -1,
      isRescue: false,
      popupActiveBg: "111",
      popupActiveEndDesc: "总攻结束",
      popupActiveTitleDesc: "是否发起总攻",
      popupActiveTitleDescActive: false,
      bgConfig: "",
      Resources: {
        Active: {
          active: false,
          index: undefined,
          url: ""
        }
      }
    };
  },
  destroyed() {
    //  Cesium = undefined;
    console.log("销毁函数执行");
    console.log("销毁函数执行");
  },
  async created() {
    const imgIcoConfig = () =>
      import(
        /* webpackChunkName: "imgIcoConfig", webpackPrefetch: true */ "../config/imgIcoConfig"
      );
    const MeasuringConfig = () =>
      import(
        /* webpackChunkName: "MeasuringConfig", webpackPrefetch: true */ "../config/MeasuringConfig.js"
      );
    const res = await import(
      /* webpackChunkName: "bgConfig", webpackPrefetch: true */ "../config/bgConfig"
    );
    this.popupActiveBg = res.default.bg;
    const setLocation = await this.search.setLocation();
    this.search.setLocation = setLocation.setLocation;
    let imgIcoConfigRes = await imgIcoConfig();
    imgIcoConfigRes = JSON.parse(JSON.stringify(imgIcoConfigRes.data()));
    this.picUrl = imgIcoConfigRes.bgData;
    this.baseUrl = imgIcoConfigRes.baseUrl;
    this.baseUrlItems = imgIcoConfigRes.item1;
    let MeasuringConfigRes = await MeasuringConfig();
    MeasuringConfigRes = JSON.parse(
      JSON.stringify(new MeasuringConfigRes.data())
    );
    this.superMeasureData = MeasuringConfigRes;
  },
  methods: {
    /***
     *
     * @param value.showSuperSearchInput修改的值
     */
    modShowSuperSearchInput(value) {
      this.search.showSuperSearchInput = value;
    },
    searchItem(item) {
      setView(this.viewer.scene, item.position, item.angle);
      this.search.showSuperSearchInput = false;
      this.isNewDomeTitle ? (this.isNewDomeTitle = false) : void 0;
      !this.isSuperNav ? (this.isSuperNav = true) : void 0;
      !this.isMeasure ? (this.isMeasure = true) : void 0;
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
          vm.handlerDis
            ? void 0
            : (vm.handlerDis = viewerHandlerDis(
                vm.viewer,
                0,
                vm.superMeasureData,
                index
              ));
          vm.handlerDis && vm.handlerDis.activate();
        },
        measureArea(index) {
          vm.deActiveAll();
          vm.handlerArea
            ? void 0
            : (vm.handlerArea = viewerHandlerArea(
                vm.viewer,
                0,
                vm.superMeasureData,
                index
              ));
          vm.handlerArea && vm.handlerArea.activate();
        },
        measureHeight(index) {
          vm.deActiveAll();
          vm.handlerHeight
            ? void 0
            : (vm.handlerHeight = viewerHandlerHeight(
                vm.viewer,
                0,
                vm.superMeasureData,
                index
              ));
          vm.handlerHeight && vm.handlerHeight.activate();
        },
        clearMeasure() {
          vm.handlerDis && vm.handlerDis.clear();
          vm.handlerArea && vm.handlerArea.clear();
          vm.handlerHeight && vm.handlerHeight.clear();
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
      setView(this.viewer, this.positionXYZ, this.angle);
      this.isSuperNav = true;
      // 导航栏显示
      this.isMeasure = true;
      //工具栏显示
    },
    clearTitle() {
      // 控制Plot 隐藏显示
      this.superPlotIndex = -1;
      this.handlePopupTitleIco(2);
    },
    handleControlPanelItem(index) {
      // 1  清除动态绘制
      // Plot.plottingLayer.removeAll();
      // 2  清除消除的状态
      // Plot.plotDrawControl.deactivate();
      // 3 清除选中的绘制
      index === 1
        ? this.Plot.plotDrawControl.deactivate()
        : index === 2
        ? this.Plot.plottingLayer.removeAll()
        : index === 3
        ? this.Plot.plottingLayer.removeGeoGraphicObject(
            this.Plot.plottingLayer.selectedFeature
          )
        : void 0;
    },
    handlePopupTitleIco(index) {
      // 控制导航栏的 Plot 高亮显示
      this.baseUrl[index].active = !this.baseUrl[index].active;
    },
    //
    navHandleClick() {
      let vm = this;
      return {
        navHandleClick1() {
          return true;
        },
        navHandleClick2() {
          return (vm.superPlotIndex = 666);
        },
        navHandleClick3() {
          return vm.rescueActive ? (vm.isRescue = true) : false;
        },
        navHandleClick0() {
          return true;
        },
        navHandleClick4() {
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
          ? (item.active = true)
          : (item.active = false);
      });
    },
    popupActiveTitle(value) {
      console.log(value);
      value && this.rescue();
      value ? (this.isSuperNav = false) : void 0;
      this.isRescue = false;
      // 清除所有状态
      this.clearStatusAll(1, 0);
    },
    async rescue() {
      let isRescue = await viewerCreateFireFighting(
        this.viewer,
        this.MapFireXYZ,
        this.positionCarts,
        this.carts,
        this.fire
      );
      this.popupActiveTitleDescActive = true;
      isRescue && this.clearStatusAll(1, 1);
      isRescue && this.clearEntities(this.carts);
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
        this.viewer.entities.remove(entity);
      });
    },
    "Entities[object Object]"(Entities) {
      this.viewer.entities.remove(Entities);
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
        addFire() {
          // vm.baseUrlItems[index].active = true;
          vm.fire = viewerMountedFire(vm.viewer, vm.MapFireXYZ);
        },
        addCarts() {
          // vm.baseUrlItems[index].active = true;
          vm.carts = viewerMountedDeployCart(vm.viewer, vm.positionCarts);
        },
        addFuc(index) {
          console.log("addFuc");
          vm.Resources.Active.active = true;
          vm.Resources.Active.index = index;
          vm.Resources.Active.url = vm.baseUrlItems[index].url;
        },
        clearMeasure() {
          vm.viewerEntities.map(item => {
            vm.viewer.entities.remove(item);
          });
          vm.carts && vm.clearEntities(vm.carts);
          vm.fire &&
            vm.viewer.scene.primitives.remove(vm.fire.FireParticleSystem);
          vm.clearStatusAll(0, 1);
          // 清除状态
          vm.Plot.plottingLayer.removeAll();
          // 清除消除的状态
          vm.Plot.plotDrawControl.deactivate();
        }
      };
    },
    deActiveAll() {
      this.handlerDis && this.handlerDis.deactivate();
      this.handlerArea && this.handlerArea.deactivate();
      this.handlerHeight && this.handlerHeight.deactivate();
    },
    clearLayers() {
      plottingLayer.removeAll();
    },
    RegCesiumClickLeft(e, position) {
      console.log("RegCesiumClickLeft执行了");
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
          this.viewer,
          { x: position.x, y: position.y, z: this.Z },
          obj
        );
      this.viewerEntities.push(viewerEntity);
      viewerEntity ? (this.Resources.Active.active = false) : void 0;
      viewerEntity
        ? (this.baseUrlItems[this.Resources.Active.index].active = false)
        : void 0;
    },
    RegCesiumClickRight(e, position) {
      console.log("Right", e, position);
    },
    mountedWebgl(v) {
      this.viewer = v;
      this.viewerEntities = [];
      // window.scene = this.viewer.scene;
      // window.qaz = scene.Cartesian3;
    },
    mountedOpenMap(viewer, layers) {},
    myInitPlot() {
      try {
        this.Plot = InitPlot(this.viewer, this.serverUrl);
      } catch (e) {
        console.log(e);
      }
    },
    createWebgl(vm) {
      // vm是 superMap的this
    },
    errorOpenMap(e) {},
    RegCesiumClickLayer(feature) {
      this.superSingularizationData = {
        ...this.search.setLocation[feature.SMID - 0 - 1]
          .superSingularizationData
      };
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
      return this.baseUrl.length > 0 ? this.baseUrl[1] : undefined;
    },
    isBaseUrlOne() {
      return this.baseUrl.length > 0 ? this.baseUrl[1].active : undefined;
    },
    baseUrlThree() {
      return this.baseUrl.length > 0 ? this.baseUrl[3] : [];
    },
    rescueActive() {
      return this.baseUrlItems[0].active && this.baseUrlItems[1].active;
    },
    showSuperSingularizationData() {
      return Object.keys(this.superSingularizationData).length > 0;
    }
  }
};
</script>

<style lang="stylus">
.newDome .cesium-viewer-navigationContainer
    display none
.newDome-test
  position fixed
  top 100px
  left 400px
  width 100px
  height 100px
  background-color #00a65a
.newDome
    position relative
    width:100%
    height:100%
    overflow hidden
  .newDome-title
      position absolute
      top 20px
      width 84px
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
