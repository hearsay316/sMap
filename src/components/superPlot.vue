<template>
  <div class="superPlot" :style="{ zIndex: superPlotIndex }">
    <div class="superPlot-config">
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
      <!--      <div class="controlPanel">-->
      <!--        <div-->
      <!--          @click="handleControlPanel"-->
      <!--          :class="{ 'controlPanel-bg': isControlPanel }"-->
      <!--        >-->
      <!--          标绘面板-->
      <!--        </div>-->
      <!--        <div-->
      <!--          @click="handleControlPanel"-->
      <!--          :class="{ 'controlPanel-bg': !isControlPanel }"-->
      <!--        >-->
      <!--          属性面板-->
      <!--        </div>-->
      <!--      </div>-->
    </div>
    <div class="easyui-panel">
      <div class="easyui-tabs" style="width: 100%;height: 100%">
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
    },
    link(url) {
      return new Promise((resolve, reject) => {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.onload = function() {
          resolve(1);
        };
        link.onerror = function() {
          reject(0);
        };
        link.href = "webgl/examples/js/plotPanelControl/" + url;
        document.getElementsByTagName("head")[0].appendChild(link);
      });
    },
    script(url) {
      return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.type = "text/javascript";
        if (script.readyState) {
          //IE
          script.onreadystatechange = function() {
            if (
              script.readyState == "loaded" ||
              script.readyState == "complete"
            ) {
              script.onreadystatechange = null;
              resolve(1);
            }
          };
        } else {
          //Others
          script.onload = function() {
            resolve(1);
          };
          script.onerror = function() {
            reject(0);
          };
        }
        script.src = "webgl/examples/js/plotPanelControl/" + url;
        document.getElementsByTagName("head")[0].appendChild(script);
      });
    }
  },
  components: {
    superTitle: () =>
      import(
        /* webpackChunkName: "superTitle" */ "../components/superTitle.vue"
      )
  },
  created() {
    const vm = this;
    let Data = [
      [
        "colorpicker/css/colorpicker.css",
        "colorpicker/css/layout.css",
        "jquery-easyui-1.4.4/css/easyui.css",
        "zTree/css/zTreeStyle.css"
      ],
      [
        "jquery-easyui-1.4.4/jquery.min.js",
        "jquery-easyui-1.4.4/jquery-ui.js",
        "jquery-easyui-1.4.4/jquery.easyui.min.js",
        "colorpicker/js/colorpicker.js",
        "colorpicker/js/colorpickerEditor.js",
        "colorpicker/js/eye.js",
        "colorpicker/js/utils.js",
        "colorpicker/js/layout.js",
        "zTree/jquery.ztree.core.js",
        "./StylePanel.js",
        "./PlotPanel.js"
      ]
    ];
    function scriptAdd(arr) {
      let index = 0,
        dataIndex = 0;
      async function next(arr, index, dataIndex) {
        console.log(arr, index, dataIndex);
        if (
          arr.length === index + 1 &&
          arr[arr.length - 1].length === dataIndex
        ) {
          return "成功";
        }
        if (index === 0) {
          console.log("ddddd", arr[index]);
          if (arr[index].length === dataIndex) {
            return next(arr, ++index, 0);
          }
          console.log(dataIndex, arr[index].length);
          let data = await vm.link(arr[index][dataIndex++]);
          if (data === 1) {
            return await next(arr, index, dataIndex);
          }
        }
        if (index === 1) {
          let data = await vm.script(arr[index][dataIndex++]);
          console.log(data);
          if (data === 1) {
            return await next(arr, index, dataIndex);
          }
        }
      }
      return next(arr, index, dataIndex);
    }
    scriptAdd(Data).then(
      res => {
        console.log(res, "低洼的地方");
        this.$emit("initPlot");
      },
      error => {
        console.log(error);
      }
    );
    // urlData.inputLink.forEach(item => {
    //   let doc = document.createElement("link");
    //   doc.onload = function() {
    //     console.log("OK");
    //   };
    //   doc.href = "webgl/examples/js/plotPanelControl/" + item;
    //   document.head.appendChild(doc);
    // });
    // urlData.inputScript.forEach(item => {
    //   let doc = document.createElement("script");
    //   doc.onload = function() {
    //     console.log("OK");
    //   };
    //   doc.src = "webgl/examples/js/plotPanelControl/" + item;
    //   document.head.appendChild(doc);
    // });
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
.superPlot-config
  width 100%
  position absolute
  top 0
  left 0
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
.easyui-panel{
  height: calc(100vh - 175px) !important
  position: absolute;
  top: 104px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  width: 100%;
}
.easyui-panel > div {
  height:100% !important
}
  // 150 +25
/deep/.datagrid-body
  height: calc(100vh - 175px) !important
  background-color transparent !important
  overflow-y auto
/deep/.panel-body
  background-color transparent
  color #ffffff
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
