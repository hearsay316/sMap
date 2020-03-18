<template>
  <div class="superPopup">
    <template v-for="(item, index) in baseUrl">
      <div class="superPopup-active" v-if="item.Active" :key="item.name">
        <div class="superPopup-title">
          <div class="superPopup-title-desc">资源部署</div>
          <div class="superPopup-title-ico" @click="handlePopupTitleIco(index)">
            <el-switch
              v-model="value"
              :width="superPopupTitleIcoW"
              active-color="#3B7FD5"
              inactive-color="#ffffff"
            >
            </el-switch>
          </div>
        </div>
        <div class="superPopup-main" :key="item.name">
          <div
            class="superPopup-main-item"
            v-for="(item, index) in baseUrlItem1"
            :key="item.name"
            @click="superPopupMainItem(index)"
          >
            <img :src="item.pic" alt="" />
            <span>{{ item.name }}</span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: "superPopup",
  props: {
    baseUrl: Array,
    baseUrlItem1: Array
  },
  data() {
    return {
      value: true,
      superPopupTitleIcoW: 43,
      superPopupMainData: [
        {
          pic: "",
          name: "火点",
          func: "xxx"
        }
      ]
    };
  },
  methods: {
    superPopupMainItem(func) {
      this[func]();
    },
    handlePopupTitleIco(index) {
      console.log(index);
      this.value = true;
      this.$emit("handlePopupTitleIco", index);
    }
  }
};
</script>

<style lang="stylus" scoped>
.superPopup
    position absolute
    top 0
    bottom 0
    margin auto
    right 365px
    width:280px
    height:393px
    .superPopup-title
      height 56px
      font-size 23px
      font-weight 600
      color #ffffff
      display flex
      justify-content space-between
      padding 15.8px 37px 17.2px 37px
      background-color RGBA(55, 99, 150, 0.98)
      box-sizing border-box
      .superPopup-title-ico
        margin-top: -3.2px;
    .superPopup-main
      height 337px
      display flex
      flex-wrap wrap
      color #ffffff
      /*padding 0 11px*/
      background-color RGBA(22, 57, 95, 0.9)
      .superPopup-main-item
        width:33.33%
        display flex
        flex-direction column
        align-items center
        span
          font-size 16px
        img
          height 63px
          width 63px
          padding  22px 0 5px 0

/deep/.el-switch__core
  height 23px
/deep/.el-switch.is-checked .el-switch__core::after {
    left: 100%;
    margin-left: -20px;
  }
/deep/.el-switch__core:after {
      top: -1px;
      left: -4px;
      width: 23px;
      height: 23px;
 }
</style>
