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
      <div class="controlPanel">
        <div
          @click="handleControlPanel('plotPanel')"
          :class="{ 'controlPanel-bg': isControlPanel }"
        >
          标绘面板
        </div>
        <div
          @click="handleControlPanel('stylePanel')"
          :class="{ 'controlPanel-bg': !isControlPanel }"
        >
          属性面板
        </div>
      </div>
    </div>
    <div class="easyui-panel">
      <div class="easyui-tabs" style="width: 100%;height: 100%">
        <div ref="plotPanel" id="plotPanel" title="标绘面板"></div>
        <div ref="stylePanel" id="stylePanel" title="属性面板"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "superPlot",
  data() {
    return {
      superTitleDesc: "路径规划",
      isControlPanel: true,
      resourcesMountedTime: null,
      superPlotIsCesiumUse: false
    };
  },
  props: {
    superPlotIndex: Number,
    superPlotIsCesium: Boolean
  },
  watch: {
    superPlotIsCesium: {
      handler: function(newP, old) {
        newP && !this.superPlotIsCesiumUse && this.superPlotIsCesiumInit(newP);
      },
      deep: true,
      immediate: true
    }
  },

  mounted() {
    this.Init();
  },
  methods: {
    superPlotIsCesiumInit(newP) {
      this.superPlotIsCesiumUse = true;
      console.log(new Date(), 1);
      const basePathInit = this.basePathInit();
      this.urlUpRecursive(basePathInit).then(
        res => {
          this.$emit("initPlot");
          this.resourcesMountedTime = null;
        },
        error => {
          console.log(error);
        }
      );
    },
    basePathInit() {
      const { plotBasePath } = this._Cesium();
      if (!plotBasePath) {
        throw new Error("plotBasePath 错误");
      }
      let fucType =
        "plotBasePath" + Object.prototype.toString.call(plotBasePath);
      return typeof this[fucType] === "function" && this[fucType](plotBasePath);
    },
    "plotBasePath[object String]"() {},
    "plotBasePath[object Array]"(path) {
      // url正则
      const URL_REGULAR_EXPRESSION = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
      const objExp = new RegExp(URL_REGULAR_EXPRESSION);
      return path;
    },
    Init() {
      this.deleteSeleGeo();
      // this.resourcesMounted();
    },
    deleteSeleGeo() {
      document.addEventListener("keydown", event => {
        event.keyCode === 46 && this.handleControlPanelItem(3);
        event.keyCode === 27 && this.handleControlPanelItem(1);
      });
    },
    handleControlPanelItem(index) {
      this.$emit("handleControlPanelItem", index);
    },
    handleControlPanel(type) {
      this.isControlPanel = !this.isControlPanel;
      console.log(this.$refs.plotPanel);
      let panel = this.$refs.stylePanel.parentNode.className;
      if (panel === "panel") {
        if (type === "stylePanel") {
          this.$refs.plotPanel.style.display = "none";
          this.$refs.stylePanel.parentNode.style.display = "block";
        }
        if (type === "plotPanel") {
          this.$refs.plotPanel.style.display = "block";
          this.$refs.stylePanel.parentNode.style.display = "none";
        }
      } else {
        if (type === "stylePanel") {
          this.$refs.plotPanel.style.display = "none";
        }
        if (type === "plotPanel") {
          this.$refs.plotPanel.style.display = "block";
        }
      }
    },
    handlePopupTitleIco(value) {
      this.$emit("handlePopupTitleIco", value);
    },
    link(url) {
      return new Promise((resolve, reject) => {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.className = "superMapPlotLink";
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
        script.className = "superMapPlotScript";
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
        document.getElementsByTagName("body")[0].appendChild(script);
      });
    }, // 递归是
    urlUpRecursive(arr) {
      const vm = this;
      let index = 0;
      async function next(arr, index) {
        if (arr.length === index) {
          return { type: 1 };
        }
        let data = await vm.processUrl(arr[index++]);
        if (data === 1) {
          return await next(arr, index);
        }
      }
      return next(arr, index);
    },
    // 并发
    urlUp(arr) {
      const promiseArr = arr.map(item => {
        return this.processUrl(item);
      });
      return Promise.all(promiseArr);
    },
    processUrl(url) {
      return url.includes(".css")
        ? this.link(url)
        : url.includes(".js")
        ? this.script(url)
        : void 0;
    },
    resourcesMounted() {
      this.resourcesMountedTime && clearInterval(this.resourcesMountedTime);
      /*这个顺序不能乱, 是根据script标签的加载顺序调成的,测试自会后是加载到vue的mounted函数可以适应同页面多组件多渲染不冲突(待确认)*/
      let Data = [
        "colorpicker/css/colorpicker.css",
        "colorpicker/css/layout.css",
        "jquery-easyui-1.4.4/css/easyui.css",
        "zTree/css/zTreeStyle.css",
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
      ];
      const basePathInit = this.basePathInit();
      if (typeof Cesium === "object") {
        console.log(new Date(), 2);
        this.urlUpRecursive(basePathInit).then(
          res => {
            this.$emit("initPlot");
            this.resourcesMountedTime = null;
          },
          error => {
            console.log(error);
          }
        );
      } else {
        this.resourcesMountedTime = setInterval(() => {
          this.resourcesMounted();
        }, 100);
      }
    }
  },
  components: {
    superTitle: () =>
      import(
        /* webpackChunkName: "superTitle" */ "../components/superTitle.vue"
      )
  },
  created() {},
  destroyed() {
    console.log("删除成功");
    let arrLink = document.querySelectorAll(".superMapPlotLink");
    let arrScript = document.querySelectorAll(".superMapPlotScript");
    arrLink.forEach(link => {
      document.getElementsByTagName("head")[0].removeChild(link);
    });
    arrScript.forEach(script => {
      document.getElementsByTagName("body")[0].removeChild(script);
    });
    console.log("删除成功");
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
  height calc(100vh  - 147px)!important
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
  height calc(100vh  - 147px)
  position: absolute;
  top: 147px;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  overflow hidden
}
/deep/.panel-body
  background-color transparent
  color #ffffff
/deep/.datagrid-btable
  color #ffffff
/deep/.propertygrid .datagrid-group
  background-color transparent
  color #ffffff
/deep/.ztree li a
  color #ffffff
/deep/.tabs-panels{
  height calc(100vh  - 152px)!important
}
/deep/.datagrid-view{
    height: calc(100vh - 138px) !important
}
  // 147+25 72
/deep/.datagrid-body
  height: calc(100vh - 180px) !important
  background-color transparent !important
  overflow-y auto

/deep/#stylePanel
    width 250px

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

/deep/ .tabs-wrap> .tabs{
  width 248px
  display grid
  grid-template-columns 50% 50%
  padding: 0;
}
/deep/.tabs >li >a{
  width: 100%
  border: 0px;
  padding: 0px;
}


/deep/ .tabs-wrap> .tabs > .tabs-first{
  margin:0
  padding: 0
}
/deep/.tabs-header {
  display none
}
/deep/#plotPanel tr {
  height 30px!important
}
</style>
