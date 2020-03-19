<template>
  <div class="superPopup">
    <template v-if="baseUrlOne">
      <div class="superPopup-active">
        <div class="superPopup-title">
          <div class="superPopup-title-desc">资源部署</div>
          <div class="superPopup-title-ico" @click="handlePopupTitleIco()">
            <el-switch
              v-model="value"
              :width="superPopupTitleIcoW"
              active-color="#3B7FD5"
              inactive-color="#ffffff"
            >
            </el-switch>
          </div>
        </div>
        <div class="superPopup-main">
          <div
            class="superPopup-main-item"
            v-for="(item, index) in baseUrlItem1"
            :key="item.name"
            @click="superPopupMainItem(index, item)"
          >
            <!--suppress HtmlUnknownTarget -->
            <img :src="item.pic" alt="" />
            <span :class="{ itemActive: item.active }">{{ item.name }}</span>
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
    baseUrlOne: Object,
    baseUrlItem1: Array
  },
  data() {
    return {
      value: true,
      superPopupTitleIcoW: 43
    };
  },
  methods: {
    superPopupMainItem(index, item) {
      item.fun && this[item.fun](index, item);
    },
    AddCarts(index, item) {
      console.log("AddCarts", index, item);
      !item.active && this.$emit("addCarts", index, item);
    },
    AddFire(index, item) {
      !item.active && this.$emit("addFire", index, item);
    },
    handlePopupTitleIco() {
      this.value = true;
      this.$emit("handlePopupTitleIco", 0);
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
      display grid
      grid-template-columns 63px 63px 63px
      grid-column-gap 36px
      flex-wrap wrap
      color #ffffff
      padding 0 11px
      background-color RGBA(22, 57, 95, 0.9)
      .superPopup-main-item
        display flex
        flex-direction column
        span
          font-size 16px
        img
          height 63px
          width 63px
          padding  22px 0 5px 0
       :nth-last-child(1)
          span
            width:90px
            margin-left -10px

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
.itemActive
  color #fbe15c
</style>
