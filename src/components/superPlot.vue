<template>
  <div class="superPlot" :style="{ zIndex: superPlotIndex }">
    <div
      class="easyui-panel"
      style="position:absolute;top:0px;bottom:0px;left:0px;right:0px;width: 100%;height: 100%"
    >
      <div class="easyui-tabs" style="width: 100%;height: 100%">
        <div>
          <superTitle
            :superTitleDesc="superTitleDesc"
            @handlePopupTitleIco="handlePopupTitleIco"
          ></superTitle>
          <div class="controlPanel">
            <div class="controlPanel-item" @click="handleControlPanelItem(1)">
              取消绘制
            </div>
            <div class="controlPanel-item" @click="handleControlPanelItem(2)">
              清除绘制
            </div>
          </div>
          <div class="controlPanel">
            <div
              @click="handleControlPanel"
              :class="{ 'controlPanel-bg': isControlPanel }"
            >
              标绘面板
            </div>
            <div
              @click="handleControlPanel"
              :class="{ 'controlPanel-bg': !isControlPanel }"
            >
              属性面板
            </div>
          </div>
        </div>
        <div id="plotPanel" v-show="isControlPanel" title="标绘面板"></div>
        <div id="stylePanel" title="属性面板"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "superPlot",
  props: {
    superPlotIndex: Number
  },
  data() {
    return {
      superTitleDesc: "路径规划",
      isControlPanel: true
    };
  },
  mounted() {
    this.deleteSeleGeo();
  },
  methods: {
    deleteSeleGeo() {
      document.addEventListener("keydown", event => {
        event.keyCode === 46 && this.handleControlPanelItem(3);
        event.keyCode === 27 && this.handleControlPanelItem(1);
      });
    },
    handleControlPanelItem(index) {
      this.$emit("handleControlPanelItem", index);
    },
    handleControlPanel() {
      this.isControlPanel = !this.isControlPanel;
    },
    handlePopupTitleIco(value) {
      this.$emit("handlePopupTitleIco", value);
    }
  },
  components: {
    superTitle: () =>
      import(
        /* webpackChunkName: "superTitle" */ "../components/superTitle.vue"
      )
  }
};
</script>

<style lang="stylus" scoped>
.superPlot
  position: absolute;
  width: 250px;
  height: 100%;
  border: 1px solid #3473b7;
  z-index: 98
  top: 0
  background-color: RGBA(22, 57, 95, 0.9);
  color #ffffff
#plotPanel
  height calc(100% - 150px)
  overflow: hidden;
.controlPanel-item{
  border-top 1px solid rgb(97, 119, 117)
  border-bottom 1px solid rgb(97, 119, 117)
}
.controlPanel>div:first-of-type{
  border-right  1px solid rgb(97, 119, 117)
}
.controlPanel
  display: grid;
  grid-template-columns 50% 50%
  line-height 45px
.controlPanel-bg
  background-color #0e0e0e
.controlPanel-item:hover{
  background-color rgb(59, 127, 213)
}
  // 150 +25
/deep/.datagrid-body
  height: calc(100vh - 175px) !important
  background-color transparent !important
  overflow-y auto
/deep/.panel-body
  background-color transparent
/deep/.datagrid-btable
  color #ffffff
/deep/.propertygrid .datagrid-group
  background-color transparent
  color #ffffff
/deep/#stylePanel
    width 250px
/deep/.ztree li a
  color #ffffff
/deep/#plotPanel>div:nth-of-type(1){
  overflow hidden !important

}
/deep/#plotPanel>div:nth-of-type(2){
  overflow hidden !important
  width:calc(100% + 15px)!important
  height:calc(50% + 12px)!important
  padding-bottom 5px
}
/deep/#plotPanel>div:nth-of-type(2)>div{
  overflow-y auto important
}
</style>
